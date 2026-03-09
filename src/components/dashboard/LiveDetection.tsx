import { useRef, useEffect, useState, useCallback } from "react";
import { Camera, CameraOff, Loader2, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface PredictionResult {
  "Primary Prediction": string;
  "Detected Category": string;
  "Confidence Score": number;
}

type LiveDetectionProps = {
  onPredictionChange?: (result: PredictionResult | null) => void;
};

const LiveDetection = ({ onPredictionChange }: LiveDetectionProps) => {
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
    onPredictionChange?.(null);
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
          onPredictionChange?.(data);
        }
      } catch (error) {
        console.error("Frame processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [isActive, isProcessing, onPredictionChange]);

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

  useEffect(() => {
    onPredictionChange?.(result);
  }, [result, onPredictionChange]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black/30 card-shadow">
        {!isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="mb-6 rounded-full bg-white/5 p-6 neon-ring">
              <CameraOff className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Camera is Off</h3>
            <p className="mb-8 max-w-md text-slate-300">
              Enable your camera to start real-time violence detection monitoring.
            </p>
            <Button
              onClick={startCamera}
              disabled={isInitializing}
              className="rounded-xl bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
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
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md",
                    result?.["Primary Prediction"] === "Violent"
                      ? "border-red-500/50 bg-red-500/20 text-red-100"
                      : "border-emerald-500/50 bg-emerald-500/20 text-emerald-100"
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      result?.["Primary Prediction"] === "Violent" ? "bg-red-500 animate-pulse-soft" : "bg-emerald-500 animate-pulse-soft"
                    )}
                  />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Live Feed: {result ? (result["Primary Prediction"] === "Violent" ? "Threat Detected" : "Secure") : "Analyzing..."}
                  </span>
                </div>
              </div>

              <Button
                onClick={stopCamera}
                variant="destructive"
                size="sm"
                className="pointer-events-auto rounded-xl bg-red-600/75 backdrop-blur-sm hover:bg-red-600"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Feed
              </Button>
            </div>

            {/* Prediction Indicator */}
            {result && (
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <div
                  className={cn(
                    "rounded-2xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500",
                    result["Primary Prediction"] === "Violent" ? "ring-1 ring-red-500/30" : "ring-1 ring-emerald-500/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "rounded-2xl p-3",
                          result["Primary Prediction"] === "Violent"
                            ? "bg-red-500/15 text-red-200"
                            : "bg-emerald-500/15 text-emerald-200"
                        )}
                      >
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
                      <div className="text-2xl font-black text-primary">
                        {Math.round(result["Confidence Score"] * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && !result && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard glow className="flex items-center gap-4 p-4">
          <div className="rounded-lg bg-white/5 p-2 text-primary neon-ring">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Latency</div>
            <div className="font-bold text-foreground">~1.0s Analysis</div>
          </div>
        </GlassCard>
        <GlassCard glow className="flex items-center gap-4 p-4">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Model</div>
            <div className="font-bold text-foreground">ResNet50(CNN)</div>
          </div>
        </GlassCard>
        <GlassCard glow className="flex items-center gap-4 p-4">
          <div className="rounded-lg bg-white/5 p-2 text-primary neon-ring">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Resolution</div>
            <div className="font-bold text-foreground">640x480 (Optimized)</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LiveDetection;
