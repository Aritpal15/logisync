import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Truck,
  CheckCircle2,
  ArrowUpRight,
  FilePlus,
} from "lucide-react";

export default function ActivityFeed({ shipments = [] }) {
  // Direct console verification log to track what's landing inside the component
  console.log("🤖 ActivityFeed Prop Received:", shipments);

  // Dynamically assemble tracking stream logs based on real database items
  const generateLiveLogs = () => {
    let dynamicLogs = [];

    if (!shipments || shipments.length === 0) {
      return [];
    }

    shipments.forEach((s) => {
      const currentStatus = s.status ? s.status.toUpperCase() : "ORDER_CREATED";
      const shortTrack = s.tracking_number || "Unknown ID";

      // 1. Ingestion entry (Always exists for every shipment)
      dynamicLogs.push({
        id: `${s.id}-created`,
        icon: FilePlus,
        title: "Shipment Ingested",
        message: `Parcel ${shortTrack} successfully committed to system storage node.`,
        time: "Active",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      });

      // 2. Processing state log
      if (
        currentStatus === "PROCESSING" ||
        currentStatus === "IN_TRANSIT" ||
        currentStatus === "DELIVERED"
      ) {
        dynamicLogs.push({
          id: `${s.id}-processing`,
          icon: Database,
          title: "Processing Queue",
          message: `Background daemon allocated sorting tasks for tracking unit ${shortTrack}.`,
          time: "Active",
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
        });
      }

      // 3. Transit state log
      if (currentStatus === "IN_TRANSIT" || currentStatus === "DELIVERED") {
        dynamicLogs.push({
          id: `${s.id}-transit`,
          icon: Truck,
          title: "Dispatched In-Transit",
          message: `Cargo payload ${shortTrack} cleared distribution hubs and is active on routes.`,
          time: "Active",
          color: "text-amber-400",
          bg: "bg-amber-500/10",
        });
      }

      // 4. Closed lifecycle log
      if (currentStatus === "DELIVERED") {
        dynamicLogs.push({
          id: `${s.id}-delivered`,
          icon: CheckCircle2,
          title: "Fulfillment Complete",
          message: `Lifecycle finalized for ${shortTrack}. CloudWatch verification metrics green.`,
          time: "Verified",
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        });
      }
    });

    // Take the 4 absolute newest logs and flip them so the freshest updates appear at the top
    return dynamicLogs.slice(-4).reverse();
  };

  const currentLogs = generateLiveLogs();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="card-premium hover-glow p-4 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Recent Activity</h3>
          <p className="section-subtitle">Live Event Stream (DB_POLL_ACTIVE)</p>
        </div>
        <span className="status-online" />
      </div>

      <div className="relative">
        {/* Dynamic vertical connection line logic */}
        {currentLogs.length > 0 && (
          <div className="absolute left-6 top-2 bottom-2 w-px bg-white/10" />
        )}

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {currentLogs.length === 0 ? (
              <div className="text-center text-slate-500 font-mono text-xs py-12">
                Awaiting shipment pipeline stream telemetry...
              </div>
            ) : (
              currentLogs.map((log) => {
                const Icon = log.icon;

                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    className="relative flex gap-4"
                  >
                    <div
                      className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${log.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${log.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-white truncate">
                          {log.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider shrink-0 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                          {log.time}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 mt-1 leading-relaxed truncate-2-lines">
                        {log.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      <button className="btn-secondary w-full mt-8 flex items-center justify-center gap-2">
        View Full Activity
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
