"use client"

import { IconLogout, IconUserCircle } from "@tabler/icons-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user: authUser, logout } = useAuth()
  const [avatarError, setAvatarError] = useState(false)
  const [dropdownAvatarError, setDropdownAvatarError] = useState(false)

  // Use the user from auth context instead of props
  const user = authUser || {
    id: '',
    name: '',
    email: '',
    image: '',
    role: '',
    createdAt: new Date()
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-teal data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  {!avatarError && user.image && user.image.trim() !== '' ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <IconUserCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 min-w-[--radix-dropdown-menu-trigger-width] rounded-lg"
              side={isMobile ? "bottom" : "bottom"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-2 py-2.5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                    {!dropdownAvatarError && user.image && user.image.trim() !== '' ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        fill
                        className="object-cover"
                        onError={() => setDropdownAvatarError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-medium text-blue-800">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="grid flex-1">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <IconLogout className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}