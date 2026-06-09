import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
  LogOutIcon,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {


  const { logout, user } = useAuth();

  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard" },
    { name: "Accounts", icon: UsersIcon, path: "/accounts" },
    { name: "Scheduler", icon: CalendarDaysIcon, path: "/scheduler" },
    { name: "AI Composer", icon: SparklesIcon, path: "/ai-composer" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4
      transform transition-transform duration-300 ease-in-out
      md:static md:translate-x-0 md:relative flex flex-col
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >

      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="text-xl tracking-tight text-slate-800 flex items-center gap-1.5 font-semibold">
          <img src="/logo.svg" alt="Logo" className="size-6" />
          SchedulerAI
        </div>
      </div>

      {/* Navigation Title */}
      <div className="px-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
          Menu
        </span>
      </div>

      {/* Nav Links */}
      <nav className="mt-4 flex flex-col px-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-red-50 text-red-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute inset-y-0 left-0 w-1 bg-red-600 rounded-tr-md rounded-br-md" />
              )}

              {/* Icon */}
              <item.icon
                className={`size-5 shrink-0 ${
                  isActive ? "text-red-600" : "text-slate-500"
                }`}
              />

              {/* Text */}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">

          {/* Avatar */}
          <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
            {(user?.name?.charAt(0) ?? "U").toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {user?.name ?? "User"}
            </p>

            <p className="text-xs text-slate-500 truncate">
              {user?.email ?? ""}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            <LogOutIcon className="size-4" />
            Sign out
          </button>

        </div>
      </div>

    </div>
  );
};

export default Sidebar;