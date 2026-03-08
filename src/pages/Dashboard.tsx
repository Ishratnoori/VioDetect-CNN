import { Link } from "react-router-dom";
import { useState } from "react";
import { Shield, ArrowLeft, Video, AlertTriangle, Activity, Target, Upload, Loader2, ShieldAlert, ShieldCheck, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";
import { useToast } from "@/hooks/use-toast";
import LiveDetection from "@/components/dashboard/LiveDetection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    "Primary Prediction": string,
    "Detected Category": string,
    "Confidence Score": number
  } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous result
    setResult(null);
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

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VioDetect</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-4 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Backend Active</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>Model Loaded</span>
              </div>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto flex-1 px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">

        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Surveillance AI Dashboard
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Choose your detection method: upload existing footage for deep analysis or
            activate live webcam monitoring for real-time security.
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full max-w-4xl mx-auto mb-12">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto">
              <TabsTrigger
                value="upload"
                className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 text-slate-500 font-semibold transition-all"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 text-slate-500 font-semibold transition-all"
              >
                <Camera className="h-4 w-4 mr-2" />
                Live Detection
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upload" className="w-full">
            <div className="max-w-xl mx-auto">
              {!result && !isAnalyzing ? (
                <div className="group relative">
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    disabled={isAnalyzing}
                  />
                  <div className="border-3 border-dashed border-slate-300 rounded-3xl p-12 bg-white transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-50/50 group-hover:shadow-xl text-center">
                    <div className="mb-6 inline-flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Video File</h3>
                    <p className="text-slate-500">Drag and drop or click to browse</p>
                    <div className="mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-full px-8">
                        Select File
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
                  {isAnalyzing ? (
                    <div className="p-12 text-center">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Footage...</h3>
                      <p className="text-slate-500">Processing video frames and running AI inference</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className={`p-8 text-center ${result?.["Primary Prediction"] === "Violent" ? "bg-red-50" : "bg-emerald-50"}`}>
                        {result?.["Primary Prediction"] === "Violent" ? (
                          <div className="inline-flex p-4 rounded-full bg-red-100 text-red-600 mb-4 animate-bounce">
                            <ShieldAlert className="h-12 w-12" />
                          </div>
                        ) : (
                          <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                            <ShieldCheck className="h-12 w-12" />
                          </div>
                        )}
                        <h2 className={`text-3xl font-bold mb-2 ${result?.["Primary Prediction"] === "Violent" ? "text-red-700" : "text-emerald-700"}`}>
                          {result?.["Primary Prediction"] === "Violent" ? "Violence Detected" : "No Violence Detected"}
                        </h2>
                        <p className={`font-medium ${result?.["Primary Prediction"] === "Violent" ? "text-red-600" : "text-emerald-600"}`}>
                          Confidence Score: {Math.round(result!["Confidence Score"] * 100)}%
                        </p>
                      </div>

                      {result?.["Primary Prediction"] === "Violent" && (
                        <div className="p-6 bg-white border-t border-slate-100">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-500 font-medium">Detected Category</span>
                            <span className="text-lg font-bold text-slate-900 capitalize">{result["Detected Category"]}</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                        <Button
                          onClick={() => setResult(null)}
                          variant="outline"
                          className="w-full py-6 text-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600"
                        >
                          Analyze Another Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="live" className="w-full">
            <LiveDetection />
          </TabsContent>
        </Tabs>

      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

