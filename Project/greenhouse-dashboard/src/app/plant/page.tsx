"use client"

import { PageFrame } from "@/components/dashboard/page-frame"
import { PageHeading } from "@/components/dashboard/page-heading"
import { useDashboardData } from "@/lib/use-dashboard-data"

const heroUrl = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"

export default function PlantPage() {
  const { data } = useDashboardData()
  const { sections } = data
  const overall = Math.round(
    sections.reduce((sum, section) => sum + section.score, 0) / (sections.length || 1)
  )

  return (
    <PageFrame active="plant">
      <PageHeading title="Plant Insights" subtitle="Section level health & CCTV analytics" badge="Plant" />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overall health</p>
            <p className="text-4xl font-semibold text-slate-900">{overall}%</p>
            <p className="text-sm text-slate-500">{data.overview.zone}</p>
          </div>
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{section.label}</p>
                  <p className="text-xs text-slate-500">{section.crop}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      section.status === "good"
                        ? "text-emerald-500"
                        : section.status === "warning"
                        ? "text-amber-500"
                        : "text-rose-500"
                    }`}
                  >
                    {section.score}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {section.status === "good" ? "Stable" : section.status === "warning" ? "Monitor" : "Critical"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[460px] rounded-[40px] bg-slate-200 shadow-[0_40px_90px_rgba(15,23,42,0.15)]">
          <div
            className="absolute inset-0 rounded-[40px]"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.15), rgba(15,23,42,0.5)), url(${heroUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium">Analytic</span>
              <span className="text-sm text-white/80">CCTV</span>
            </div>
            <div>
              <p className="text-lg font-semibold">Camera Grid</p>
              <p className="text-sm text-white/80">HD stream with section overlays</p>
            </div>
            <div className="flex gap-2">
              {["Section 1", "Section 3", "Section 7", "Section 8"].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}
