export type MetricStatus = "good" | "warning" | "critical"

export type SensorMetric = {
  id: string
  label: string
  value: string
  unit?: string
  helper: string
  trend?: "up" | "down" | "steady"
  status: MetricStatus
}

export type DeviceStatus = {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "issue"
  note?: string
}

export type TaskItem = {
  id: string
  title: string
  window: string
  description: string
  status: "pending" | "complete"
}

export type SectionHealth = {
  id: string
  label: string
  crop: string
  score: number
  status: MetricStatus
}

export type CameraFeed = {
  id: string
  label: string
  url: string
  thumbnails: string[]
}

export type AlertSummary = {
  total: number
  critical: number
  open: number
}

export type DashboardData = {
  overview: {
    location: string
    timestamp: string
    weather: {
      temperature: string
      condition: string
      high: string
      low: string
    }
    zone: string
    area: string
  }
  metrics: SensorMetric[]
  devices: DeviceStatus[]
  tasks: TaskItem[]
  sections: SectionHealth[]
  alerts: AlertSummary
  camera: CameraFeed
}
