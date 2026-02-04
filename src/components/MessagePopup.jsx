import clsx from "clsx";
import { useMessage } from "./MessageContext";

export default function MessagePopup() {
  const { message, type, clearMessage } = useMessage();

  if (!message) return null;

  const styles = {
    error: "text-red-100 bg-red-500/90 border-red-500/40",
    success: "text-green-100 bg-green-500/90 border-green-500/40",
    warning: "text-yellow-100 bg-yellow-500/90 border-yellow-500/40",
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={clsx(
          "flex items-start gap-3 text-sm border px-4 py-3 rounded-xl shadow-xl backdrop-blur-md animate-slide-in",
          styles[type]
        )}
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={clearMessage}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}