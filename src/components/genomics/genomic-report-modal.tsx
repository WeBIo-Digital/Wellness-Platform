"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Coffee, Moon, Zap, Bone } from "lucide-react";
import { TraitCard } from "./trait-card";

interface GenomicReportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
}

const reportData = {
  carrierStatus: [
    { name: "Cystic Fibrosis", result: "Not a carrier", description: "You do not have the most common genetic variants associated with Cystic Fibrosis.", icon: CheckCircle, color: "text-primary" },
    { name: "Sickle Cell Anemia", result: "Not a carrier", description: "You were not found to have the genetic variants for Sickle Cell Anemia.", icon: CheckCircle, color: "text-primary" },
  ],
  wellnessTraits: [
    { name: "Caffeine Metabolism", result: "Likely faster", description: "Your genetics suggest you metabolize caffeine quickly. You may feel the effects for a shorter duration.", icon: Coffee, color: "text-amber-800" },
    { name: "Sleep Type", result: "Likely a deep sleeper", description: "You have genetic markers commonly found in individuals who report being deep sleepers.", icon: Moon, color: "text-blue-600" },
    { name: "Muscle Type", result: "Likely power athlete", description: "Your ACTN3 gene suggests a predisposition for power and sprint activities over endurance.", icon: Zap, color: "text-yellow-500" },
    { name: "Bone Density", result: "Average", description: "Your genetic markers for bone mineral density are within the average range.", icon: Bone, color: "text-gray-500" },
  ],
};

export function GenomicReportModal({ isOpen, onOpenChange, fileName }: GenomicReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Genomic Report</DialogTitle>
          <DialogDescription>
            Analysis based on data from: <span className="font-semibold">{fileName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Carrier Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reportData.carrierStatus.map((trait) => (
                <TraitCard key={trait.name} trait={trait} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wellness Traits</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reportData.wellnessTraits.map((trait) => (
                <TraitCard key={trait.name} trait={trait} />
              ))}
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="flex-col items-start gap-2 border-t pt-4 sm:flex-col sm:items-start sm:gap-2">
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                    This is a simulated report for demonstration purposes only. It is not medical advice.
                </p>
            </div>
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Close Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}