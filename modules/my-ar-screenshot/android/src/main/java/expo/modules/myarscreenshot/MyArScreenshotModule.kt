package expo.modules.myarscreenshot

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.media.projection.MediaProjectionManager
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.PixelCopy
import android.view.SurfaceView
import android.view.View
import android.view.ViewGroup
import android.graphics.Matrix
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.YuvImage
import android.graphics.BitmapFactory
import android.media.Image
import com.google.ar.core.Session
import com.google.ar.core.Frame
import com.google.ar.core.exceptions.NotYetAvailableException
import java.io.ByteArrayOutputStream
import java.lang.reflect.Field
import java.nio.ByteBuffer
import java.nio.ByteOrder
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.view.TextureView
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

class MyArScreenshotModule : Module() {
  
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React Context is null")

  private val mediaProjectionManager: MediaProjectionManager
    get() = context.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

  private var capturePromise: Promise? = null

  private val captureReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
          if (intent?.action == "expo.modules.myarscreenshot.CAPTURE_COMPLETE") {
              val uri = intent.getStringExtra("URI")
              if (uri != null) {
                  capturePromise?.resolve(uri)
              } else {
                  capturePromise?.reject("ERR_CAPTURE_FAILED", "No URI returned", null)
              }
              capturePromise = null
              try {
                this@MyArScreenshotModule.context.unregisterReceiver(this)
              } catch(e: Exception) {
                  // Ignore if already unregistered
              }
          }
      }
  }

  override fun definition() = ModuleDefinition {
    Name("MyArScreenshot")

    AsyncFunction("reset") {
      capturePromise = null
      Log.d("AR_SHOT", "🔄 State reset manually")
      return@AsyncFunction true
    }

    AsyncFunction("captureScreen") { promise: Promise ->
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
        promise.reject("ERR_API", "Requires Android 7.0+", null)
        return@AsyncFunction
      }

      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ERR_NO_ACTIVITY", "No Activity available", null)
        return@AsyncFunction
      }

      // 1. Find the AR rendering surface (GLSurfaceView)
      val rootView = activity.window.decorView.rootView
      
      val arView = findARView(rootView)
      if (arView == null) {
        Log.e("AR_SHOT", "❌ No GLSurfaceView/TextureView found")
        promise.reject(
          "ERR_NO_VIEW",
          "AR rendering view not found",
          null
        )
        return@AsyncFunction
      }

      val width = arView.width
      val height = arView.height

      if (width < 100 || height < 100) {
        promise.reject("ERR_SIZE", "AR view too small", null)
        return@AsyncFunction
      }

      // If it's a TextureView, we can use getBitmap directly!
      if (arView is TextureView) {
          Log.d("AR_SHOT", "🎨 Valid TextureView found - attempting direct bitmap capture...")
          val bitmap = arView.getBitmap()
          if (bitmap != null) {
              saveBitmap(bitmap, promise)
              return@AsyncFunction
          }
          Log.w("AR_SHOT", "⚠️ TextureView returned null bitmap")
      }

      // 2. Attempt PixelCopy using the WINDOW request
      // This is often more robust for complex hierarchies (GL + Video) than targeting the SurfaceView directly
      if (arView is SurfaceView) {
        captureWithPixelCopy(arView as SurfaceView, width, height, promise)
      } else {
        promise.reject("ERR_TYPE", "View is determined but not a SurfaceView/TextureView", null)
      }
    }

    AsyncFunction("captureARCore") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ERR_NO_ACTIVITY", "No Activity available", null)
        return@AsyncFunction
      }

      val session = findARSession(activity.window.decorView.rootView)
      if (session == null) {
          promise.reject("ERR_NO_SESSION", "Could not find ARCore Session. Ensure Viro is running.", null)
          return@AsyncFunction
      }

      captureFromSession(session, promise)
    }

    AsyncFunction("requestScreenCapture") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ERR_NO_ACTIVITY", "Activity is null", null)
        return@AsyncFunction
      }
      
      if (capturePromise != null) {
          promise.reject("ERR_BUSY", "Capture already in progress", null)
          return@AsyncFunction
      }

      capturePromise = promise
      try {
          // val intent = mediaProjectionManager.createScreenCaptureIntent()
          // if (Build.VERSION.SDK_INT >= 34) {
          //     Log.d("AR_SHOT", "✨ Creating specific Screen Capture intent for Default Display (Android 14+)")
          //     val config = android.media.projection.MediaProjectionConfig.createConfigForDefaultDisplay()
          //     mediaProjectionManager.createScreenCaptureIntent(config)
          // } else {
          //     mediaProjectionManager.createScreenCaptureIntent()
          // }
          // activity.startActivityForResult(intent, SCREEN_CAPTURE_REQUEST_CODE)

          val intent = mediaProjectionManager.createScreenCaptureIntent()
          activity.startActivityForResult(intent, SCREEN_CAPTURE_REQUEST_CODE)
      } catch (e: Exception) {
          capturePromise = null
          promise.reject("ERR_LAUNCH_FAILED", "Failed to launch capture intent: ${e.message}", e)
      }
    }

    OnActivityResult { activity, payload ->
        if (payload.requestCode == SCREEN_CAPTURE_REQUEST_CODE) {
            if (payload.resultCode == Activity.RESULT_OK) {
                val data = payload.data
                if (data != null) {
                    startMediaProjectionService(payload.resultCode, data)
                } else {
                    capturePromise?.reject("ERR_NO_DATA", "MediaProjection Intent data is null", null)
                    capturePromise = null
                }
            } else {
                capturePromise?.reject("ERR_CANCELLED", "User denied screen recording", null)
                capturePromise = null
            }
        }
    }
  }

  private fun startMediaProjectionService(resultCode: Int, data: Intent) {
       Log.d("MediaProjection", "🚀 Module: Starting Service... Intent data valid? " + (data != null))
       val filter = IntentFilter("expo.modules.myarscreenshot.CAPTURE_COMPLETE")
       if (Build.VERSION.SDK_INT >= 33) {
            context.registerReceiver(captureReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
       } else {
            context.registerReceiver(captureReceiver, filter)
       }

       val serviceIntent = Intent(context, MediaProjectionService::class.java).apply {
           putExtra("RESULT_CODE", resultCode)
           putExtra("RESULT_DATA", data)
       }
       
       try {
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
               Log.d("MediaProjection", "🚀 Context.startForegroundService called")
               context.startForegroundService(serviceIntent)
           } else {
               Log.d("MediaProjection", "🚀 Context.startService called")
               context.startService(serviceIntent)
           }
       } catch (e: Exception) {
           Log.e("MediaProjection", "❌ Service start failed: ${e.message}", e)
       }
  }

  companion object {
    private const val SCREEN_CAPTURE_REQUEST_CODE = 9999
  }

  /**
   * Captures the GL frame buffer using Android's PixelCopy API.
   */
  private fun captureWithPixelCopy(
    surfaceView: SurfaceView,
    width: Int,
    height: Int,
    promise: Promise
  ) {
    Log.d("AR_SHOT", "🎬 Initiating PixelCopy capture ($width x $height)...")

    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    val mainHandler = Handler(Looper.getMainLooper())

    mainHandler.post {
      try {
        PixelCopy.request(
          surfaceView,
          bitmap,
          { resultCode ->
            handlePixelCopyResult(
              resultCode,
              bitmap,
              promise,
              width,
              height
            )
          },
          mainHandler
        )
      } catch (e: Exception) {
        Log.e("AR_SHOT", "❌ PixelCopy exception: ${e.message}", e)
        promise.reject(
          "ERR_PIXELCOPY",
          "PixelCopy failed: ${e.message}",
          e
        )
      }
    }
  }

  private fun handlePixelCopyResult(
    resultCode: Int,
    bitmap: Bitmap,
    promise: Promise,
    width: Int,
    height: Int
  ) {
    if (resultCode == PixelCopy.SUCCESS) {
        Log.d("AR_SHOT", "✅ PixelCopy SUCCESS - saving bitmap...")
        saveBitmap(bitmap, promise)
        return
    } 

    Log.e("AR_SHOT", "⚠️ PixelCopy failed with code $resultCode. Trying GLReadPixels fallback...")

    // If PixelCopy fails (Code 3/Protection), try Direct GL Read
    val activity = appContext.currentActivity
    if (activity != null) {
      val rootView = activity.window.decorView.rootView
      val arView = findARView(rootView)
      if (arView is GLSurfaceView) {
          captureWithGLReadPixels(arView, width, height, promise)
          return
      }
    }

    // If we can't find GL view or PixelCopy strictly failed
    promise.reject("ERR_PROTECTED", "Hardware protection blocking capture (PixelCopy Code: $resultCode)", null)
  }

  private fun captureWithGLReadPixels(
    glSurfaceView: GLSurfaceView,
    width: Int,
    height: Int,
    promise: Promise
  ) {
      Log.d("AR_SHOT", "🎨 Initiating GLReadPixels capture ($width x $height)...")
      
      glSurfaceView.queueEvent {
          try {
              // Get GPU's preferred format
              val params = IntArray(2)
              GLES20.glGetIntegerv(GLES20.GL_IMPLEMENTATION_COLOR_READ_FORMAT, params, 0)
              val readFormat = params[0]
              GLES20.glGetIntegerv(GLES20.GL_IMPLEMENTATION_COLOR_READ_TYPE, params, 1)
              val readType = params[1]
              
              Log.d("AR_SHOT", "Using GPU preferred -> Format: $readFormat, Type: $readType")
              
              GLES20.glPixelStorei(GLES20.GL_PACK_ALIGNMENT, 1)
              
              // Allocate buffer based on type
              val bytesPerPixel = when(readType) {
                  0x8033, 0x140B -> 4 // GL_UNSIGNED_INT_2_10_10_10_REV or GL_UNSIGNED_INT_8_8_8_8_REV
                  0x1401 -> 4 // GL_UNSIGNED_BYTE (RGBA)
                  else -> 4
              }
              
              val buffer = ByteBuffer.allocateDirect(width * height * bytesPerPixel)
              buffer.order(ByteOrder.nativeOrder())
              
              // Use GPU's preferred format/type
              GLES20.glReadPixels(0, 0, width, height, readFormat, readType, buffer)
              
              val gle = GLES20.glGetError()
              if (gle != GLES20.GL_NO_ERROR) {
                   Log.e("AR_SHOT", "❌ GLReadPixels still failed with error: $gle")
                   throw Exception("GL Error: $gle")
              }
              
              buffer.rewind()
              
              // Convert to bitmap (handle 10-bit format if needed)
              val bitmap = convertBufferToBitmap(buffer, width, height, readFormat, readType)
              
              // Flip vertically
              val matrix = Matrix()
              matrix.preScale(1.0f, -1.0f)
              val flippedBitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, false)
              bitmap.recycle()
              
              Handler(Looper.getMainLooper()).post {
                  Log.d("AR_SHOT", "✅ GLReadPixels SUCCESS")
                  saveBitmap(flippedBitmap, promise)
              }
              
          } catch(e: Exception) {
              Log.e("AR_SHOT", "❌ GLReadPixels failed: ${e.message}")
              Handler(Looper.getMainLooper()).post {
                  promise.reject("ERR_GL_READ", "GL Read failed: ${e.message}", e)
              }
          }
      }
  }

private fun convertBufferToBitmap(buffer: ByteBuffer, width: Int, height: Int, format: Int, type: Int): Bitmap {
    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    
    if (type == 0x8033 || type == 0x140B) { // 10-bit format
        // Convert 10-bit to 8-bit
        val pixels = IntArray(width * height)
        val intBuffer = buffer.asIntBuffer()
        
        for (i in 0 until width * height) {
            val packed = intBuffer.get()
            // Extract 10-bit channels and convert to 8-bit
            val r = ((packed shr 0) and 0x3FF) shr 2
            val g = ((packed shr 10) and 0x3FF) shr 2
            val b = ((packed shr 20) and 0x3FF) shr 2
            val a = 255
            pixels[i] = (a shl 24) or (r shl 16) or (g shl 8) or b
        }
        bitmap.setPixels(pixels, 0, width, 0, 0, width, height)
    } else {
        // Standard 8-bit RGBA
        bitmap.copyPixelsFromBuffer(buffer)
    }
    
    return bitmap
}

  private fun saveBitmap(bitmap: Bitmap, promise: Promise) {
    try {
      val filename = "ar-shot-${UUID.randomUUID()}.png"
      val file = File(context.cacheDir, filename)

      FileOutputStream(file).use { output ->
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
      }

      Log.d("AR_SHOT", "💾 Saved to: ${file.absolutePath}")
      promise.resolve(file.absolutePath)
    } catch (e: Exception) {
      Log.e("AR_SHOT", "Failed to save: ${e.message}", e)
      promise.reject("ERR_SAVE", "Failed to save: ${e.message}", e)
    } finally {
      bitmap.recycle()
    }
  }

  /**
   * Recursively searches view hierarchy for GLSurfaceView OR TextureView.
   */
  private fun findARView(view: View): View? {
    val className = view.javaClass.simpleName.lowercase()
    val fullName = view.javaClass.name.lowercase()

    // Check specific types
    val isGL = view is GLSurfaceView || className.contains("glsurfaceview")
    val isTexture = view is TextureView || className.contains("textureview") || fullName.contains("textureview")

    if ((isGL || isTexture) && view.visibility == View.VISIBLE && view.width > 100) {
        val type = if (isTexture) "TextureView" else "GLSurfaceView"
        Log.d("AR_SHOT", "🎯 Found potential AR Surface: $type (${view.javaClass.simpleName})")
        return view
    }

    if (view is ViewGroup) {
      for (i in 0 until view.childCount) {
        val result = findARView(view.getChildAt(i))
        if (result != null) return result
      }
    }
    return null
  }

  private fun findARSession(view: View): Session? {
      // 1. Check if the view itself has a Session field
      try {
          val fields = view.javaClass.declaredFields
          for (field in fields) {
              if (Session::class.java.isAssignableFrom(field.type)) {
                  field.isAccessible = true
                  val session = field.get(view) as? Session
                  if (session != null) {
                      Log.d("AR_SHOT", "🔍 Found ARSession in view: ${view.javaClass.simpleName}")
                      return session
                  }
              }
          }
      } catch (e: Exception) {
          Log.w("AR_SHOT", "Reflection warn: ${e.message}")
      }

      // 2. Recurse
      if (view is ViewGroup) {
          for (i in 0 until view.childCount) {
              val session = findARSession(view.getChildAt(i))
              if (session != null) return session
          }
      }
      return null
  }

  private fun captureFromSession(session: Session, promise: Promise) {
      try {
          // Warning: calling update() might affect the rendering loop
          val frame = session.update()
          
          try {
              val image = frame.acquireCameraImage()
              // Ensure we close the image
              try {
                  val bitmap = imageToBitmap(image)
                  if (bitmap != null) {
                      saveBitmap(bitmap, promise)
                  } else {
                      promise.reject("ERR_BITMAP", "Failed to convert AR frame", null)
                  }
              } finally {
                  image.close()
              }
          } catch (e: NotYetAvailableException) {
              promise.reject("ERR_NOT_READY", "AR Frame not ready", e)
          }
      } catch (e: Exception) {
           Log.e("AR_SHOT", "AR Core Capture failed: ${e.message}", e)
           promise.reject("ERR_AR_CORE", "Failed to capture from ARSession", e)
      }
  }

  private fun imageToBitmap(image: Image): Bitmap? {
        try {
            val yBuffer = image.planes[0].buffer
            val uBuffer = image.planes[1].buffer
            val vBuffer = image.planes[2].buffer

            val ySize = yBuffer.remaining()
            val uSize = uBuffer.remaining()
            val vSize = vBuffer.remaining()

            val nv21 = ByteArray(ySize + uSize + vSize)

            // Copy Y
            yBuffer.get(nv21, 0, ySize)
            
            // For NV21, we need V then U interleaved. 
            // This simple copy assumes formatted buffers; real HW might vary pixel strides.
            // A robust implementation requires pixelStride handling.
            // But for standard ARCore on Samsung, this often works or needs minimal tweak.
            
            // Fast approximation for standard 420_888 to NV21 (assuming tight packing or specific stride)
            // If pixelStride is 2, they are interleaved.
            if (vBuffer.remaining() > 0) {
                 vBuffer.get(nv21, ySize, vSize)
                 uBuffer.get(nv21, ySize + vSize, uSize)
            }

            val yuvImage = YuvImage(nv21, ImageFormat.NV21, image.width, image.height, null)
            val out = ByteArrayOutputStream()
            yuvImage.compressToJpeg(Rect(0, 0, image.width, image.height), 90, out)
            val imageBytes = out.toByteArray()
            
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            
            // Rotate 90 degrees for portrait
            val matrix = Matrix()
            matrix.postRotate(90f)
            return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        } catch (e: Exception) {
            Log.e("AR_SHOT", "YUV conversion failed", e)
            return null
        }
  }
}