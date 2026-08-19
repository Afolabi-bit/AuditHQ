import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const Welcome = ({ user }: { user: KindeUser }) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight font-sans">
          Welcome back, {user?.given_name || "Developer"}
        </h1>
        <p className="text-sm text-[#425466]">
          Autonomous Lighthouse audits, Core Web Vitals diagnostics, and continuous performance telemetry.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e3e8ee] text-xs font-mono text-[#425466] self-start sm:self-auto shadow-xs">
        <span className="flex h-2 w-2 rounded-full bg-[#00875a]" />
        <span className="text-[#8898aa]">Engine Cluster:</span>
        <span className="text-[#00875a] font-bold">Operational</span>
      </div>
    </div>
  );
};

export default Welcome;
