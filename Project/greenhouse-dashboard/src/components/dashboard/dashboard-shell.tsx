import { DashboardData } from "@/lib/types"
import { HeaderBar } from "./header-bar"
import { OverviewPanel } from "./overview-panel"
import { MetricGrid } from "./metric-grid"
import { DeviceList } from "./device-list"
import { CameraPanel } from "./camera-panel"
import { TaskList } from "./task-list"
import { SectionPanel } from "./section-panel"
import { PageFrame } from "./page-frame"

type Props = {
  data: DashboardData
  loading: boolean
}

export const DashboardShell = ({ data, loading }: Props) => {
  return (
    <PageFrame active="overview">
      <HeaderBar sector={data.overview.zone} alerts={data.alerts} loading={loading} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <OverviewPanel overview={data.overview} />
          <MetricGrid metrics={data.metrics} />
          <SectionPanel sections={data.sections} />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <DeviceList devices={data.devices} />
          <CameraPanel camera={data.camera} />
          <TaskList tasks={data.tasks} />
        </div>
      </div>
    </PageFrame>
  )
}
