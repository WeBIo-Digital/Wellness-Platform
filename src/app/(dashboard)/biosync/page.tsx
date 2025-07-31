"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Activity, Apple, Heart, Loader2, Watch } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useData, Device } from "@/context/data-context";
import { DeviceCard } from "./device-card";
import { SupportedDeviceCard } from "./supported-device-card";
import { ConnectionWizard } from "./connection-wizard";

export default function BioSyncPage() {
  const { devices, isLoading, deleteDevice } = useData();
  const [isDeleting, startTransition] = useTransition();
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [deviceToConnect, setDeviceToConnect] = useState<string | null>(null);

  const supportedDevices = [
    { name: "Apple Health", icon: <Apple className="h-8 w-8" /> },
    { name: "Garmin Connect", icon: <Activity className="h-8 w-8" /> },
    { name: "Oura Ring", icon: <Heart className="h-8 w-8" /> },
    { name: "Whoop", icon: <Watch className="h-8 w-8" /> },
  ];

  const handleConnect = (deviceName: string) => {
    setDeviceToConnect(deviceName);
  };

  const onConnectSuccess = (deviceName: string) => {
    // In a real app, you would get the device details from the API response
    const newDevice = { 
      id: Math.random(),
      user_id: '', // This would be set by the backend
      name: deviceName, 
      type: deviceName.toLowerCase().replace(' ', ''), // simple type generation
      status: 'connected' as 'connected',
      details: 'Newly connected device.',
      live_data_type: null,
      battery_level: Math.floor(Math.random() * 101)
    };
    // This is a temporary solution to update the UI.
    // Ideally, the useData context would have an `addDevice` function.
    // @ts-ignore
    devices.push(newDevice);
  };

  const handleDelete = () => {
    if (!deviceToDelete) return;
    startTransition(async () => {
      const result = await deleteDevice(deviceToDelete.id);
      if (result.ok) {
        toast.success(`'${deviceToDelete.name}' deleted successfully.`);
      } else {
        toast.error(result.message || "Failed to delete device.");
      }
      setDeviceToDelete(null);
    });
  };

  return (
    <>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time BioSync</CardTitle>
            <CardDescription>
              Connect, disconnect, and manage your existing wearable devices and health apps.
            </CardDescription>
          </CardHeader>
        </Card>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onDelete={() => setDeviceToDelete(device)}
              />
            ))}
          </div>
        )}

        {/* Supported Devices Section */}
        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Connect New Device</CardTitle>
              <CardDescription>
                Select a device or app to connect to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {supportedDevices
                  .filter((supportedDevice) => !devices.some((connectedDevice) => connectedDevice.name === supportedDevice.name))
                  .map((device) => (
                    <SupportedDeviceCard
                      key={device.name}
                      device={device}
                      onConnect={() => handleConnect(device.name)}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connection Wizard */}
      <ConnectionWizard 
        deviceName={deviceToConnect}
        onClose={() => setDeviceToConnect(null)}
        onConnect={onConnectSuccess}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deviceToDelete} onOpenChange={(open) => !open && setDeviceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the '{deviceToDelete?.name}' device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              <span className="flex items-center justify-center">
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}