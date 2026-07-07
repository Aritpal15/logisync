/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PackagePlus,
  Search,
  BarChart3,
  Settings,
  Bell,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle,
  Server,
} from "lucide-react";
import DashboardContainer from "./components/dashboard/DashboardContainer";
import DispatchDesk from "./components/DispatchDesk";
import TrackingPortal from "./components/TrackingPortal";
import { Toaster } from "react-hot-toast";
import ReportsSection from "./components/dashboard/ReportsSection";
import SettingsPortal from "./components/Settings";

const navigation = [
  { id: "dashboard", name: "Main Dashboard", icon: LayoutDashboard },
  { id: "dispatch", name: "Dispatch Desk", icon: PackagePlus },
  { id: "tracking", name: "Tracking Portal", icon: Search },
  { id: "analytics", name: "Analytics & Reports", icon: BarChart3 },
  { id: "settings", name: "System Settings", icon: Settings },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [shipments, setShipments] = useState([]);

  // UI Dropdown Toggles
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);

  // Refs for handling clicks outside the menus to close them gracefully
  const notoRef = useRef(null);
  const adminRef = useRef(null);

  const fetchGlobalData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/shipments");
      if (response.ok) {
        const data = await response.json();
        setShipments(data);
      }
    } catch (error) {
      console.error("Data synchronization failure:", error);
    }
  };

  useEffect(() => {
    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close menus if clicking outside of them
  useEffect(() => {
    function handleClickOutside(event) {
      if (notoRef.current && !notoRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setShowAdminProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter recent meaningful system logs for notifications panel
  const systemAlerts = shipments
    .filter((s) => s.status === "DELIVERED" || s.status === "IN_TRANSIT")
    .map((s) => ({
      id: s.id,
      tracking: s.tracking_number,
      title:
        s.status === "DELIVERED" ? "Delivery Finalized" : "Package Dispatched",
      desc:
        s.status === "DELIVERED"
          ? `Cargo arrived at destination.`
          : `Route optimized for dispatch.`,
      color:
        s.status === "DELIVERED"
          ? "text-emerald-400 bg-emerald-500/10"
          : "text-amber-400 bg-amber-500/10",
      icon: s.status === "DELIVERED" ? CheckCircle : Clock,
    }))
    .slice(-3); // Cap it at the 3 newest operational changes

  return (
    <div className="flex h-screen bg-[#070709] text-zinc-100 font-sans antialiased overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#121216",
            color: "#f4f4f5",
            border: "1px solid #27272a",
          },
        }}
      />

      {/* Premium Sidebar Rail */}
      <aside className="w-64 bg-[#0c0c0e] border-r border-zinc-800/60 flex flex-col justify-between py-6 z-20 shrink-0">
        <div>
          {/* Brand Identity */}
          <div className="px-6 mb-9 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-500/20 tracking-wider">
              LS
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                LogiSync
              </span>
              <span className="block text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Control System
              </span>
            </div>
          </div>

          {/* Navigation Matrix */}
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border-l-2 border-blue-500 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
                  />
                  <span
                    className={`transition-colors duration-300 ${isActive ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-200"}`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Connection Footprint */}
        <div className="px-4">
          <div className="bg-[#121216]/60 border border-zinc-800/50 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-300 block">
                System Secure
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">
                DB_LOCAL_ACTIVE
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Dynamic Main App Window Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#070709] via-[#0d0d11] to-[#070709] overflow-hidden">
        {/* Global Operational Header Grid */}
        <header className="h-16 border-b border-zinc-800/40 px-8 flex items-center justify-between shrink-0 bg-[#070709]/30 backdrop-blur-md z-30 relative">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
              Environment: Local-Dev
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Interactive Notification Bell Module */}
            <div className="relative" ref={notoRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl border transition-all relative ${
                  showNotifications
                    ? "text-blue-400 bg-zinc-900 border-zinc-800"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent hover:border-zinc-800/60"
                }`}
              >
                <Bell className="w-4 h-4" />
                {systemAlerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-[#0e0e12] border border-zinc-800/80 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                      <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                        System Telemetry Logs
                      </h3>
                      <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold font-mono">
                        LIVE
                      </span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {systemAlerts.length === 0 ? (
                        <p className="text-zinc-600 text-center py-6 text-[11px] font-mono">
                          No recent tracking updates queued.
                        </p>
                      ) : (
                        systemAlerts.map((alert) => {
                          const AlertIcon = alert.icon;
                          return (
                            <div
                              key={alert.id}
                              className="p-2 bg-[#16161a] border border-zinc-800/50 rounded-xl flex gap-3 items-start"
                            >
                              <div
                                className={`p-1.5 rounded-lg shrink-0 ${alert.color}`}
                              >
                                <AlertIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-zinc-200 truncate">
                                  {alert.title}
                                </h4>
                                <p className="text-[10px] text-zinc-500 mt-0.5 truncate font-mono">
                                  {alert.tracking}
                                </p>
                                <p className="text-[11px] text-zinc-400 mt-1 leading-tight">
                                  {alert.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-zinc-800" />

            {/* Interactive Admin Profile Panel */}
            <div className="relative" ref={adminRef}>
              <div
                onClick={() => setShowAdminProfile(!showAdminProfile)}
                className="flex items-center gap-2 cursor-pointer group bg-zinc-900/40 hover:bg-zinc-900 p-1.5 pr-3 rounded-xl border border-zinc-800/30 hover:border-zinc-800/80 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-zinc-700 to-zinc-800 border border-zinc-600 flex items-center justify-center font-bold text-xs text-zinc-300 font-mono">
                  AD
                </div>
                <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  Admin Panel
                </span>
              </div>

              <AnimatePresence>
                {showAdminProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-[#0e0e12] border border-zinc-800/80 rounded-2xl p-4 shadow-2xl z-50 space-y-4"
                  >
                    <div className="font-mono">
                      <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">
                        Active Supervisor
                      </span>
                      <span className="text-xs font-bold text-zinc-200">
                        Arit Pal
                      </span>
                    </div>

                    <div className="border-t border-zinc-800/60 pt-3 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-blue-400" />{" "}
                          Total Ledger
                        </span>
                        <span className="text-zinc-200 font-bold">
                          {shipments.length} rows
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Server className="w-3.5 h-3.5 text-cyan-400" /> Local
                          Host
                        </span>
                        <span className="text-zinc-200 font-bold">
                          127.0.0.1
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content View Injection Node */}
        <div className="flex-1 overflow-hidden relative p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full overflow-y-auto"
            >
              {activeTab === "dashboard" && (
                <DashboardContainer shipments={shipments} />
              )}
              {activeTab === "dispatch" && <DispatchDesk />}
              {activeTab === "tracking" && (
                <TrackingPortal shipments={shipments} />
              )}
              {activeTab === "analytics" && <ReportsSection />}
              {activeTab === "settings" && (
                <SettingsPortal shipments={shipments} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
