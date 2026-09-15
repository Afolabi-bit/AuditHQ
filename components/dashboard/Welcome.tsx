import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const Welcome = ({ user }: { user: KindeUser }) => {
  return (
    <div className="space-y-2 pb-1 max-w-3xl">
      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono text-text-secondary bg-surface-1 border border-border">
        <span className="w-1.5 h-1.5 rounded-full bg-score-good animate-pulse" />
        <span>Runner status: Standby</span>
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight font-display">
        Welcome back, {user?.given_name || "Developer"}
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal">
        Autonomous cloud audits, Core Web Vitals diagnostics, and continuous performance telemetry.
      </p>
    </div>
  );
};

export default Welcome;
