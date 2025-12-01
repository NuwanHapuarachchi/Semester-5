import { SensorMetric } from "@/lib/types"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

type Props = {
  metrics: SensorMetric[]
}

const statusStyles: Record<SensorMetric["status"], string> = {
  good: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  critical: "bg-rose-50 text-rose-600",
}

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  steady: Minus,
}

export const MetricGrid = ({ metrics }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.trend ? trendIcon[metric.trend] : null
        return (
          <div key={metric.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[metric.status]}`}>{
                metric.status === "good" ? "Good" : metric.status === "warning" ? "Attention" : "Critical"
              }</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-semibold text-slate-900">
                {metric.value}
                {metric.unit ? metric.unit : ""}
              </p>
              {Icon && <Icon className="h-4 w-4 text-slate-400" />}
            </div>
            <p className="mt-2 text-sm text-slate-500">{metric.helper}</p>
          </div>
        )
      })}
    </div>
  )
}
