import React from "react";
import { motion } from "framer-motion";
import { Activity, CalendarDays } from "lucide-react";

export default function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
    >
      <div>
        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
          Operations Center
        </span>

        <h1 className="mt-2 text-5xl font-black tracking-tight text-white">
          Control Tower
        </h1>

        <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
          Monitor shipments, queue processing, live operations and delivery
          progress from a single unified dashboard.
        </p>
      </div>

      <div className="glass card-premium px-5 py-3 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              System Status
            </p>
            <p className="text-sm font-semibold text-emerald-400">
              Operational
            </p>
          </div>
        </div>

        <div className="w-px h-10 bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <CalendarDays className="w-5 h-5 text-blue-400" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Environment
            </p>
            <p className="text-sm font-semibold text-white">
              Local Development
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
