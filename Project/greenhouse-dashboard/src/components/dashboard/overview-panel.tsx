"use client"

import { useState } from "react"
import Image from "next/image"
import { DashboardData } from "@/lib/types"

type Props = {
  overview: DashboardData["overview"]
}

export const OverviewPanel = ({ overview }: Props) => {
  const [showMapView, setShowMapView] = useState(false)
  const realtime = new Date().toLocaleString("en-LK", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const timestampLabel = overview.timestamp === "live" ? realtime : overview.timestamp || realtime
  return (
    <section className="w-full rounded-[32px] bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-stretch gap-6">
            <div className="rounded-[28px] bg-slate-900 px-8 py-6 text-white shadow-[0_25px_70px_rgba(15,23,42,0.3)]">
              <p className="text-sm text-white/70">{overview.weather.condition}</p>
              <p className="text-5xl font-semibold leading-tight">{overview.weather.temperature}°C</p>
              <p className="text-sm text-white/70">H:{overview.weather.high}°C · L:{overview.weather.low}°C</p>
            </div>
            <div className="rounded-[28px] bg-emerald-50 px-8 py-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
              <p className="text-sm text-emerald-600">Soil Moisture</p>
              <p className="text-5xl font-semibold leading-tight text-emerald-900">65%</p>
              <p className="text-sm text-emerald-700">Optimal range</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-100 bg-white px-8 py-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Location</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{overview.location}</p>
            <p className="text-sm text-slate-500">{timestampLabel}</p>
            <div className="mt-4 rounded-[22px] border border-slate-100 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Strawberry House</p>
              <p className="text-xl font-semibold text-slate-900">{overview.zone}</p>
              <p className="text-sm text-slate-500">Area {overview.area}</p>
            </div>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-200 via-slate-100 to-white min-h-[320px]">
          <Image
            src="/128532.jpg"
            alt="Strawberry section layout"
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-slate-900/20" />
          <button className="absolute left-6 top-6 z-10 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-lg transition hover:bg-slate-50 cursor-pointer">PL-02J</button>
          <button className="absolute right-6 top-16 z-10 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 cursor-pointer">PL-20T</button>
          <button
            onClick={() => setShowMapView(!showMapView)}
            className={`absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-lg transition cursor-pointer ${showMapView ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
          >
            Map view
          </button>
        </div>
      </div>
    </section>
  )
}
