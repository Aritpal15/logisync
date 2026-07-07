import React from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw, Truck, CheckCircle2 } from "lucide-react";

export default function KPICards({ shipments = [], loading = false }) {
  // 1. Calculate real-time metrics from our backend database array
  const totalShipments = shipments.length;

  const processingCount = shipments.filter(
    (s) => s.status === "ORDER_CREATED" || s.status === "PROCESSING",
  ).length;

  const inTransitCount = shipments.filter(
    (s) => s.status === "IN_TRANSIT",
  ).length;
  const deliveredCount = shipments.filter(
    (s) => s.status === "DELIVERED",
  ).length;

  // Helper utility to pad numbers with a leading zero for a consistent UI layout style
  const formatValue = (num) => (num < 10 ? `0${num}` : num.toString());

  // 2. Map dynamic values directly into ChatGPT's design schema matrix array
  const dynamicKpis = [
    {
      title: "Total Shipments",
      value: formatValue(totalShipments),
      change: "Live Ledger",
      icon: Package,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Processing Queue",
      value: formatValue(processingCount),
      change: "In Production",
      icon: RefreshCw,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    {
      title: "In Transit",
      value: formatValue(inTransitCount),
      change: "On Route",
      icon: Truck,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      title: "Delivered",
      value: formatValue(deliveredCount),
      change: "Completed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {dynamicKpis.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -6,
              transition: { duration: 0.2 },
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
            }}
            className="card-premium hover-glow cursor-pointer p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="kpi-label">{card.title}</p>

                <h2 className="kpi-value mt-3">
                  {loading ? "..." : card.value}
                </h2>

                <p className="kpi-change mt-3">{card.change}</p>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon className={`w-7 h-7 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
