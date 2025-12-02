"use client"

import { useState } from "react"
import { CameraFeed } from "@/lib/types"
import { Camera, Maximize2, Pause, Play } from "lucide-react"

type Props = {
  camera: CameraFeed
}

export const CameraPanel = ({ camera }: Props) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<"cctv" | "analytic">("cctv")

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleFullscreen = () => setIsFullscreen(!isFullscreen)
  const toggleViewMode = () => setViewMode(viewMode === "cctv" ? "analytic" : "cctv")

  return (
    <section className="flex h-full w-full flex-col rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Live Feed</p>
          <p className="text-lg font-semibold text-slate-900">{camera.label}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Camera className="h-4 w-4" />
          1/5
        </div>
      </div>
      <div className="relative flex-1 w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-200 via-emerald-100 to-white">
        <button
          onClick={toggleViewMode}
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-slate-600 transition hover:bg-white cursor-pointer"
        >
          {viewMode === "cctv" ? "Analytic" : "CCTV"}
        </button>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-white font-semibold">Paused</span>
          </div>
        )}
        <div className="absolute bottom-4 left-0 right-0 mx-auto flex max-w-[220px] items-center justify-between rounded-full bg-white/90 px-4 py-2 text-slate-700">
          <button
            onClick={toggleViewMode}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition cursor-pointer ${viewMode === "cctv" ? "bg-slate-900 text-white" : "bg-slate-100"}`}
          >
            CCTV
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className={`rounded-full p-2 transition cursor-pointer ${isPlaying ? "bg-emerald-500 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              onClick={handlePause}
              className={`rounded-full p-2 transition cursor-pointer ${!isPlaying ? "bg-amber-500 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleFullscreen}
            className="rounded-full bg-slate-900 p-2 text-white transition hover:bg-slate-700 cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
