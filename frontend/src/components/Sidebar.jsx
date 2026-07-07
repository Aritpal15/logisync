import React from "react";
import {
  LayoutDashboard,
  PackagePlus,
  Search,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Create Shipment",
    icon: PackagePlus,
  },
  {
    name: "Tracking",
    icon: Search,
  },
  {
    name: "Reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen shrink-0 bg-[#0b1220]/90 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between">
      <div>
        <div className="px-6 py-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
            LS
          </div>

          <div>
            <h2 className="text-white font-bold text-lg">LogiSync</h2>

            <p className="text-xs text-slate-500">Logistics Control Tower</p>
          </div>
        </div>

        <div className="px-4 mt-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
                  item.active
                    ? "bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />

                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5">
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-white text-sm font-semibold">System Online</p>

              <p className="text-xs text-slate-500">Local Environment</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
