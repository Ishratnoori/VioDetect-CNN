import { useState } from "react";
import {
  Activity,
  BrainCircuit,
  Camera,
  Gauge,
  Loader2,
  MonitorPlay,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LiveDetection from "@/components/dashboard/LiveDetection";
import { AppBackground } from "@/components/layout/AppBackground";
import { TopNav } from "@/components/layout/TopNav";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    "Primary Prediction": string,
    "Detected Category": string,
    "Confidence Score": number
  } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [liveResult, setLiveResult] = useState<{
    "Primary Prediction": string,
    "Detected Category": string,
    "Confidence Score": number
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous result
    setResult(null);
    setFileName(file.name);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);

      toast({
        title: "Analysis Complete",
        description: `Detection: ${data['Primary Prediction']} - ${data['Detected Category']} (${Math.round(data['Confidence Score'] * 100)}%)`,
        variant: data['Primary Prediction'] === "Violent" ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error analyzing video:", error);
      toast({
        title: "Error",
        description: "Failed to analyze video. Please make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (file: File) => {
    setResult(null);
    setFileName(file.name);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);

      toast({
        title: "Analysis Complete",
        description: `Detection: ${data["Primary Prediction"]} - ${data["Detected Category"]} (${Math.round(
          data["Confidence Score"] * 100
        )}%)`,
        variant: data["Primary Prediction"] === "Violent" ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error analyzing video:", error);
      toast({
        title: "Error",
        description: "Failed to analyze video. Please make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const threat = (result ?? liveResult)?.["Primary Prediction"] === "Violent";
  const confidence = (result ?? liveResult)?.["Confidence Score"];
  const category = (result ?? liveResult)?.["Detected Category"];

  return (
    <AppBackground>
      <TopNav variant="dashboard" />

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1
                className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AI Monitoring Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                Upload recorded footage for analysis or activate live webcam monitoring. Status,
                metrics, and incident categories update in real time.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
                Backend Ready
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
                <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                Model Loaded
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <GlassCard glow className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Latency</div>
              <div className="text-sm font-bold text-foreground">~1.0s/frame</div>
            </div>
          </GlassCard>
          <GlassCard glow className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Model</div>
              <div className="text-sm font-bold text-foreground">ResNet50 (CNN)</div>
            </div>
          </GlassCard>
          <GlassCard glow className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
              <MonitorPlay className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolution</div>
              <div className="text-sm font-bold text-foreground">640×480</div>
            </div>
          </GlassCard>
          <GlassCard
            glow
            className={cn(
              "flex items-center gap-4 p-5",
              threat ? "ring-1 ring-red-500/30" : "ring-1 ring-emerald-500/30"
            )}
          >
            <div
              className={cn(
                "rounded-xl p-3",
                threat ? "bg-red-500/10 text-red-200" : "bg-emerald-500/10 text-emerald-200"
              )}
            >
              <Activity className={cn("h-5 w-5", threat && "animate-pulse-soft")} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Threat Level</div>
              <div className={cn("text-sm font-bold", threat ? "text-red-200" : "text-emerald-200")}>
                {threat ? "THREAT" : "SAFE"}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Big detection status */}
        <GlassCard
          glow
          className={cn(
            "mb-8 overflow-hidden border-white/10 p-0",
            threat ? "ring-1 ring-red-500/30" : "ring-1 ring-emerald-500/30"
          )}
        >
          <div
            className={cn(
              "px-6 py-5",
              threat
                ? "bg-gradient-to-r from-red-500/15 via-red-500/5 to-transparent"
                : "bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent"
            )}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "rounded-2xl p-3",
                    threat ? "bg-red-500/15 text-red-200" : "bg-emerald-500/15 text-emerald-200"
                  )}
                >
                  {threat ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Detection Status
                  </div>
                  <div className={cn("text-xl font-black tracking-tight", threat ? "text-red-200" : "text-emerald-200")}>
                    {result || liveResult
                      ? threat
                        ? `THREAT DETECTED — ${String(category ?? "").toUpperCase()}`
                        : "NO THREAT DETECTED"
                      : "AWAITING INPUT"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:justify-end">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Confidence</div>
                  <div className="text-2xl font-black text-primary">
                    {confidence != null ? `${Math.round(confidence * 100)}%` : "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Source</div>
                  <div className="text-sm font-bold text-slate-200">{result ? "Upload" : liveResult ? "Live" : "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Split layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Upload */}
          <GlassCard glow className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Video Upload</div>
                <div className="text-lg font-bold text-foreground">Analyze recorded footage</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
                <Upload className="h-5 w-5" />
              </div>
            </div>

            <div
              className={cn(
                "relative rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center transition-all",
                isDragOver && "border-primary/50 bg-primary/10",
                isAnalyzing && "opacity-80"
              )}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void handleDrop(file);
              }}
            >
              <input
                type="file"
                accept="video/*"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />

              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary neon-ring">
                <Upload className="h-7 w-7" />
              </div>

              <div className="text-base font-semibold text-foreground">Drag & Drop a video</div>
              <div className="mt-1 text-sm text-slate-300">or click to browse (MP4, MOV, WebM)</div>

              <div className="mt-5">
                <Button
                  className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Select Video"
                  )}
                </Button>
              </div>

              {fileName && (
                <div className="mt-4 text-xs text-slate-400">
                  Selected: <span className="text-slate-200">{fileName}</span>
                </div>
              )}
            </div>

            {result && !isAnalyzing && (
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Detected Category
                  </div>
                  <div className="mt-1 text-base font-bold text-foreground">{result["Detected Category"]}</div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setResult(null);
                    setFileName(null);
                  }}
                >
                  Analyze Another Video
                </Button>
              </div>
            )}
          </GlassCard>

          {/* Right: Live */}
          <GlassCard glow className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Detection</div>
                <div className="text-lg font-bold text-foreground">Webcam monitoring</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
                <Camera className="h-5 w-5 animate-pulse-soft" />
              </div>
            </div>

            <LiveDetection onPredictionChange={setLiveResult} />
          </GlassCard>
        </div>

        {/* Crime categories */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Crime Categories</div>
              <div className="text-lg font-bold text-foreground">Detected crime types (dataset classes)</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Abuse",
              "Assault",
              "Fighting",
              "Robbery",
              "Explosion",
              "Arson",
              "Burglary",
              "RoadAccidents",
              "Shooting",
              "Shoplifting",
              "Stealing",
              "Vandalism",
              "Arrest",
              "NormalVideos",
            ].map((c) => (
              <GlassCard
                key={c}
                glow
                className={cn(
                  "flex items-center justify-between gap-4 p-4 transition-transform duration-200 hover:-translate-y-0.5",
                  c === category && (threat ? "ring-1 ring-red-500/35" : "ring-1 ring-primary/35")
                )}
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</div>
                  <div className="mt-0.5 text-sm font-bold text-foreground">{c}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
                  <Activity className="h-4 w-4" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </AppBackground>
  );
};

export default Dashboard;

