import { ReactNode } from "react"

type Props = {
  title: string
  subtitle: string
  badge?: string
  action?: ReactNode
}

export const PageHeading = ({ title, subtitle, badge, action }: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        {badge && <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{badge}</p>}
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
