"use client"

import { PageFrame } from "@/components/dashboard/page-frame"
import { PageHeading } from "@/components/dashboard/page-heading"
import { useDashboardData } from "@/lib/use-dashboard-data"

const rationale = [
  {
    title: "Project Title",
    value: "IoT-Enabled Multi-Factor Environmental Monitoring",
    body: "Designed for premium strawberry cultivation inside compact Sri Lankan greenhouses.",
  },
  {
    title: "Problem Statement",
    value: "Manual checks lead to inconsistent irrigation and climate decisions",
    body: "The dashboard automates sensing and alerting so growers react before stress harms yields.",
  },
]

const parameters = [
  { label: "Day Temperature", range: "20°–24°C", note: "Vegetative boost" },
  { label: "Night Temperature", range: "10°–12°C", note: "Fruit sizing" },
  { label: "Relative Humidity", range: "60%–80%", note: "Disease balance" },
  { label: "Soil Moisture", range: "0.15–0.225 m³/m³", note: "Root zone" },
  { label: "CO₂", range: "> 400 ppm", note: "Photosynthesis" },
]

const goals = [
  "Remote visibility with 95% data uptime",
  "Commission hardware + cloud stack within 4 weeks",
  "Trigger alerts whenever °C > 28 or CO₂ < 400 ppm",
]

export default function DetailsPage() {
  const { data } = useDashboardData()

  return (
    <PageFrame active="details">
      <PageHeading title="Project Overview" subtitle="Rationale, targets, and environmental envelopes" badge="Details" />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          {rationale.map((card) => (
            <div key={card.title} className="rounded-[32px] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.body}</p>
            </div>
          ))}
          <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">SMART Goals</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {goals.map((goal) => (
                <li key={goal} className="rounded-2xl bg-slate-50 p-3">
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.1)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Optimal Parameters</p>
              <span className="text-xs text-slate-500">Strawberry greenhouse</span>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {parameters.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                    <p className="text-xs text-slate-400">{row.note}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{row.range}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] bg-slate-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Deployment</p>
            <h2 className="mt-2 text-2xl font-semibold">{data.overview.location}</h2>
            <p className="text-sm text-white/70">Sector {data.overview.zone} · {data.overview.area}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xs text-white/60">Devices connected</p>
                <p className="text-lg font-semibold">{data.devices.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xs text-white/60">Daily tasks</p>
                <p className="text-lg font-semibold">{data.tasks.length}</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-white/70">
              TLS-secured MQTT + Firebase rules restrict access to anonymized environmental data only.
            </p>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}
