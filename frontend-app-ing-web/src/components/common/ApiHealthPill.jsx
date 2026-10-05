import React, { useEffect, useState } from "react";
import healthApi from "../../api/healthApi";

export default function ApiHealthPill({ className = "" }) {
  const [status, setStatus] = useState("checking"); // checking, online, offline
  const [latency, setLatency] = useState(null);

  const check = async () => {
    const start = Date.now();
    try {
      const res = await healthApi.checkHealth();
      const elapsed = Date.now() - start;
      if (res && res.status === "OK") {
        setStatus("online");
        setLatency(elapsed);
      } else {
        setStatus("offline");
      }
    } catch {
      setStatus("offline");
    }
  };

  useEffect(() => {
    check();
    const timer = setInterval(check, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
        status === "online"
          ? "bg-[#ecfdf5] border border-[#10b981]/30 text-[#065f46]"
          : status === "checking"
          ? "bg-[#f2f3ff] border border-[#bccac0] text-[#3d4a42]"
          : "bg-[#fff1f2] border border-[#f43f5e]/40 text-[#9f1239]"
      } ${className}`}
      title={
        status === "online"
          ? `Servidor Spring Boot 3 Online (${latency || 15}ms)`
          : "Servidor no alcanzable en http://localhost:3000"
      }
    >
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status === "online"
              ? "bg-[#10b981]"
              : status === "checking"
              ? "bg-[#6d7a72]"
              : "bg-[#f43f5e]"
          }`}
        ></span>
      </span>
      <span>
        {status === "online"
          ? `API: ONLINE (Spring Boot 3)`
          : status === "checking"
          ? "Verificando..."
          : "API: DESCONECTADA"}
      </span>
      {latency && status === "online" && (
        <span className="text-[10px] opacity-75 hidden sm:inline">({latency}ms)</span>
      )}
    </div>
  );
}
