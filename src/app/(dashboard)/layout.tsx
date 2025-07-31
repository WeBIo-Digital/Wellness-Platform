"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { DataProvider } from "@/context/data-context";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarExpanded, toggleSidebar] = useSidebar();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // Skeleton remains the same, as it's for the initial loading state
    return (
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
          <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <Skeleton className='h-8 w-8 rounded-lg mt-5' />
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
          </nav>
        </aside>
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <div className='hidden md:flex'>
              <Skeleton className='h-5 w-32' />
            </div>
            <div className='relative ml-auto flex items-center gap-2'>
              <Skeleton className='h-10 w-[200px] hidden md:block' />
              <Skeleton className='h-10 w-10' />
              <Skeleton className='h-9 w-9 rounded-full' />
            </div>
          </header>
          <main className='flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Skeleton className='h-96 w-full' />
          </main>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />
        <div
          className={cn(
            "flex flex-col sm:gap-4 sm:py-4 transition-[padding-left]",
            isSidebarExpanded ? "sm:pl-64" : "sm:pl-14"
          )}
        >
          <Header />
          <main className='flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}