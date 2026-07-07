import React, { useState } from "react";
import { Search, Check, AlertCircle } from "lucide-react";

export default function TrackingPortal({ shipments = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeShipment, setActiveShipment] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Core lookup logic searching the synchronized data array safely
  const handleTraceQuery = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !Array.isArray(shipments)) return;

    const matched = shipments.find(
      (s) =>
        s &&
        s.tracking_number &&
        s.tracking_number.trim().toUpperCase() ===
          searchQuery.trim().toUpperCase(),
    );

    setActiveShipment(matched || null);
    setHasSearched(true);
  };

  // Maps a status text keyword to true/false indicators for the progress markers safely
  const evaluateMilestoneState = (milestoneTitle) => {
    if (!activeShipment || !activeShipment.status) return false;
    const status = activeShipment.status.toUpperCase();

    switch (milestoneTitle) {
      case "ORDER_CREATED":
        return true;
      case "PROCESSING":
        return ["PROCESSING", "IN_TRANSIT", "DELIVERED"].includes(status);
      case "IN_TRANSIT":
        return ["IN_TRANSIT", "DELIVERED"].includes(status);
      case "DELIVERED":
        return status === "DELIVERED";
      default:
        return false;
    }
  };

  const steps = [
    {
      title: "ORDER_CREATED",
      desc: "Shipment details initialized and stored in local relational schema.",
      done: evaluateMilestoneState("ORDER_CREATED"),
    },
    {
      title: "PROCESSING",
      desc: "Route tracking matrix synchronized and queued inside active transaction pipeline.",
      done: evaluateMilestoneState("PROCESSING"),
    },
    {
      title: "IN_TRANSIT",
      desc: "Package processed and dispatched out of central carrier terminal hub.",
      done: evaluateMilestoneState("IN_TRANSIT"),
    },
    {
      title: "DELIVERED",
      desc: "Consignee signature confirmation logged at destination node address.",
      done: evaluateMilestoneState("DELIVERED"),
    },
  ];

  return (
    <div className="w-full h-full p-8 overflow-y-auto space-y-8 bg-[#070709]">
      {/* Section Title Banner */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">
          Customer Tracking Portal
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Public portal interface for comprehensive lifecycle visibility
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Inbound Search Bar Container */}
        <form
          onSubmit={handleTraceQuery}
          className="bg-[#0e0e12] border border-zinc-800/70 p-5 rounded-2xl shadow-xl flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter active Tracking ID (e.g., LS-9ECB10FC)"
              className="w-full bg-[#16161a] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/80 font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase tracking-wider px-5 rounded-xl transition-all"
          >
            Query Trace
          </button>
        </form>

        {/* Dynamic Condition Render block */}
        {hasSearched && !activeShipment && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-200 uppercase tracking-wide">
                Tracking Signature Unresolved
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-normal font-medium">
                The tracking matrix signature{" "}
                <span className="font-mono text-red-300">"{searchQuery}"</span>{" "}
                could not be resolved inside our active relational nodes. Check
                spelling parameters or request confirmation.
              </p>
            </div>
          </div>
        )}

        {/* Milestone Chronological Stepper */}
        {(!hasSearched || activeShipment) && (
          <div className="bg-[#0e0e12] border border-zinc-800/70 p-6 rounded-2xl shadow-xl">
            {activeShipment && (
              <div className="mb-6 pb-4 border-b border-zinc-800/60 flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">
                    Cargo Route
                  </span>
                  <span className="text-xs text-zinc-300 font-bold">
                    {activeShipment.sender_name || "N/A"} ➔{" "}
                    {activeShipment.destination_address || "N/A"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">
                    Core State
                  </span>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    {activeShipment.status || "UNKNOWN"}
                  </span>
                </div>
              </div>
            )}

            <div className="flow-root">
              <ul className="-mb-8">
                {steps.map((step, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== steps.length - 1 ? (
                        <span
                          className={`absolute top-4 left-4 -ml-px h-full w-0.5 transition-colors duration-300 ${
                            step.done && steps[idx + 1]?.done
                              ? "bg-blue-600"
                              : "bg-zinc-800/60"
                          }`}
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-4">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-[#0e0e12] font-mono text-xs font-bold transition-all duration-300 ${
                              step.done
                                ? step.title === "DELIVERED"
                                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                  : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-zinc-900/50 text-zinc-600 border border-zinc-800"
                            }`}
                          >
                            {step.done && step.title === "DELIVERED" ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              idx + 1
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <p
                            className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                              step.done ? "text-zinc-200" : "text-zinc-500"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-1 leading-normal font-medium tracking-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
