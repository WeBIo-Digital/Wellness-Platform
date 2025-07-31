"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  BarChart,
  Settings,
  HeartPulse,
  Dna,
  Sparkles,
  Database,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", icon: BarChart, label: "Dashboard" },
  { href: "/trends", icon: TrendingUp, label: "Trends" },
  { href: "/biosync", icon: HeartPulse, label: "BioSync" },
  { href: "/genomics", icon: Dna, label: "Genomics" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/data", icon: Database, label: "Data" },
];

const settingsNav = { href: "/settings", icon: Settings, label: "Settings" };

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ item }: { item: (typeof navItems)[0] }) => {
    const isActive =
      (pathname.startsWith(item.href) && item.href !== "/") ||
      pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "flex h-9 items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground",
          isExpanded ? "w-full justify-start px-3" : "w-9 justify-center",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <item.icon className='h-5 w-5' />
        {isExpanded && (
          <span className='ml-4 whitespace-nowrap'>{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-[width]",
        isExpanded ? "w-64" : "w-14"
      )}
    >
      <TooltipProvider delayDuration={0}>
        <div className='flex h-full flex-col'>
          <div
            className={cn(
              "flex h-14 items-center border-b",
              isExpanded ? "px-4" : "justify-center"
            )}
          >
            <Link href='/' className='flex items-center gap-2 font-semibold'>
              <img src={"/images/icon.svg"} alt='Logo' className='h-8 w-8' />

              {/* <Bot className="h-6 w-6 text-primary" /> */}
              {isExpanded && (
                <img src={"/images/logo.svg"} alt='Logo' className='h-6 ' />
              )}
            </Link>
          </div>
          <nav
            className={cn(
              "flex flex-col gap-1",
              isExpanded ? "p-4" : "items-center p-2"
            )}
          >
            {navItems.map((item) =>
              isExpanded ? (
                <NavLink key={item.href} item={item} />
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <NavLink item={item} />
                  </TooltipTrigger>
                  <TooltipContent side='right'>{item.label}</TooltipContent>
                </Tooltip>
              )
            )}
          </nav>
          <div className='mt-auto flex flex-col gap-1 p-4'>
            {isExpanded ? (
              <NavLink item={settingsNav} />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink item={settingsNav} />
                </TooltipTrigger>
                <TooltipContent side='right'>
                  {settingsNav.label}
                </TooltipContent>
              </Tooltip>
            )}
            <Button
              onClick={onToggle}
              variant='outline'
              size='icon'
              className='h-9 w-full mt-4'
            >
              {isExpanded ? (
                <ChevronLeft className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
              <span className='sr-only'>Toggle sidebar</span>
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </aside>
  );
}