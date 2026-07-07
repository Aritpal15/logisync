import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ShipmentTable({ shipments = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Function to handle network PATCH update requests cleanly
  const handleStatusChange = async (trackingNumber, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/shipments/${trackingNumber}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) throw new Error("Database transaction failed.");

      toast.success(
        `Track ${trackingNumber} shifted to ${newStatus.replace("_", " ")}`,
      );
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to alter tracking lifecycle status.");
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const tracking = s.tracking_number || "";
    const sender = s.sender_name || "";
    const matchesSearch =
      tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.toLowerCase().includes(searchTerm.toLowerCase());

    // Default dashboard view: Show everything EXCEPT things that have been delivered for a long time,
    // OR respect the explicit dropdown filter if they select "DELIVERED".
    if (statusFilter === "ALL") {
      return matchesSearch; // Currently shows everything, change to s.status !== "DELIVERED" if you want to hide them from the main list!
    }

    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="w-full bg-[#0e0e12] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Table Filter Top Bar Controls */}
      <div className="p-4 bg-zinc-900/20 border-b border-zinc-800/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search shipment..."
            className="w-full bg-[#141418]/90 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141418]/90 border border-zinc-800/80 rounded-xl px-3 py-2 text-xs font-bold text-zinc-400 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ORDER_CREATED">Order Created</option>
            <option value="PROCESSING">Processing</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-900/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <th className="w-[16%] px-6 py-3.5 pl-8">Tracking ID</th>
              <th className="w-[18%] px-6 py-3.5">Sender</th>
              <th className="w-[18%] px-6 py-3.5">Recipient</th>
              <th className="w-[14%] px-6 py-3.5">Destination</th>
              <th className="w-[20%] px-6 py-3.5 text-center">
                Status Control
              </th>{" "}
              {/* Increased width for dropdown box */}
              <th className="w-[14%] px-6 py-3.5 text-right pr-6">
                Updated
              </th>{" "}
              {/* Increased width for time */}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40 text-xs font-medium">
            {filteredShipments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-zinc-600 font-mono text-xs"
                >
                  No active server records stored in logisync.db file.
                </td>
              </tr>
            ) : (
              filteredShipments.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-zinc-900/10 transition-colors"
                >
                  <td className="px-6 py-4 pl-8 font-mono text-blue-400 font-bold tracking-tight truncate">
                    {s.tracking_number}
                  </td>
                  <td className="px-6 py-4 text-zinc-200 font-semibold truncate">
                    {s.sender_name}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-medium truncate">
                    {s.recipient_name}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-medium truncate">
                    {s.destination_address}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Dynamic dropdown style variant selectors mapping database states */}
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange(s.tracking_number, e.target.value)
                      }
                      className={`cursor-pointer inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold font-mono border focus:outline-none transition-all ${
                        s.status === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : s.status === "IN_TRANSIT"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : s.status === "ORDER_CREATED"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <option
                        value="ORDER_CREATED"
                        className="bg-[#121216] text-indigo-400 font-bold"
                      >
                        ORDER CREATED
                      </option>
                      <option
                        value="PROCESSING"
                        className="bg-[#121216] text-amber-400 font-bold"
                      >
                        PROCESSING
                      </option>
                      <option
                        value="IN_TRANSIT"
                        className="bg-[#121216] text-blue-400 font-bold"
                      >
                        IN TRANSIT
                      </option>
                      <option
                        value="DELIVERED"
                        className="bg-[#121216] text-emerald-400 font-bold"
                      >
                        DELIVERED
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right pr-6 text-zinc-500 font-medium whitespace-nowrap">
                    {s.created_at
                      ? new Date(s.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Just now"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
