"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  PanelLeft,
  Bot,
  BarChart,
  Settings,
  Search,
  HeartPulse,
  Dna,
  Sparkles,
  Database,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "@/context/command-palette-context";

const mobileNavItems = [
  { href: "/", icon: BarChart, label: "Dashboard" },
  { href: "/trends", icon: TrendingUp, label: "Trends" },
  { href: "/biosync", icon: HeartPulse, label: "BioSync" },
  { href: "/genomics", icon: Dna, label: "Genomics" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/data", icon: Database, label: "Data" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Header() {
  const pathname = usePathname();
  const { setIsOpen } = useCommandPalette();
  const breadcrumbPath = pathname.split('/').filter(p => p);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Bot className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">WeBioDigital</span>
            </Link>
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                  pathname.startsWith(item.href) && "text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbPath.map((path, index) => (
            <BreadcrumbItem key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbPage className="capitalize">{path}</BreadcrumbPage>
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Button
          variant="outline"
          className="flex w-full items-center justify-between text-muted-foreground md:w-[200px] lg:w-[336px]"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search...
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      <ThemeToggle />
      <UserNav />
    </header>
  );
}