"use client"

import * as React from "react"
import {
  IconCalendar,
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/sidebar/nav-documents"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ClipboardEdit, ClipboardPlus, GraduationCap, FilePlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Define menu items for each role
type MenuItem = {
  title: string
  url: string
  icon: any
  roles?: string[] // If undefined, menu item is visible to all roles
}

const menuItems: { [key: string]: MenuItem[] } = {
  // Common items for all roles
  common: [
    
  ],
  
  // Admin specific items
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      icon: IconDashboard,
      roles: ["admin", "personnel"],
    },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: IconUsers,
      roles: ["admin"],
    },
    {
      title: "Schedule Submission",
      url: "/dashboard/schedule-submission",
      icon: ClipboardEdit,
      roles: ["admin", "personnel"],
    },  
    {
      title: "Calendar Management",
      url: "/dashboard/calendar-management",
      icon: IconCalendar,
      roles: ["admin", "personnel"],
    },
    {
      title: "Dashboard",
      url: "/dashboard/user-overview",
      icon: IconDashboard,
      roles: ["user"],
    },
    {
      title: "Polls",
      url: "/dashboard/polls",
      icon: IconChartBar,
      roles: ["admin", "personnel", "user"],
    },
  ],
  
  // Personnel specific items
  personnel: [
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconReport,
      roles: ["personnel", "admin"],
    },
  ],

  // User specific items
  user: [
    {
      title: "Dashboard",
      url: "/dashboard/user-overview",
      icon: IconDashboard,
      roles: ["user"],
    },
  ],
  
  // Documents section
  documents: [
    {
      title: "Submit Certificate",
      url: "/dashboard/submit-certificate",
      icon: FilePlus,
      roles: ["user", "admin"],
    },
    {
      title: "All Submissions",
      url: "/dashboard/submissions",
      icon: IconFolder,
      roles: ["user", "admin", "personnel"],
    },
  ],
  
  // Footer items
  secondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      roles: ["admin", "personnel"],
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
      roles: ["admin", "personnel"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const userRole = user?.role || 'USER'

  // Filter menu items based on user role
  const filterItemsByRole = (items: MenuItem[]) => {
    return items.filter(item => {
      if (!item.roles) return true
      return item.roles.includes(userRole)
    })
  }

  // Get filtered menu items
  const navMainItems = [
    ...menuItems.common,
    ...filterItemsByRole(menuItems.admin),
    ...filterItemsByRole(menuItems.personnel),
  ]
  
  const documentItems = filterItemsByRole(menuItems.documents)
  
  const secondaryItems = filterItemsByRole(menuItems.secondary)

  return (
    <Sidebar collapsible="icon" {...props} className="bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <GraduationCap className="!size-5"/>
                <span className="text-base font-semibold">MASETrack</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        {documentItems.length > 0 && <NavDocuments items={documentItems} />}
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
