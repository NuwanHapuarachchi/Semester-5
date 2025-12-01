import { DashboardData } from "@/lib/types"
import { SidebarNav } from "./sidebar-nav"
import { HeaderBar } from "./header-bar"
import { OverviewPanel } from "./overview-panel"
import { MetricGrid } from "./metric-grid"
import { DeviceList } from "./device-list"
import { CameraPanel } from "./camera-panel"
import { TaskList } from "./task-list"
import { SectionPanel } from "./section-panel"

type Props = {
  data: DashboardData
  loading: boolean
}

export const DashboardShell = ({ data, loading }: Props) => {
  return (
    <div className="min-h-screen bg-[#dfe3e8] py-8">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-6">
        <SidebarNav />
        <div className="flex-1 space-y-6">
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
        </div>
      </div>
    </div>
  )
}
