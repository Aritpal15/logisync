import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Cpu,
  Database,
  Radio,
  Layers,
  ToggleLeft,
  ToggleRight,
  LineChart,
  Activity,
} from "lucide-react";

export default function SettingsPortal({ shipments = [] }) {
  const [workerSimulatedActive, setWorkerSimulatedActive] = useState(true);

  // Derive simple metrics from our shared shipments array for system telemetry
  const totalRecords = shipments.length;
  const pendingQueue = shipments.filter((s) => s.status !== "DELIVERED").length;

  return (
    <div className="w-full h-full p-8 overflow-y-auto space-y-8 bg-[#070709]">
      {/* Section Header Banner */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-500" /> System Settings & Admin
          Panel
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          DevOps environment control room and local cloud service infrastructure
          matrices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns - Configuration Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Module 1: Background Simulation Worker Control */}
          <div className="bg-[#0e0e12] border border-zinc-800/70 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                  Background Daemon Execution Loop
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                  Controls the simulated local Python polling process
                  (worker.py)
                </p>
              </div>
              <button
                onClick={() => setWorkerSimulatedActive(!workerSimulatedActive)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {workerSimulatedActive ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-zinc-700" />
                )}
              </button>
            </div>

            <div className="bg-[#16161a] border border-zinc-800/60 rounded-xl p-4 flex items-center justify-between font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${workerSimulatedActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                />
                <span className="text-zinc-400 font-bold">DAEMON_STATUS:</span>
                <span
                  className={
                    workerSimulatedActive
                      ? "text-emerald-400 font-bold"
                      : "text-red-400 font-bold"
                  }
                >
                  {workerSimulatedActive
                    ? "POLLING_ACTIVE_15S"
                    : "EXECUTION_HALTED"}
                </span>
              </div>
              <span className="text-zinc-600">PID: 84021</span>
            </div>
          </div>

          {/* Module 2: AWS Deployment Simulation Targets */}
          <div className="bg-[#0e0e12] border border-zinc-800/70 p-6 rounded-2xl shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                Target AWS Cloud Services Simulation
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                State definitions bound for next-stage cloud target execution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SQS Card */}
              <div className="bg-[#16161a] border border-zinc-800/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10">
                    READY
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-300">
                    Amazon SQS
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                    Message Queue Pipeline
                  </p>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 p-1.5 rounded border border-zinc-800/40">
                  Queue Length: {pendingQueue}
                </div>
              </div>

              {/* SNS Card */}
              <div className="bg-[#16161a] border border-zinc-800/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <Radio className="w-4 h-4 text-purple-500" />
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/10">
                    STDBY
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-300">
                    Amazon SNS
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                    Notification Broker
                  </p>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 p-1.5 rounded border border-zinc-800/40">
                  Endpoints: Email/SMS
                </div>
              </div>

              {/* CloudWatch Card */}
              <div className="bg-[#16161a] border border-zinc-800/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <LineChart className="w-4 h-4 text-cyan-500" />
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
                    STREAMING
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-300">
                    AWS CloudWatch
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                    Log Metric Aggregator
                  </p>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900/60 p-1.5 rounded border border-zinc-800/40">
                  Log Group: /logisync
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tech Stack Telemetry */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0e0e12] border border-zinc-800/70 p-6 rounded-2xl shadow-xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                Infrastructure Stack
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                Current local execution environment metrics
              </p>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              {/* Row 1 */}
              <div className="flex justify-between items-center p-2.5 rounded bg-[#16161a] border border-zinc-800/40">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>API_CORE</span>
                </div>
                <span className="text-zinc-200 font-bold">
                  FastAPI (Uvicorn:8000)
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-center p-2.5 rounded bg-[#16161a] border border-zinc-800/40">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DATABASE_RELATIONAL</span>
                </div>
                <span className="text-zinc-200 font-bold">
                  Amazon RDS (PostgreSQL)
                </span>
              </div>

              {/* Row 3 */}
              <div className="flex justify-between items-center p-2.5 rounded bg-[#16161a] border border-zinc-800/40">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DATA_VOLUME</span>
                </div>
                <span className="text-emerald-400 font-bold">
                  {totalRecords} Ingested Rows
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
