"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useData } from "@/context/data-context";

export function SyncDataButton() {
  const [isPending, startTransition] = useTransition();
  const { syncData } = useData();

  const handleClick = () => {
    startTransition(async () => {
      const result = await syncData();
      if (result.message) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Failed to sync data.");
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Syncing..." : "Sync Sample Data"}
    </Button>
  );
}