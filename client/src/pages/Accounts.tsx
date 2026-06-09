import { useState, useEffect } from "react";
import { PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";
import toast from "react-hot-toast";
import api from "../api/axios";

const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccounts = async (
    isSync = false,
    platform?: string | null,
    successMsg?: string
  ) => {
    try{
      if(isSync){
        const label = platform? platform.charAt(0).toUpperCase() + platform.slice(1) :
        "social Media";
        toast.loading(`syncing ${label} account...`, {id:" sync"});
        await api.get("/api/oauth/sync");
        toast.success(successMsg || "Accounts synced!", {id: "sync"})
      }
      const { data } = await api.get("/api/accounts")
      setAccounts(data)
    }catch(error: any ){
      toast.error(error?.response?.data?.message || error?.message || "Failed to load accounts")

    } 
  }

  useEffect(() => {


   const params = new URLSearchParams(window.location.search);
   const connectedPlatform = params.get("connected");
   const connectedUsername = params.get("username");
   const syncNeeded = params.get("sync") === "true";
   const errorMsg = params.get("error");

   window.history.replaceState({}, document.title, window.location.pathname)
    
   if(connectedPlatform){
    const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
    const handle = connectedUsername ? `(@${connectedUsername})` : ""
    fetchAccounts(true, connectedPlatform, `${label}${handle} connected!`)
   }else if(errorMsg){
    toast.error(`connection failed: ${decodeURIComponent(errorMsg)}`)
    fetchAccounts();
   } else if(syncNeeded){
    fetchAccounts(true,null,"Accounts synced!")
   } else {
    fetchAccounts()
   }

  }, []);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const { data } = await api.get(`/api/oauth/${platformId}/url`);
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || `Failed to connect $ {platformId}`)
      setConnecting(null)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    try{
    await api.delete(`/api/accounts/${accountId}`)
    toast.success("Account disconnected")
    await fetchAccounts()
    }catch(error:any){
    toast.error(error?.response?.data?.message || error?.message || "Failed to disconnect account")
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Connected Accounts
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>

        <button
          onClick={() => setShowPlatformPicker(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <PlusIcon className="size-4" />
          Connect Account
        </button>
      </div>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <PlatformPickerModal
          connectedId={accounts.map((a) => a.platform)}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}

      {/* Connected Accounts List */}
      <AccountList
        accounts={accounts}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};

export default Accounts;