import Link from "next/link"
import { Home, Leaf, ClipboardList, ClipboardCheck, Radio, Activity } from "lucide-react"

export type NavKey = "overview" | "details" | "plant" | "tasks" | "devices" | "activity"

const navItems: { id: NavKey; icon: typeof Home; href: string; label: string }[] = [
  { id: "overview", icon: Home, href: "/", label: "Overview" },
  { id: "details", icon: ClipboardList, href: "/details", label: "Details" },
  { id: "plant", icon: Leaf, href: "/plant", label: "Plant" },
  { id: "tasks", icon: ClipboardCheck, href: "/tasks", label: "Tasks" },
  { id: "devices", icon: Radio, href: "/devices", label: "Devices" },
  { id: "activity", icon: Activity, href: "/activity", label: "Activity" },
]

type Props = {
  active: NavKey
}

export const SidebarNav = ({ active }: Props) => {
  return (
    <aside className="flex h-[calc(100vh-4rem)] w-16 flex-col items-center rounded-[32px] bg-white/80 py-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-slate-400 transition hover:text-slate-900 ${
                active === item.id ? "bg-slate-900 text-white" : "bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
