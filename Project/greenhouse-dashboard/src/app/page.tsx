'use client'

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useDashboardData } from "@/lib/use-dashboard-data"

export default function Home() {
  const { data, loading } = useDashboardData()
  return <DashboardShell data={data} loading={loading} />
}
