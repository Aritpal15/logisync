/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { PackagePlus, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DispatchDesk() {
  const [formData, setFormData] = useState({
    sender_name: "",
    recipient_name: "",
    destination_address: "",
    weight: "",
    customer_email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified event handler to sync input typing into React state dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Connects directly to your local FastAPI server ingestion endpoint
      const response = await fetch("http://localhost:8080/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_name: formData.sender_name,
          recipient_name: formData.recipient_name,
          destination_address: formData.destination_address,
          weight: parseFloat(formData.weight),
          customer_email: formData.customer_email,
        }),
      });

      if (!response.ok) {
        throw new Error("Ingestion node rejected the manifest payload.");
      }

      const data = await response.json();

      // Flash enterprise-ready feedback directly to the screen layout
      toast.success(
        `Shipment Registered! Tracking ID: ${data.tracking_number || "LS-LOGISYNC"}`,
      );

      // Wipe the form inputs clean after successful database entry pipeline
      setFormData({
        sender_name: "",
        recipient_name: "",
        destination_address: "",
        weight: "",
        customer_email: "",
      });
    } catch (error) {
      console.error("Transmission error:", error);
      toast.error(
        "Failed to commit manifest payload. Is the FastAPI backend offline?",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto space-y-8 bg-[#070709]">
      {/* Structural Module Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          CREATE SHIPMENT
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Inbound logistics manifest serialization entry gateway
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Inbound Submission Form */}
        <div className="lg:col-span-2 bg-[#0e0e12] border border-zinc-800/70 p-6 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Sender Corporate Title
                </label>
                <input
                  type="text"
                  name="sender_name"
                  required
                  value={formData.sender_name}
                  onChange={handleChange}
                  placeholder="e.g., Apex Logistics Ltd"
                  className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/80 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Recipient Corporate Title
                </label>
                <input
                  type="text"
                  name="recipient_name"
                  required
                  value={formData.recipient_name}
                  onChange={handleChange}
                  placeholder="e.g., Nexa Distribution Hub"
                  className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/80 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Delivery Destination Address
              </label>
              <input
                type="text"
                name="destination_address"
                required
                value={formData.destination_address}
                onChange={handleChange}
                placeholder="e.g., Plot 24B, Electronic City Phase 1, Bengaluru"
                className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/80 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Cargo Weight Mass (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.01"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/80 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Customer Operational Contact Email
                </label>
                <input
                  type="email"
                  name="customer_email"
                  required
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="e.g., operations@clientdomain.com"
                  className="w-full bg-[#16161a] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/80 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/40">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <PackagePlus className="w-4 h-4" />
                {isSubmitting
                  ? "Processing Transmission..."
                  : "Confirm & Ingest Shipment"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Content Instruction Card */}
        <div className="bg-[#0e0e12] border border-zinc-800/70 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex gap-2 items-center text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Asynchronous Processing Notice
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            Submitting this record pushes payload vectors straight into the
            ingestion cluster. The sequence handles validation locally before
            queuing tracking logs for worker lifecycle pickup.
          </p>
        </div>
      </div>
    </div>
  );
}
