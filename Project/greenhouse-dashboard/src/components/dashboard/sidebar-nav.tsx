import { Home, Leaf, Map, Camera, Bell, Settings } from "lucide-react"

const navItems = [
  { id: "home", icon: Home, active: false },
  { id: "plant", icon: Leaf, active: true },
  { id: "map", icon: Map, active: false },
  { id: "camera", icon: Camera, active: false },
  { id: "alerts", icon: Bell, active: false },
  { id: "settings", icon: Settings, active: false },
]

export const SidebarNav = () => {
  return (
    <aside className="flex w-16 flex-col items-center rounded-[32px] bg-white/80 py-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl font-semibold">
        G
      </div>
      <div className="flex flex-1 flex-col items-center gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-slate-400 transition hover:text-slate-900 ${
                item.active ? "bg-slate-900 text-white" : "bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>
    </aside>
  )
}
