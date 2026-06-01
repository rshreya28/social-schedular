import {
  CheckCircleIcon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModalProps {
  connectedId: string[];
  connecting: string | null;
  onConnect: (platformId: string) => Promise<void>;
  onClose: () => void;
}

const PlatformPickerModal = ({
  connectedId,
  connecting,
  onConnect,
  onClose,
}: PlatformPickerModalProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">
            Choose a Platform
          </h3>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Platform List */}
        <div className="p-4 flex flex-col gap-2">
          {PLATFORMS.map((p) => {
            const isConnected = connectedId.includes(p.id);
            const isConnecting = connecting === p.id;

            return (
              <button
                key={p.id}
                onClick={() => !isConnected && onConnect(p.id)}
                disabled={isConnected || isConnecting}
                className={`flex items-center gap-3 p-3 rounded-lg border transition text-left disabled:cursor-not-allowed ${
                  isConnected
                    ? "border-red-200 bg-red-50 cursor-default"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
                } ${isConnecting ? "opacity-60" : ""}`}
              >
                {/* Icon */}
                <div className="p-2 rounded-lg bg-slate-100">
                  <p.icon
                    className={`size-5 ${
                      isConnected
                        ? "text-green-600"
                        : "text-slate-600"
                    }`}
                  />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      isConnected
                        ? "text-green-700"
                        : "text-slate-800"
                    }`}
                  >
                    {p.name}
                  </div>

                  <div className="text-xs text-slate-500 truncate">
                    {isConnected
                      ? "Already Connected"
                      : p.description}
                  </div>
                </div>

                {/* Status */}
                {isConnected && (
                  <CheckCircleIcon className="size-5 text-green-500 shrink-0" />
                )}

                {isConnecting && (
                  <div className="size-5 rounded-full border-2 border-red-600 border-t-transparent animate-spin shrink-0" />
                )}

                {!isConnected && !isConnecting && (
                  <ExternalLinkIcon className="size-4 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformPickerModal;