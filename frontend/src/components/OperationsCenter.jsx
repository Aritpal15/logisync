import React from "react";

import DashboardHeader from "./dashboard/DashboardHeader";
import KPICards from "./dashboard/KPICards";
import AnalyticsSection from "./dashboard/AnalyticsSection";
import ShipmentTable from "./dashboard/ShipmentTable";
import ActivityFeed from "./dashboard/ActivityFeed";

export default function OperationsCenter() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1650px] mx-auto px-8 py-8 space-y-7">
        <DashboardHeader />

        <KPICards />

        <AnalyticsSection />

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          <div className="2xl:col-span-2">
            <ShipmentTable />
          </div>

          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
