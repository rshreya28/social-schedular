import { useState, useEffect } from "react";
import { PLATFORMS, dummyAccountsData } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";

const Accounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccounts = async (
    isSync = false,
    platform?: string | null,
    successMsg?: string
  ) => {
    setAccounts(dummyAccountsData);

    console.log({
      isSync,
      platform,
      successMsg,
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);

    setTimeout(() => {
      setConnecting(null);

      const alreadyConnected = accounts.some(
        (account) => account.platform === platformId
      );

      if (alreadyConnected) {
        setShowPlatformPicker(false);
        return;
      }

      const platform = PLATFORMS.find(
        (p) => p.id === platformId
      );

      if (!platform) return;

      const newAccount = {
        _id: Date.now().toString(),
        platform: platformId,
        handle: `@${platform.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        status: "connected",
      };

      setAccounts((prevAccounts) => [
        ...prevAccounts,
        newAccount,
      ]);

      setShowPlatformPicker(false);
    }, 1000);
  };

  const handleDisconnect = async (accountId: string) => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter(
        (account) => account._id !== accountId
      )
    );
  };

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