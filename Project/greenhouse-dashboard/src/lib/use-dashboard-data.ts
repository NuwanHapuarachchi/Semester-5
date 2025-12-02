"use client"

import { useEffect, useState, useCallback } from "react"
import { DashboardData } from "./types"
import { getDashboardData, subscribeToDashboard } from "./dashboard-data"
import { dashboardMock } from "./sample-data"
import { fetchWeatherData } from "./weather-api"

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(dashboardMock)
  const [loading, setLoading] = useState(true)

  const updateWeatherData = useCallback(async (currentData: DashboardData) => {
    const weather = await fetchWeatherData()
    if (weather) {
      const updatedData: DashboardData = {
        ...currentData,
        overview: {
          ...currentData.overview,
          location: weather.location,
          weather: {
            temperature: weather.temperature,
            condition: weather.condition,
            high: weather.high,
            low: weather.low,
          },
        },
        metrics: currentData.metrics.map((metric) => {
          if (metric.id === "humidity") {
            return {
              ...metric,
              value: weather.humidity.toString(),
            }
          }
          if (metric.id === "wind") {
            return {
              ...metric,
              value: weather.windSpeed.toString(),
            }
          }
          return metric
        }),
      }
      return updatedData
    }
    return currentData
  }, [])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    const boot = async () => {
      const initial = await getDashboardData()
      const withWeather = await updateWeatherData(initial)
      setData(withWeather)
      setLoading(false)
      unsubscribe = subscribeToDashboard(async (snapshot) => {
        const updated = await updateWeatherData(snapshot)
        setData(updated)
      })
    }
    boot()

    const weatherInterval = setInterval(async () => {
      setData((prev) => {
        updateWeatherData(prev).then(setData)
        return prev
      })
    }, 180000)

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      clearInterval(weatherInterval)
    }
  }, [updateWeatherData])

  return { data, loading }
}
