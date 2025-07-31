"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectionWizardProps {
  deviceName: string | null;
  onClose: () => void;
  onConnect: (deviceName: string) => void;
}

export const ConnectionWizard: React.FC<ConnectionWizardProps> = ({ deviceName, onClose, onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    if (!deviceName) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Successfully connected to ${deviceName}!`);
      onConnect(deviceName);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={!!deviceName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to {deviceName}</DialogTitle>
          <DialogDescription>
            Please enter your credentials to connect your {deviceName} account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" placeholder="Enter your API key" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
