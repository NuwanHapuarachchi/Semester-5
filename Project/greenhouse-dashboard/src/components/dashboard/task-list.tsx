import { TaskItem } from "@/lib/types"
import { Check } from "lucide-react"

type Props = {
  tasks: TaskItem[]
}

export const TaskList = ({ tasks }: Props) => {
  const done = tasks.filter((task) => task.status === "complete").length
  const progress = Math.round((done / tasks.length) * 100)

  return (
    <section className="h-full w-full rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Task</p>
          <p className="text-lg font-semibold text-slate-900">{progress}%</p>
        </div>
        <p className="text-sm text-slate-500">{done}/{tasks.length} Completed</p>
      </div>
      <div className="mb-4 h-2 rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start justify-between rounded-2xl border border-slate-100 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{task.title}</p>
              <p className="text-xs text-slate-500">{task.window}</p>
              <p className="text-sm text-slate-500">{task.description}</p>
            </div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${task.status === "complete" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
              <Check className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
