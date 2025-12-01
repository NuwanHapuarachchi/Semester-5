import { AlertTriangle, Bell, ChevronDown } from "lucide-react"
import { AlertSummary } from "@/lib/types"

type Props = {
  sector: string
  alerts: AlertSummary
  loading: boolean
}

export const HeaderBar = ({ sector, alerts, loading }: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
        <div className="mt-1 flex items-center gap-4">
          <h1 className="text-3xl font-semibold text-slate-900">Greenhouse Monitoring</h1>
          <button className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-slate-600 shadow-sm">
            Sector: {sector}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-[20px] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          {alerts.total} Alerts
          <span className="text-slate-400">·</span>
          {alerts.critical} Critical
        </div>
        <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Bell className="h-5 w-5 text-slate-600" />
          {!loading && alerts.open > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-white">
              {alerts.open}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
