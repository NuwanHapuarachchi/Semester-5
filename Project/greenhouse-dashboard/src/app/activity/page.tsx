"use client"

import { Activity as ActivityIcon, Bell, Mail, RefreshCw } from "lucide-react"
import { PageFrame } from "@/components/dashboard/page-frame"
import { PageHeading } from "@/components/dashboard/page-heading"
import { useDashboardData } from "@/lib/use-dashboard-data"

const log = [
  { id: "log-1", label: "Auto alert", detail: "Temperature exceeded 28°C", time: "08:02", icon: Bell },
  { id: "log-2", label: "Email sent", detail: "Grower notified about CO₂ dip", time: "08:04", icon: Mail },
  { id: "log-3", label: "MQTT sync", detail: "ESP32 reported new payload", time: "08:05", icon: RefreshCw },
]

export default function ActivityPage() {
  const { data } = useDashboardData()

  return (
    <PageFrame active="activity">
      <PageHeading title="Activity" subtitle="Automations, alerts, and sync history" badge="Activity" />
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Alert status</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{data.alerts.total}</p>
          <p className="text-sm text-slate-500">{data.alerts.critical} critical · {data.alerts.open} open</p>
          <div className="mt-6 space-y-3">
            {log.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <span className="ml-auto text-xs text-slate-400">{item.time}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-[40px] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Data flow</p>
              <p className="text-3xl font-semibold text-slate-900">Perception → Application</p>
            </div>
            <ActivityIcon className="h-10 w-10 text-emerald-500" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Sensors", "ESP32", "Firebase"].map((stage, index) => (
              <div key={stage} className="rounded-3xl border border-slate-100 p-4 text-center">
                <p className="text-sm font-semibold text-slate-900">{stage}</p>
                <p className="text-xs text-slate-500">{index === 0 ? "Moisture, RH, CO₂" : index === 1 ? "MQTT publish" : "Storage + UI"}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[32px] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Security</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>WPA2 greenhouse Wi-Fi + per-device keys</li>
              <li>TLS MQTT channel with revocable tokens</li>
              <li>Firestore rules: read-only dashboard role</li>
            </ul>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}
