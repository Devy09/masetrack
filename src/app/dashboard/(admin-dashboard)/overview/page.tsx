import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { DataTable } from '@/components/sidebar/data-table'
import { SectionCards } from '@/components/sidebar/section-cards'

import data from "./data.json"

export default function Page() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="grid grid-cols-1 gap-6 m-6">
          <div className="bg-card rounded-lg border p-6 w-full">
            <ChartAreaInteractive />
          </div>
          <div className="w-full">
            <DataTable data={data} />
          </div>  
        </div>
      </div>
    </div>
  )
}
