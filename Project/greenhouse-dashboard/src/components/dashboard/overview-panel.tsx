import { DashboardData } from "@/lib/types"
import { MapPin } from "lucide-react"

type Props = {
  overview: DashboardData["overview"]
}

export const OverviewPanel = ({ overview }: Props) => {
  return (
    <section className="rounded-[32px] bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="rounded-[28px] bg-slate-900 px-8 py-6 text-white">
              <p className="text-sm text-white/70">{overview.weather.condition}</p>
              <p className="text-5xl font-semibold leading-tight">{overview.weather.temperature}°C</p>
              <p className="text-sm text-white/70">H:{overview.weather.high}°C · L:{overview.weather.low}°C</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Location</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{overview.location}</p>
              <p className="text-sm text-slate-500">{overview.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
            <MapPin className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold">{overview.zone}</p>
              <p className="text-xs text-slate-500">Area {overview.area}</p>
            </div>
          </div>
        </div>
        <div className="relative h-56 flex-1 rounded-[32px] bg-gradient-to-br from-slate-200 via-slate-100 to-white">
          <span className="absolute left-6 top-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-lg">PL-02J</span>
          <span className="absolute right-10 top-16 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">PL-20T</span>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-lg">
            Map view
          </div>
        </div>
      </div>
    </section>
  )
}
