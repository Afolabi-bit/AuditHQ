import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const Welcome = ({ user }: { user: KindeUser }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div className="space-y-2 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight font-sans">
          Welcome back, {user?.given_name || "Developer"}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
          Autonomous Lighthouse cloud audits, Core Web Vitals diagnostics, and continuous performance telemetry across devices.
        </p>
      </div>

      <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-surface-0 border border-border text-xs font-mono text-text-secondary self-start md:self-auto shadow-2xs">
        <span className="flex h-2.5 w-2.5 rounded-full bg-score-good animate-pulse" />
        <span className="text-text-tertiary">Engine Cluster:</span>
        <span className="text-score-good font-bold">Operational (v12.0)</span>
      </div>
    </div>
  );
};

export default Welcome;
