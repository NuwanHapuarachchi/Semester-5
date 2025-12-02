import { CameraFeed } from "@/lib/types"
import { Camera, Maximize2, Pause, Play } from "lucide-react"

type Props = {
  camera: CameraFeed
}

export const CameraPanel = ({ camera }: Props) => {
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
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-slate-600">
          Analytic
        </div>
        <div className="absolute bottom-4 left-0 right-0 mx-auto flex max-w-[220px] items-center justify-between rounded-full bg-white/90 px-4 py-2 text-slate-700">
          <button className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">CCTV</button>
          <div className="flex gap-2">
            <button className="rounded-full bg-slate-100 p-2">
              <Play className="h-4 w-4" />
            </button>
            <button className="rounded-full bg-slate-100 p-2">
              <Pause className="h-4 w-4" />
            </button>
          </div>
          <button className="rounded-full bg-slate-900 p-2 text-white">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
