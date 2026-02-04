import { createContext, useContext, useState, useCallback } from "react";

const MessageContext = createContext(null);

export function MessageProvider({ children }) {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("error");

  const showMessage = useCallback((msg, msgType = "error", timeout = 3000) => {
    setMessage(msg);
    setType(msgType);

    if (timeout) {
      setTimeout(() => {
        setMessage(null);
      }, timeout);
    }
  }, []);

  const clearMessage = () => setMessage(null);

  return (
    <MessageContext.Provider
      value={{ message, type, showMessage, clearMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error("useMessage must be used inside MessageProvider");
  }
  return ctx;
}