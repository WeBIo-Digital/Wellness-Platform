import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface SupportedDeviceCardProps {
  device: {
    name: string;
    icon: React.ReactNode;
  };
  onConnect: () => void;
}

export const SupportedDeviceCard: React.FC<SupportedDeviceCardProps> = ({ device, onConnect }) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-row items-center gap-4">
        {device.icon}
        <CardTitle>{device.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Connect your {device.name} account to sync your health data automatically.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onConnect}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};
