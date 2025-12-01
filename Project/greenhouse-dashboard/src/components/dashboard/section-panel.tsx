import { SectionHealth } from "@/lib/types"
import { AlertTriangle, Leaf } from "lucide-react"

type Props = {
  sections: SectionHealth[]
}

const statusTone: Record<SectionHealth["status"], string> = {
  good: "text-emerald-500",
  warning: "text-amber-500",
  critical: "text-rose-500",
}

export const SectionPanel = ({ sections }: Props) => {
  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Plant</p>
              <p className="text-3xl font-semibold text-slate-900">Overall health 92%</p>
            </div>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Analytic</button>
          </div>
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{section.label}</p>
                  <p className="text-xs text-slate-500">{section.crop}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${statusTone[section.status]}`}>{section.score}%</span>
                  {section.status !== "good" && <AlertTriangle className={`h-4 w-4 ${statusTone[section.status]}`} />}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[360px] rounded-[32px] bg-gradient-to-br from-emerald-300 via-emerald-100 to-white">
          <div className="absolute inset-0 rounded-[32px] border-2 border-dashed border-white/60" />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">
            <Leaf className="h-4 w-4 text-emerald-500" />
            Section view
          </div>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {[1, 2, 3, 4].map((dot) => (
              <span key={dot} className={`h-2 w-2 rounded-full ${dot === 1 ? "bg-slate-900" : "bg-white/60"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
