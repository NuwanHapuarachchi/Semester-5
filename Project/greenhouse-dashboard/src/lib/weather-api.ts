export type WeatherApiResponse = {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    tz_id: string
    localtime_epoch: number
    localtime: string
  }
  current: {
    last_updated_epoch: number
    last_updated: string
    temp_c: number
    temp_f: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_mph: number
    wind_kph: number
    wind_degree: number
    wind_dir: string
    pressure_mb: number
    pressure_in: number
    precip_mm: number
    precip_in: number
    humidity: number
    cloud: number
    feelslike_c: number
    feelslike_f: number
    windchill_c: number
    windchill_f: number
    heatindex_c: number
    heatindex_f: number
    dewpoint_c: number
    dewpoint_f: number
    vis_km: number
    vis_miles: number
    uv: number
    gust_mph: number
    gust_kph: number
  }
}

export type WeatherData = {
  temperature: string
  condition: string
  high: string
  low: string
  humidity: number
  windSpeed: number
  location: string
}

export const fetchWeatherData = async (): Promise<WeatherData | null> => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
  const location = process.env.NEXT_PUBLIC_WEATHER_LOCATION || "Colombo"

  if (!apiKey) {
    console.warn("Weather API key not configured")
    return null
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data: WeatherApiResponse = await response.json()

    return {
      temperature: Math.round(data.current.temp_c).toString(),
      condition: data.current.condition.text,
      high: Math.round(data.current.feelslike_c).toString(),
      low: Math.round(data.current.dewpoint_c).toString(),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph / 3.6),
      location: `${data.location.name}, ${data.location.country}`,
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error)
    return null
  }
}
