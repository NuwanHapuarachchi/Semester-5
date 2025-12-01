"use client"

import { ReactNode } from "react"
import { Signal, WifiOff, AlertTriangle } from "lucide-react"
import { PageFrame } from "@/components/dashboard/page-frame"
import { PageHeading } from "@/components/dashboard/page-heading"
import { useDashboardData } from "@/lib/use-dashboard-data"

export default function DevicesPage() {
  const { data } = useDashboardData()
  const online = data.devices.filter((d) => d.status === "online").length
  const issues = data.devices.filter((d) => d.status === "issue").length
  const offline = data.devices.filter((d) => d.status === "offline").length

  return (
    <PageFrame active="devices">
      <PageHeading title="Device Health" subtitle="Sensors, cameras, and maintenance flags" badge="Devices" />
      <div className="grid gap-6 lg:grid-cols-3">
        <SummaryCard label="Online" value={online} accent="bg-emerald-500" icon={<Signal className="h-5 w-5" />} />
        <SummaryCard label="Issues" value={issues} accent="bg-amber-500" icon={<AlertTriangle className="h-5 w-5" />} />
        <SummaryCard label="Offline" value={offline} accent="bg-rose-500" icon={<WifiOff className="h-5 w-5" />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {data.devices.map((device) => (
          <div key={device.id} className="rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{device.name}</p>
                <p className="text-xs text-slate-500">{device.type}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  device.status === "online"
                    ? "bg-emerald-50 text-emerald-600"
                    : device.status === "issue"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {device.status === "online" ? "Online" : device.status === "issue" ? "Signal issue" : "Offline"}
              </span>
            </div>
            <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>ID #{device.id}</p>
              {device.note ? <p className="text-amber-500">{device.note}</p> : <p>Running nominally</p>}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <p>MQTT secured</p>
              <p>Last sync 5 min ago</p>
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  )
}

type SummaryCardProps = {
  label: string
  value: number
  accent: string
  icon: ReactNode
}

const SummaryCard = ({ label, value, accent, icon }: SummaryCardProps) => {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white ${accent}`}>
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}
