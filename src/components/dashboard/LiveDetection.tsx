import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, CameraOff, Loader2, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PredictionResult {
  "Primary Prediction": string;
  "Detected Category": string;
  "Confidence Score": number;
}

const LiveDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const processingInterval = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    setIsInitializing(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsActive(true);
      toast({
        title: "Camera Started",
        description: "Live monitoring is now active.",
      });
    } catch (err) {
      console.error("Error accessing webcam:", err);
      toast({
        title: "Camera Error",
        description: "Could not access webcam. Please check permissions.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setResult(null);
    if (processingInterval.current) {
      clearInterval(processingInterval.current);
      processingInterval.current = null;
    }
  };

  useEffect(() => {
    if (isActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isActive, stream]);

  const captureFrame = useCallback(async () => {
    if (!isActive || isProcessing || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg", 0.7);

      setIsProcessing(true);
      try {
        const response = await fetch("http://localhost:5000/predict-frame", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data);
        }
      } catch (error) {
        console.error("Frame processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [isActive, isProcessing]);

  useEffect(() => {
    if (isActive) {
      processingInterval.current = setInterval(captureFrame, 1000); // Process every 1 second
    } else {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    }
    return () => {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, [isActive, captureFrame]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
        {!isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="p-6 bg-slate-800 rounded-full mb-6">
              <CameraOff className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Camera is Off</h3>
            <p className="text-slate-400 max-w-md mb-8">
              Enable your camera to start real-time violence detection monitoring.
            </p>
            <Button
              onClick={startCamera}
              disabled={isInitializing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg shadow-blue-600/20"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" />
                  Start Live Detection
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Overlay UI */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
              <div className="flex flex-col gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border ${result?.["Primary Prediction"] === "Violent"
                  ? "bg-red-500/20 border-red-500/50 text-red-100"
                  : "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
                  }`}>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${result?.["Primary Prediction"] === "Violent" ? "bg-red-500" : "bg-emerald-500"
                    }`} />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Live Feed: {result ? (result["Primary Prediction"] === "Violent" ? "Threat Detected" : "Secure") : "Analyzing..."}
                  </span>
                </div>
              </div>

              <Button
                onClick={stopCamera}
                variant="destructive"
                size="sm"
                className="pointer-events-auto rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-sm"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Feed
              </Button>
            </div>

            {/* Prediction Indicator */}
            {result && (
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <div className={`p-6 rounded-2xl backdrop-blur-xl border-t-4 shadow-2xl transition-all duration-500 ${result["Primary Prediction"] === "Violent"
                  ? "bg-red-950/80 border-red-600 text-white"
                  : "bg-slate-900/80 border-emerald-500 text-white"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${result["Primary Prediction"] === "Violent" ? "bg-red-600" : "bg-emerald-600"
                        }`}>
                        {result["Primary Prediction"] === "Violent" ? (
                          <ShieldAlert className="h-6 w-6" />
                        ) : (
                          <ShieldCheck className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase opacity-60 mb-0.5 tracking-widest">
                          Detection Status
                        </div>
                        <div className="text-xl font-black">
                          {result["Primary Prediction"] === "Violent"
                            ? `ALERT: ${result["Detected Category"].toUpperCase()}`
                            : "NO THREAT DETECTED"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold uppercase opacity-60 mb-0.5 tracking-widest">
                        Confidence
                      </div>
                      <div className="text-2xl font-black text-blue-400">
                        {Math.round(result["Confidence Score"] * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && !result && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Latency</div>
            <div className="font-bold text-slate-900">~1.0s Analysis</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Model</div>
            <div className="font-bold text-slate-900">ResNet50(CNN)</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Resolution</div>
            <div className="font-bold text-slate-900">640x480 (Optimized)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;
