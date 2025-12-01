import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"
import { DashboardData } from "./types"
import { dashboardMock } from "./sample-data"

const getDashboardRef = () => {
  if (!db) return null
  return doc(db, "dashboards", "primary")
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const ref = getDashboardRef()
  if (!ref) return dashboardMock
  const snap = await getDoc(ref)
  if (!snap.exists()) return dashboardMock
  return snap.data() as DashboardData
}

export const subscribeToDashboard = (callback: (data: DashboardData) => void) => {
  const ref = getDashboardRef()
  if (!ref) {
    callback(dashboardMock)
    return () => undefined
  }
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(dashboardMock)
      return
    }
    callback(snap.data() as DashboardData)
  })
}
