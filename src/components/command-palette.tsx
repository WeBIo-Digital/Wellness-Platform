"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCommandPalette } from "@/context/command-palette-context";
import { BarChart, Settings, HeartPulse, Dna, Sparkles, Database, Sun, Moon, Laptop, TrendingUp } from "lucide-react";

const navItems = [
  { href: "/", icon: BarChart, label: "Dashboard" },
  { href: "/trends", icon: TrendingUp, label: "Trends" },
  { href: "/biosync", icon: HeartPulse, label: "BioSync" },
  { href: "/genomics", icon: Dna, label: "Genomics" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/data", icon: Database, label: "Data" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useCommandPalette();
  const { setTheme } = useTheme();

  const runCommand = (command: () => unknown) => {
    setIsOpen(false);
    command();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))} className="cursor-pointer">
            <Sun className="mr-2 h-4 w-4" />
            Light
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))} className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))} className="cursor-pointer">
            <Laptop className="mr-2 h-4 w-4" />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}