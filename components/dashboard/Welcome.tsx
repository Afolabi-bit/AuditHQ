import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const Welcome = ({ user }: { user: KindeUser }) => {
  return (
    <div className="space-y-3 pb-1 max-w-3xl">
      {/* Landing page style capsule badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-text-secondary bg-surface-0/60 dark:bg-white/[0.04] border border-border/60 backdrop-blur-md shadow-2xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-text-primary/90 font-medium">Telemetry pipeline active</span>
        <span className="text-border dark:text-white/20">·</span>
        <span className="text-text-tertiary">Lighthouse 12.0</span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight font-display text-balance">
        Welcome back, <span className="text-brand-600 dark:text-brand-400">{user?.given_name || "Developer"}</span>
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal text-pretty max-w-2xl">
        Run deterministic Lighthouse audits in isolated containers, track Core Web Vitals trajectory, and diagnose performance regressions with AI.
      </p>
    </div>
  );
};

export default Welcome;
