package expo.modules.myarscreenshot

import android.graphics.Bitmap
import android.opengl.GLES20
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.PixelCopy
import android.view.SurfaceView
import android.view.TextureView
import android.view.View
import android.view.ViewGroup
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.UUID
import javax.microedition.khronos.egl.EGL10
import javax.microedition.khronos.egl.EGLContext

class MyArScreenshotModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyArScreenshot")

    AsyncFunction("captureScreen") { promise: Promise ->
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
        promise.reject("ERR_API", "Need Android N+", null)
        return@AsyncFunction
      }

      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ERR_NO_ACTIVITY", "No Activity", null)
        return@AsyncFunction
      }

      // 1. Suche den View und Logge, was wir finden
      val rootView = activity.window.decorView.rootView
      Log.d("AR_SHOT", "Starte Suche nach SurfaceView in Root: $rootView")
      
      // Debug: Log all views in hierarchy
      logViewHierarchy(rootView, 0)
      
      // Find AR GLSurfaceView
      val arView = findARView(rootView)

      if (arView == null) {
        Log.e("AR_SHOT", "No GLSurfaceView found!")
        promise.reject("ERR_NO_VIEW", "No AR view found", null)
        return@AsyncFunction
      }

      Log.d("AR_SHOT", "Found AR View: ${arView.javaClass.simpleName}, Size: ${arView.width}x${arView.height}")

      val width = arView.width
      val height = arView.height

      // Use direct PixelCopy - it's reliable and handles AR properly
      readGLPixelsDirectly(arView as SurfaceView, width, height, promise)
    }
  }

  // Read GL pixels using PixelCopy (waits for next complete frame)
  private fun readGLPixelsDirectly(surfaceView: SurfaceView, width: Int, height: Int, promise: Promise) {
    Log.d("AR_SHOT", "Capturing AR screenshot with PixelCopy...")
    
    val handler = Handler(Looper.getMainLooper())
    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    
    PixelCopy.request(surfaceView, bitmap, { result ->
      if (result == PixelCopy.SUCCESS) {
        Log.d("AR_SHOT", "✓ Screenshot captured successfully")
        saveBitmap(bitmap, promise)
      } else {
        Log.e("AR_SHOT", "✗ Screenshot failed: $result")
        promise.reject("ERR_PIXELCOPY", "Screenshot failed: $result", null)
      }
    }, handler)
  }

  private fun captureViewSync(view: View, bitmap: Bitmap, callback: (Boolean) -> Unit) {
    val handler = Handler(Looper.getMainLooper())
    
    if (view is SurfaceView) {
      PixelCopy.request(view, bitmap, { result ->
        val success = result == PixelCopy.SUCCESS
        if (success) {
          Log.d("AR_SHOT", "PixelCopy Success for ${view.javaClass.simpleName}")
        } else {
          Log.e("AR_SHOT", "PixelCopy Failed Code: $result")
        }
        callback(success)
      }, handler)
    } else if (view is TextureView) {
      try {
        val textureBitmap = view.getBitmap(bitmap.width, bitmap.height)
        if (textureBitmap != null) {
          val canvas = android.graphics.Canvas(bitmap)
          canvas.drawBitmap(textureBitmap, 0f, 0f, null)
          callback(true)
        } else {
          callback(false)
        }
      } catch (e: Exception) {
        Log.e("AR_SHOT", "TextureView capture error", e)
        callback(false)
      }
    } else {
      callback(false)
    }
  }

  private fun pixelCopySurface(view: SurfaceView, bitmap: Bitmap, promise: Promise) {
    val handler = Handler(Looper.getMainLooper())
    PixelCopy.request(view, bitmap, { result ->
        if (result == PixelCopy.SUCCESS) {
            Log.d("AR_SHOT", "PixelCopy Success!")
            saveBitmap(bitmap, promise)
        } else {
            Log.e("AR_SHOT", "PixelCopy Failed Code: $result")
            promise.reject("ERR_COPY", "PixelCopy failed: $result", null)
        }
    }, handler)
  }

  private fun saveBitmap(bitmap: Bitmap, promise: Promise) {
    try {
      val context = appContext.reactContext ?: throw Exception("React Context null")
      val file = File(context.cacheDir, "ar-${UUID.randomUUID()}.png")
      val out = FileOutputStream(file)
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
      out.flush()
      out.close()
      promise.resolve(file.absolutePath)
    } catch (e: Exception) {
      promise.reject("ERR_SAVE", "Save failed", e)
    }
  }

  // Find camera view (SurfaceView or TextureView that's NOT GLSurfaceView)
  private fun findCameraView(view: View): View? {
    // Log all views we check for debugging
    val className = view.javaClass.simpleName
    val isVisible = view.visibility == View.VISIBLE
    val size = "${view.width}x${view.height}"
    
    // Check if this is a rendering surface (but not GL)
    if (view is TextureView && view.width > 100 && view.height > 100 && isVisible) {
      Log.d("AR_SHOT", "✓ Camera TextureView found: $size")
      return view
    }
    
    if (view is SurfaceView && className != "GLSurfaceView" && view.width > 100 && view.height > 100 && isVisible) {
      Log.d("AR_SHOT", "✓ Camera SurfaceView found: $className, $size")
      return view
    }
    
    // Recurse into children
    if (view is ViewGroup) {
      for (i in 0 until view.childCount) {
        val child = view.getChildAt(i)
        val result = findCameraView(child)
        if (result != null) return result
      }
    }
    return null
  }

  // Debug helper: Log entire view hierarchy
  private fun logViewHierarchy(view: View, depth: Int) {
    val indent = "  ".repeat(depth)
    val className = view.javaClass.simpleName
    val size = "${view.width}x${view.height}"
    val visibility = when (view.visibility) {
      View.VISIBLE -> "VISIBLE"
      View.INVISIBLE -> "INVISIBLE"
      View.GONE -> "GONE"
      else -> "?"
    }
    
    // Special marking for surface views
    val marker = when {
      view is TextureView -> "📹 TEXTURE"
      className == "GLSurfaceView" -> "🎮 GL"
      view is SurfaceView -> "📺 SURFACE"
      else -> ""
    }
    
    Log.d("AR_SHOT", "$indent$className $size $visibility $marker")
    
    if (view is ViewGroup) {
      for (i in 0 until view.childCount) {
        logViewHierarchy(view.getChildAt(i), depth + 1)
      }
    }
  }

  // Find AR GLSurfaceView (3D rendering layer)
  private fun findARView(view: View): View? {
    if (view.javaClass.simpleName == "GLSurfaceView") {
      if (view.width > 100 && view.height > 100 && view.visibility == View.VISIBLE) {
        Log.d("AR_SHOT", "AR GLSurfaceView found: Size: ${view.width}x${view.height}")
        return view
      }
    }
    
    if (view is ViewGroup) {
      for (i in 0 until view.childCount) {
        val result = findARView(view.getChildAt(i))
        if (result != null) return result
      }
    }
    return null
  }

  // Rekursive Suche nach SurfaceView ODER TextureView
  private fun findTargetView(view: View): View? {
    // Check ob es ein SurfaceView ist UND sichtbar ist
    if (view is SurfaceView) {
        if (view.width > 100 && view.height > 100 && view.visibility == View.VISIBLE) {
            Log.d("AR_SHOT", "Candidate SurfaceView found: ${view.javaClass.simpleName}, Size: ${view.width}x${view.height}")
            return view
        }
    }
    // Manchmal nutzen Engines TextureView
    if (view is TextureView) {
        if (view.width > 100 && view.height > 100 && view.visibility == View.VISIBLE) {
             Log.d("AR_SHOT", "Candidate TextureView found: ${view.javaClass.simpleName}, Size: ${view.width}x${view.height}")
            return view
        }
    }

    // Recurse into children (depth-first search)
    if (view is ViewGroup) {
      // Store all candidates and pick the largest one (likely the main AR view)
      var bestCandidate: View? = null
      var maxArea = 0
      
      for (i in 0 until view.childCount) {
        val child = view.getChildAt(i)
        val result = findTargetView(child)
        if (result != null) {
          val area = result.width * result.height
          if (area > maxArea) {
            maxArea = area
            bestCandidate = result
          }
        }
      }
      
      if (bestCandidate != null) {
        Log.d("AR_SHOT", "Selected view with largest area: ${bestCandidate.width}x${bestCandidate.height}")
      }
      
      return bestCandidate
    }
    return null
  }
}