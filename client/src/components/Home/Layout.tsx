import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const pageTitle: Record<string, string> = {
  "/": "Dashboard",
  "/accounts": "Accounts",
  "/scheduler": "Scheduler",
  "/ai-composer": "AI Composer",
};

export default function Layout() {
   const {isAuthenticated, isLoading} = useAuth()
  const location = useLocation();

  const title = pageTitle[location.pathname] || "Dashboard";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if(isLoading){
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className='size-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin'/>
      </div>
    )
  }
  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 gap-4">
          
          <button
            className="md:hidden p-2 -ml-2 text-slate-500"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MenuIcon className="size-6" />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {title}
            </h1>

            <p className="text-sm text-slate-500">
              Manage and automate your social media posts
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}