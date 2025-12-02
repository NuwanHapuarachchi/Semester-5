import { DeviceStatus } from "@/lib/types"
import { Activity, Camera, Radio } from "lucide-react"

type Props = {
  devices: DeviceStatus[]
}

const statusColor: Record<DeviceStatus["status"], string> = {
  online: "bg-emerald-500",
  offline: "bg-slate-300",
  issue: "bg-amber-400",
}

const iconForType = (type: string) => {
  if (type.toLowerCase().includes("camera")) return Camera
  if (type.toLowerCase().includes("sensor")) return Activity
  return Radio
}

export const DeviceList = ({ devices }: Props) => {
  return (
    <section className="h-full w-full rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg font-semibold text-slate-900">Device</p>
        <span className="text-sm text-slate-500">Sensor {devices.length}</span>
      </div>
      <div className="space-y-4">
        {devices.map((device) => {
          const Icon = iconForType(device.type)
          return (
            <div key={device.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{device.name}</p>
                  <p className="text-xs text-slate-500">#{device.id} · {device.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${statusColor[device.status]}`} />
                  {device.status === "online" ? "Online" : device.status === "issue" ? "Issue" : "Offline"}
                </div>
                {device.note && <p className="text-xs text-amber-500">{device.note}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
