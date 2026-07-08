import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Archive,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function ReportsSection() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportFilter, setReportFilter] = useState("ALL");

  // 1. FETCH HISTORICAL LEDGER DATA DIRECTLY FROM THE FASTAPI BACKEND
  useEffect(() => {
    const fetchHistoricalLedger = async () => {
      try {
        const response = await fetch("/api/shipments");
        if (!response.ok) throw new Error("Network database request failed.");
        const data = (await response.ok) ? await response.json() : [];
        setShipments(data);
      } catch (error) {
        console.error("Error synchronizing history ledger:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalLedger();
    // Refresh history logs every 10 seconds to catch changes automatically
    const interval = setInterval(fetchHistoricalLedger, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. CALCULATE HISTORICAL PERFORMANCE INDICATORS
  const totalCreatedEver = shipments.length;
  const totalDeliveredEver = shipments.filter(
    (s) => s.status === "DELIVERED",
  ).length;

  const successRate =
    totalCreatedEver > 0
      ? Math.round((totalDeliveredEver / totalCreatedEver) * 100)
      : 0;

  const filteredHistory = shipments.filter((s) => {
    if (reportFilter === "ALL") return true;
    return s.status === reportFilter;
  });

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-zinc-500 font-mono text-xs">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        Synchronizing historical audit logs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/40 p-6 border border-zinc-800/60 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Operational Ledgers
            & Reports
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Review your complete historical database logs, compliance metrics,
            and delivery fulfillment logs.
          </p>
        </div>
        <button
          onClick={() => alert("Simulating CSV Report Export Sequence...")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> Export Ledger (.CSV)
        </button>
      </div>

      {/* Historical Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0e0e12] border border-zinc-800/70 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Gross Orders Ingested
            </p>
            <h3 className="text-2xl font-black text-white mt-2">
              {totalCreatedEver < 10
                ? `0${totalCreatedEver}`
                : totalCreatedEver}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800/30 border border-zinc-700/40 flex items-center justify-center text-zinc-400">
            <Archive className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0e12] border border-zinc-800/70 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Gross Completed Deliveries
            </p>
            <h3 className="text-2xl font-black text-emerald-400 mt-2">
              {totalDeliveredEver < 10
                ? `0${totalDeliveredEver}`
                : totalDeliveredEver}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0e0e12] border border-zinc-800/70 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Fulfillment Rate
            </p>
            <h3 className="text-2xl font-black text-blue-400 mt-2">
              {successRate}%
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Complete Historical Database Audit Log */}
      <div className="w-full bg-[#0e0e12] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-zinc-900/20 border-b border-zinc-800/60 flex justify-between items-center">
          <span className="text-xs font-bold text-zinc-300">
            Historical Audit Records
          </span>
          <select
            value={reportFilter}
            onChange={(e) => setReportFilter(e.target.value)}
            className="bg-[#141418]/90 border border-zinc-800/80 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-400 focus:outline-none"
          >
            <option value="ALL">Show All History</option>
            <option value="DELIVERED">Only Delivered</option>
            <option value="ORDER_CREATED">Only Created</option>
            <option value="PROCESSING">Only Processing</option>
            <option value="IN_TRANSIT">Only In Transit</option>
          </select>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
            <thead className="sticky top-0 bg-[#0e0e12] shadow-sm z-10">
              <tr className="border-b border-zinc-800/80 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <th className="w-[25%] px-6 py-3 pl-8">Tracking ID</th>
                <th className="w-[25%] px-6 py-3">Sender Name</th>
                <th className="w-[30%] px-6 py-3">Final Destination</th>
                <th className="w-[20%] px-6 py-3 text-right pr-8">
                  Fulfillment Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30 text-xs font-medium text-zinc-400">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-zinc-600 font-mono"
                  >
                    No matching archived logs inside the db file context.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((s, index) => (
                  <motion.tr
                    key={s.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-zinc-900/10 transition-colors"
                  >
                    <td className="px-6 py-3.5 pl-8 font-mono text-zinc-500 text-[11px] truncate">
                      {s.tracking_number}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-300 font-semibold truncate">
                      {s.sender_name}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-400 truncate">
                      {s.destination_address}
                    </td>
                    <td className="px-6 py-3.5 text-right pr-8">
                      <span
                        className={`inline-block text-[9px] font-bold font-mono uppercase border px-2 py-0.5 rounded ${
                          s.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : s.status === "IN_TRANSIT"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : s.status === "ORDER_CREATED"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
