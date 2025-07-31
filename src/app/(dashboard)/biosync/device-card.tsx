"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, PlusCircle, XCircle, Heart, Thermometer, Footprints, MoreVertical, Trash2, Battery } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useData, Device } from "@/context/data-context";
import { getDeviceIcon } from "@/components/biosync/device-icons";

interface DeviceCardProps {
  device: Device;
  onDelete: () => void;
}

const getSimulatedData = (type: string | null) => {
  switch (type) {
    case 'heartRate': return `${Math.floor(Math.random() * 15 + 60)} BPM`;
    case 'temperature': return `${(Math.random() * 1.5 + 97.5).toFixed(1)} °F`;
    case 'glucose': return `${Math.floor(Math.random() * 20 + 90)} mg/dL`;
    default: return null;
  }
};

const getLiveIcon = (type: string | null) => {
    switch (type) {
        case 'heartRate': return Heart;
        case 'temperature': return Thermometer;
        case 'glucose': return Footprints;
        default: return null;
    }
}

export function DeviceCard({ device, onDelete }: DeviceCardProps) {
  const { updateDevice } = useData();
  const [isConnecting, startTransition] = useTransition();
  const [liveData, setLiveData] = useState<string | null>(null);

  const isConnected = device.status === 'connected';
  const Icon = getDeviceIcon(device.type);
  const LiveDataIcon = getLiveIcon(device.live_data_type);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isConnected && device.live_data_type) {
      setLiveData(getSimulatedData(device.live_data_type));
      intervalId = setInterval(() => {
        setLiveData(getSimulatedData(device.live_data_type));
      }, 3000);
    } else {
      setLiveData(null);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isConnected, device.live_data_type]);

  const handleToggleConnection = () => {
    startTransition(async () => {
      const newStatus = isConnected ? 'disconnected' : 'connected';
      const result = await updateDevice({ ...device, status: newStatus });
      if (result.ok) {
        toast.success(`'${device.name}' status updated to ${newStatus}.`);
      } else {
        toast.error(result.message || "Failed to update status.");
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={onDelete} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between">
          <Badge variant={isConnected ? "default" : "outline"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
          {isConnected && typeof device.battery_level === 'number' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Battery className="h-4 w-4" />
              <span>{device.battery_level}%</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{device.details}</p>
        {isConnected && liveData && LiveDataIcon && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2"><LiveDataIcon className="h-4 w-4 text-primary" /><p className="text-xs font-semibold text-muted-foreground">LIVE</p></div>
            <p className="text-2xl font-bold text-primary">{liveData}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant={isConnected ? "outline" : "default"} size="sm" className="w-full" onClick={handleToggleConnection} disabled={isConnecting}>
          {isConnecting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : isConnected ? (
            <span className="flex items-center justify-center">
              <XCircle className="mr-2 h-4 w-4" />
              Disconnect
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}