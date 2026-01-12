package expo.modules.myarscreenshot

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.PixelFormat
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.DisplayMetrics
import android.util.Log
import android.view.WindowManager
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.util.UUID

class MediaProjectionService : Service() {

    private var mediaProjection: MediaProjection? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var imageReader: ImageReader? = null
    private var windowManager: WindowManager? = null
    private var mediaProjectionManager: MediaProjectionManager? = null

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        mediaProjectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("MediaProjection", "🏁 Service onStartCommand fired. Id: $startId")
        // Start Foreground immediately (Required for Android 10+ / Android 15 strict mode)
        try {
            val notification = createNotification()
            if (Build.VERSION.SDK_INT >= 34) {
                 startForeground(1, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION)
            } else {
                 startForeground(1, notification)
            }
            Log.d("MediaProjection", "✅ Foreground started successfully")
        } catch (e: Exception) {
            Log.e("MediaProjection", "❌ Foreground start failed", e)
            stopSelf()
            return START_NOT_STICKY
        }

        val resultCode = intent?.getIntExtra("RESULT_CODE", 0) ?: 0
        val resultData = if (Build.VERSION.SDK_INT >= 33) {
            intent?.getParcelableExtra("RESULT_DATA", Intent::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent?.getParcelableExtra("RESULT_DATA")
        }

        Log.d("MediaProjection", "📦 Intent Extras - ResultCode: $resultCode (OK=${android.app.Activity.RESULT_OK}), DataNull: ${resultData == null}")

        if (resultCode != android.app.Activity.RESULT_OK || resultData == null) {
            Log.e("MediaProjection", "❌ Invalid result code or data. Stopping.")
            stopSelf()
            return START_NOT_STICKY
        }

        // Get MediaProjection
        try {
            mediaProjection = mediaProjectionManager?.getMediaProjection(resultCode, resultData)
        } catch (e: Exception) {
            Log.e("MediaProjection", "❌ getMediaProjection failed", e)
        }

        if (mediaProjection != null) {
            Log.d("MediaProjection", "📽️ MediaProjection obtained. Scheduling capture...")

            // Android 14+ Requirement: Register a callback before capture starts
            mediaProjection?.registerCallback(object : MediaProjection.Callback() {
                override fun onStop() {
                    Log.d("MediaProjection", "🛑 MediaProjection Process Stopped by System")
                    stopCapture()
                }
            }, Handler(Looper.getMainLooper()))

            // Handler to ensure Service is fully up before capturing
            Handler(Looper.getMainLooper()).postDelayed({
                startCapture()
            }, 500)
        } else {
            Log.e("MediaProjection", "❌ MediaProjection is null")
            stopSelf()
        }

        return START_NOT_STICKY
    }

    private fun startCapture() {
        Log.d("MediaProjection", "Starting capture process...")
        val metrics = DisplayMetrics()
        windowManager?.defaultDisplay?.getRealMetrics(metrics)
        val density = metrics.densityDpi
        val width = metrics.widthPixels
        val height = metrics.heightPixels

        Log.d("MediaProjection", "Screen size: ${width}x${height} density: $density")

        // Setup ImageReader
        // 0x1 is VIRTUAL_DISPLAY_FLAG_PUBLIC
        // 0x10 is VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR
        imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2)
        
        val flags = DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR
        
        // Create a background handler for image processing to avoid Main Thread stalls
        val handlerThread = android.os.HandlerThread("ImageReaderThread")
        handlerThread.start()
        val handler = Handler(handlerThread.looper)

        imageReader?.setOnImageAvailableListener({ reader ->
            Log.d("MediaProjection", "📸 Image Available!")
            var image: android.media.Image? = null
            var bitmap: Bitmap? = null
            try {
                image = reader.acquireLatestImage()
                if (image != null) {
                    Log.d("MediaProjection", "Image acquired: ${image.width}x${image.height}")
                    val planes = image.planes
                    if (planes.isNotEmpty()) {
                        val buffer: ByteBuffer = planes[0].buffer
                        val pixelStride = planes[0].pixelStride
                        val rowStride = planes[0].rowStride
                        val rowPadding = rowStride - pixelStride * width

                        Log.d("MediaProjection", "Processing: stride=$pixelStride rowStride=$rowStride padding=$rowPadding")

                        bitmap = Bitmap.createBitmap(
                            width + rowPadding / pixelStride,
                            height,
                            Bitmap.Config.ARGB_8888
                        )
                        bitmap.copyPixelsFromBuffer(buffer)
                        
                        val finalBitmap = if (rowPadding == 0) {
                            bitmap
                        } else {
                            Bitmap.createBitmap(bitmap, 0, 0, width, height) // Crop
                        }

                        saveBitmap(finalBitmap)
                    }
                } else {
                    Log.w("MediaProjection", "Image was null")
                }
            } catch (e: Exception) {
                Log.e("MediaProjection", "Error capturing: ${e.message}")
                e.printStackTrace()
            } finally {
                image?.close()
                stopCapture()
                handlerThread.quitSafely()
            }
        }, handler)
        
        Log.d("MediaProjection", "Creating VirtualDisplay...")
        virtualDisplay = mediaProjection?.createVirtualDisplay(
            "ScreenCapture",
            width,
            height,
            density,
            flags,
            imageReader?.surface,
            null,
            null
        )
        Log.d("MediaProjection", "VirtualDisplay created: $virtualDisplay")
    }

    private fun saveBitmap(bitmap: Bitmap) {
        try {
            val cacheDir = applicationContext.cacheDir
            val fileName = "capture_${UUID.randomUUID()}.png"
            val file = File(cacheDir, fileName)
            val outputStream = FileOutputStream(file)
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
            outputStream.flush()
            outputStream.close()
            
            Log.d("MediaProjection", "Saved to ${file.absolutePath}")
            
            // Broadcast the result back to the Module
            val intent = Intent("expo.modules.myarscreenshot.CAPTURE_COMPLETE").apply {
                putExtra("URI", file.absolutePath)
                setPackage(applicationContext.packageName) // Android 14+ requirement for RECEIVER_NOT_EXPORTED
            }
            sendBroadcast(intent)
            Log.d("MediaProjection", "Broacast sent to ${applicationContext.packageName}")
            
        } catch (e: Exception) {
            Log.e("MediaProjection", "Failed to save: ${e.message}")
        }
    }

    private fun stopCapture() {
        virtualDisplay?.release()
        imageReader?.close()
        mediaProjection?.stop()
        stopForeground(true)
        stopSelf()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                "MediaProjectionChannel",
                "Screen Capture Service",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    private fun createNotification(): Notification {
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, "MediaProjectionChannel")
        } else {
            Notification.Builder(this)
        }

        return builder
            .setContentTitle("Accessing Screen")
            .setContentText("Capturing AR Scene...")
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .build()
    }
}
