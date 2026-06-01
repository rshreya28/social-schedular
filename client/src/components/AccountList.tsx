import {
  PlusIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UnplugIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface AccountListProps {
  accounts: any[];
  onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({ accounts, onDisconnect }: AccountListProps) => {
  const handleDisconnect = async (accountId: string) => {
    const confirmDisconnect = window.confirm(
      "Are you sure you want to disconnect this account?"
    );

    if (!confirmDisconnect) return;

    await onDisconnect(accountId);
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center py-20 px-6">
        <div className="bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
          <PlusIcon className="size-6 text-slate-500 opacity-50" />
        </div>

        <p className="text-slate-700 text-lg mt-4">
          No accounts connected yet.
        </p>

        <p className="text-sm text-slate-400 mt-2 max-w-xs text-center">
          Connect your first social platform to start scheduling and
          automating your content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account, index) => {
       const meta = PLATFORMS.find(
  (p) =>
    p.id?.toLowerCase() ===
    account.platform?.toLowerCase()
);
        if (!meta) {
          return (
            <div
              key={index}
              className="bg-red-100 border border-red-300 rounded-xl p-4"
            >
              <p className="text-red-600 font-medium">
                Platform not found
              </p>
              <p className="text-sm text-red-500">
                {account.platform}
              </p>
            </div>
          );
        }

        return (
          <div
            key={account._id || index}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="shrink-0 flex items-center justify-center bg-slate-50 rounded-xl p-3">
                <meta.icon className="size-6" />
              </div>

              <div className="min-w-0 flex-1"  >
                <div className="font-medium text-slate-900 truncate">
                  {account.handle}
                </div>

                <div className="text-sm text-slate-500">
                  {meta.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {account.status === "connected" ? (
                <>
                  <CheckCircleIcon className="size-5 text-green-500" />
                  <span className="text-xs text-green-600">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <AlertCircleIcon className="size-5 text-amber-500" />
                  <span className="text-xs text-red-500">
                    Disconnected
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => handleDisconnect(account._id)}
              title="Disconnect Account"
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <UnplugIcon className="size-4" />
              Disconnect
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AccountList;