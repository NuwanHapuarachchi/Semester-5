"use client"

import { Check, Clock } from "lucide-react"
import { PageFrame } from "@/components/dashboard/page-frame"
import { PageHeading } from "@/components/dashboard/page-heading"
import { useDashboardData } from "@/lib/use-dashboard-data"

export default function TasksPage() {
  const { data } = useDashboardData()
  const total = data.tasks.length
  const done = data.tasks.filter((task) => task.status === "complete").length
  const progress = Math.round((done / (total || 1)) * 100)

  return (
    <PageFrame active="tasks">
      <PageHeading title="Task Board" subtitle="Agronomy rituals synchronized with alerts" badge="Tasks" />
      <div className="rounded-[40px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Completion</p>
            <p className="text-4xl font-semibold text-slate-900">{progress}%</p>
          </div>
          <div className="flex gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
              <Check className="h-4 w-4 text-emerald-500" /> Completed
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
              <Clock className="h-4 w-4 text-amber-500" /> Pending
            </span>
          </div>
        </div>
        <div className="mb-6 h-2 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-4">
          {data.tasks.map((task, index) => (
            <div key={task.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  task.status === "complete" ? "bg-emerald-500 text-white" : "bg-white text-slate-500 border border-slate-200"
                }`}>
                  {index + 1}
                </span>
                {index !== data.tasks.length - 1 && <span className="mt-1 h-12 w-px bg-slate-200" />}
              </div>
              <div className="flex-1 rounded-3xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.window}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      task.status === "complete" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {task.status === "complete" ? "Done" : "Scheduled"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageFrame>
  )
}
