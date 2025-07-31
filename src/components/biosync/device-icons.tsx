"use client";

import { Watch, Activity, Smartphone, Droplets, Scale, BedDouble, LucideIcon, HelpCircle } from "lucide-react";

export const deviceIcons: { [key: string]: LucideIcon } = {
  Watch,
  Activity,
  Smartphone,
  Droplets,
  Scale,
  BedDouble,
  Default: HelpCircle,
};

export const getDeviceIcon = (type: string): LucideIcon => {
  return deviceIcons[type] || deviceIcons.Default;
};