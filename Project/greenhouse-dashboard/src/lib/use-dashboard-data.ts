"use client"

import { useEffect, useState } from "react"
import { DashboardData } from "./types"
import { getDashboardData, subscribeToDashboard } from "./dashboard-data"
import { dashboardMock } from "./sample-data"

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(dashboardMock)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    const boot = async () => {
      const initial = await getDashboardData()
      setData(initial)
      setLoading(false)
      unsubscribe = subscribeToDashboard((snapshot) => setData(snapshot))
    }
    boot()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return { data, loading }
}
