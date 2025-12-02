"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, Bell, ChevronDown, X } from "lucide-react"
import { AlertSummary } from "@/lib/types"

type Props = {
  sector: string
  alerts: AlertSummary
  loading: boolean
}

export const HeaderBar = ({ sector, alerts, loading }: Props) => {
  const [showSectorMenu, setShowSectorMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedSector, setSelectedSector] = useState(sector)

  const sectors = ["Strawberry House 01", "Strawberry House 02", "Tomato Section A", "Herb Garden"]

  const handleSectorSelect = (s: string) => {
    setSelectedSector(s)
    setShowSectorMenu(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
        <div className="mt-1 flex items-center gap-4">
          <h1 className="text-3xl font-semibold text-slate-900">Greenhouse Monitoring</h1>
          <div className="relative">
            <button
              onClick={() => setShowSectorMenu(!showSectorMenu)}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white cursor-pointer"
            >
              Sector: {selectedSector}
              <ChevronDown className={`h-4 w-4 transition ${showSectorMenu ? "rotate-180" : ""}`} />
            </button>
            {showSectorMenu && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl bg-white p-2 shadow-lg">
                {sectors.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSectorSelect(s)}
                    className={`w-full rounded-xl px-4 py-2 text-left text-sm transition cursor-pointer ${s === selectedSector ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/activity" className="flex items-center gap-2 rounded-[20px] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          {alerts.total} Alerts
          <span className="text-slate-400">·</span>
          {alerts.critical} Critical
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {!loading && alerts.open > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-white">
                {alerts.open}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl bg-white p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-slate-900">Notifications</p>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-800">Temperature Alert</p>
                  <p className="text-xs text-amber-600">Exceeded 28°C threshold</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">System Update</p>
                  <p className="text-xs text-slate-500">Sensors synced successfully</p>
                </div>
              </div>
              <Link href="/activity" className="mt-3 block text-center text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer">
                View all activity
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
