import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const Welcome = ({ user }: { user: KindeUser }) => {
  return (
    <div className="mb-7 space-y-1">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-sans">
        Welcome back, {user?.given_name || "Developer"}
      </h1>
      <p className="text-sm text-text-secondary">
        Autonomous Lighthouse audits, Core Web Vitals, and continuous performance analytics
      </p>
    </div>
  );
};

export default Welcome;
