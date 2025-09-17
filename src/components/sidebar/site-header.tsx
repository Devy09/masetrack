import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useAuth } from "@/contexts/auth-context"

export function SiteHeader() {
  const { user } = useAuth()
  
  const defaultAvatar = "/most-logo.png"
  
  const userData = user ? {
    id: user.id,
    name: user.name || 'User',
    email: user.email,
    avatar: user.image || defaultAvatar,
    role: user.role || 'user',
    image: user.image || defaultAvatar
  } : null
  console.log('User data:', {
    ...user,
    hasImage: !!user?.image,
    imagePath: user?.image
  });

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 mt-2 pb-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          {userData && <NavUser />}
        </div>
      </div>
    </header>
  )
}
