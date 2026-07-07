import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function AnalyticsSection({ shipments = [] }) {
  // 1. CALCULATE PIE CHART DATA DYNAMICALLY FROM DATABASE
  const totalCount = shipments.length;

  const processingCount = shipments.filter(
    (s) => s.status === "ORDER_CREATED" || s.status === "PROCESSING",
  ).length;
  const inTransitCount = shipments.filter(
    (s) => s.status === "IN_TRANSIT",
  ).length;
  const deliveredCount = shipments.filter(
    (s) => s.status === "DELIVERED",
  ).length;

  const dynamicPieData = [
    { name: "Processing", value: processingCount, color: "#f59e0b" },
    { name: "In Transit", value: inTransitCount, color: "#3b82f6" },
    { name: "Delivered", value: deliveredCount, color: "#22c55e" },
  ];

  // 2. GROUP SHIPMENT VOLUME BY DAY OF THE WEEK DYNAMICALLY
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize counts array for each day with 0 entries
  const volumeMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  shipments.forEach((s) => {
    if (s.created_at) {
      const dateObj = new Date(s.created_at);
      const dayName = daysOfWeek[dateObj.getDay()]; // Returns e.g. "Tue"
      if (volumeMap[dayName] !== undefined) {
        volumeMap[dayName] += 1;
      }
    } else {
      // Fallback fallback if timestamp data string is missing
      volumeMap["Mon"] += 1;
    }
  });

  // Re-map into format structure required by Recharts Area component
  const dynamicChartData = [
    { name: "Mon", count: volumeMap["Mon"] },
    { name: "Tue", count: volumeMap["Tue"] },
    { name: "Wed", count: volumeMap["Wed"] },
    { name: "Thu", count: volumeMap["Thu"] },
    { name: "Fri", count: volumeMap["Fri"] },
    { name: "Sat", count: volumeMap["Sat"] },
    { name: "Sun", count: volumeMap["Sun"] },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Shipment Volume Chart Component */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35 }}
        className="card-premium hover-glow p-5 xl:col-span-2 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="section-title">Shipment Volume</h3>
            <p className="section-subtitle">
              Shipments created over the last 7 days
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">
              Last 7 Days
            </span>
          </div>
        </div>

        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dynamicChartData}
              margin={{
                top: 5,
                right: 10,
                left: -20, // Adjusted padding margin alignment
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="shipmentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                padding={{ left: 12, right: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false} // Prevents fraction rendering on small database sizes
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#121216",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                }}
                labelStyle={{ color: "#94a3b8 font-bold" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#shipmentGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Shipment Status Donut Segment */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35 }}
        className="card-premium hover-glow p-4 cursor-pointer"
      >
        <div className="mb-6">
          <h3 className="section-title">Shipment Status</h3>
          <p className="section-subtitle">Current distribution</p>
        </div>

        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dynamicPieData}
                dataKey="value"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={totalCount > 0 ? 5 : 0} // Prevents glitch layout circles on empty arrays
                stroke="none"
              >
                {dynamicPieData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black text-white">
              {totalCount < 10 ? `0${totalCount}` : totalCount}
            </h2>
            <span className="text-xs text-slate-400">Active</span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {dynamicPieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: item.color,
                  }}
                />
                <span className="text-sm text-slate-300">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-400">
                {item.value < 10 ? `0${item.value}` : item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
