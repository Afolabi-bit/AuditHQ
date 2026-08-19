import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, BarChart3, Shield, Clock, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import {
  KindeUser,
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs";
import getSessionUser from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = (await getSessionUser()) as KindeUser | null;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AuditHQ
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                How It Works
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Docs
              </a>
            </div>

            <div className="flex items-center sm:space-x-4">
              <LoginLink
                className={`text-gray-600 ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                Log In
              </LoginLink>
              <RegisterLink
                className={`hidden sm:inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700`}
              >
                Sign Up Free
              </RegisterLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1">
            <Zap className="h-3 w-3 inline mr-2" />
            Lightning-fast performance testing
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block text-gray-900">{`Measure Your Website's`}</span>
            <span className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Performance in Seconds
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get comprehensive Lighthouse-powered performance reports for your
            websites. Track Core Web Vitals, identify bottlenecks, and optimize
            your user experience with actionable insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href={"/login"}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md has-[>svg]:px-4 text-white bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              Start Testing Free
              <Zap className="ml-2 h-5 w-5" />
            </Link>

            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Swift result report</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need to Optimize
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive performance testing tools built for developers and
              businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-light-text ">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-600">
                  Get instant performance metrics including FCP, LCP, TTI, and
                  CLS. Track your Core Web Vitals with precision.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold">Historical Tracking</h3>
                <p className="text-gray-600">
                  Monitor performance trends over time. Identify improvements
                  and regressions with comprehensive historical data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-gray-600">
                  Your test data is encrypted and private. Only you can access
                  your performance reports and metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Lighthouse Powered</h3>
                <p className="text-gray-600">
                  {`Built on Google's industry-standard Lighthouse engine for 
                  accurate and reliable performance testing.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold">Network Simulation</h3>
                <p className="text-gray-600">
                  Test under various network conditions including 3G, 4G, and
                  desktop connections for real-world insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold">Team Collaboration</h3>
                <p className="text-gray-600">
                  Share reports with your team, compare results, and work
                  together to optimize your web applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive performance insights in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold">Enter Your URL</h3>
              <p className="text-gray-600">
                Simply paste your website URL and choose your testing
                preferences - desktop or mobile, network conditions, and more.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold">We Analyze</h3>
              <p className="text-gray-600">
                Our Lighthouse-powered engine runs comprehensive tests,
                measuring load times, Core Web Vitals, and user experience
                metrics.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold">Get Insights</h3>
              <p className="text-gray-600">
                {`Receive detailed reports with actionable recommendations to 
                improve your website's performance and user experience.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Optimize Your Website?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of developers using AuditHQ to build faster, better web
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href={"/login"}
              className="text-lg px-8 py-6 h-10 rounded-md  has-[>svg]:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white font-medium transition-all disabled:pointer-events-none disabled:opacity-50"
            >
              Start Free Trial
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white/10"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-blue-100">
            Free forever. No credit card required. Upgrade anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">AuditHQ</span>
              </div>
              <p className="text-sm text-gray-400">
                Performance testing made simple. Build faster websites with
                confidence.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 AuditHQ. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
