import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const Welcome = ({ user }: { user: KindeUser }) => {
  return (
    <div className="space-y-1.5 pb-1 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight font-sans">
        Welcome back, {user?.given_name || "Developer"}
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-normal">
        Autonomous Lighthouse cloud audits, Core Web Vitals diagnostics, and continuous performance telemetry across devices.
      </p>
    </div>
  );
};

export default Welcome;
