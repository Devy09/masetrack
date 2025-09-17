"use client"

import { AppSidebar } from '@/components/navigations/app-sidebar'
import { SiteHeader } from '@/components/sidebar/site-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 60)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <div className="flex w-full h-full">
        <AppSidebar variant="sidebar" collapsible='icon' />
        <div className="flex-1 overflow-y-auto">
          <SidebarInset/>
            <SiteHeader />
            {children}
            <Toaster richColors />
        </div>
      </div>
    </SidebarProvider>
  );
};
