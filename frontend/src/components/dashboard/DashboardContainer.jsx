import React, { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import KPICards from "./KPICards";
import AnalyticsSection from "./AnalyticsSection";
import ShipmentTable from "./ShipmentTable";
import ActivityFeed from "./ActivityFeed";

export default function DashboardContainer() {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/shipments");
      if (!response.ok) throw new Error("Data cluster failure.");
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error("Dashboard pull error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-8 overflow-y-auto space-y-6 bg-[#070709]">
      {/* Top Banner Module */}
      <DashboardHeader />

      {/* KPI Cards Strip */}
      <KPICards shipments={shipments} loading={isLoading} />

      {/* Analytics Charts — Spanning Full Width Row */}
      <div className="w-full py-1">
        <AnalyticsSection shipments={shipments} />
      </div>

      {/* Split Column Module: Table on Left side, Activity Feed on Right Side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-1 items-start">
        <div className="xl:col-span-2">
          <ShipmentTable shipments={shipments} />
        </div>
        <div className="xl:col-span-1">
          {/* Force pass-through of the shipments array explicitly */}
          <ActivityFeed shipments={shipments} />
        </div>
      </div>
    </div>
  );
}
