import { ReactNode } from "react"
import { SidebarNav, NavKey } from "./sidebar-nav"

type Props = {
  active: NavKey
  children: ReactNode
}

export const PageFrame = ({ active, children }: Props) => {
  return (
    <div className="min-h-screen bg-[#dfe3e8] py-8">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-6">
        <div className="sticky top-8 h-fit">
          <SidebarNav active={active} />
        </div>
        <div className="flex-1 space-y-6">{children}</div>
      </div>
    </div>
  )
}
