"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react";
import { GenomicReportModal } from "@/components/genomics/genomic-report-modal";
import { ChromosomeExplorer } from "@/components/genomics/chromosome-explorer";

export default function GenomicsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setReportReady(false);
      setIsProcessing(true);
      // Simulate a 3-second processing time for the AI analysis
      setTimeout(() => {
        setIsProcessing(false);
        setReportReady(true);
      }, 3000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadSample = () => {
    toast.info("Downloading sample genomic data file...");
    // In a real app, this would trigger a file download.
  };

  const handleClearFile = () => {
    setFile(null);
    setReportReady(false);
    setIsProcessing(false);
    setIsReportModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genomic Intelligence Layer</CardTitle>
            <CardDescription>
              Unlock insights from your DNA. Securely upload your genomic data file from services like 23andMe or AncestryDNA to generate an AI-powered health report.
            </CardDescription>
          </CardHeader>
        </Card>

        <ChromosomeExplorer />
        
        <Card>
          <CardHeader>
            <CardTitle>Upload & Process</CardTitle>
            <CardDescription>
              Your file is processed securely and is never stored on our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.csv,.zip"
            />
            
            {!file && (
              <>
                <div
                  onClick={handleUploadClick}
                  className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center transition-colors hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-semibold">Click to upload a file</p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: .txt, .csv, .zip
                  </p>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Don't have a file?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={handleDownloadSample}>
                    Download a sample report
                  </Button>
                </div>
              </>
            )}

            {file && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClearFile} disabled={isProcessing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isProcessing && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Processing...</AlertTitle>
                <AlertDescription>
                  Our AI is analyzing your genomic data. This may take a moment.
                </AlertDescription>
              </Alert>
            )}

            {reportReady && (
              <Alert className="border-primary/50 text-primary">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Report Ready!</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  Your personalized genomic report has been generated.
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setIsReportModalOpen(true)}
                  >
                    View Report
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      
      {file && (
        <GenomicReportModal 
          isOpen={isReportModalOpen}
          onOpenChange={setIsReportModalOpen}
          fileName={file.name}
        />
      )}
    </>
  );
}