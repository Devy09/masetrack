'use client'

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button 
      variant="ghost" 
      onClick={logout}
      className="w-full justify-start"
    >
      Logout
    </Button>
  )
}
