"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Sparkles, HardDrive, Eye, ShieldCheck, Layers } from "lucide-react";
import { ParsedLighthouseReport, formatBytes } from "@/lib/report-parser";
import { OpportunitiesTab } from "./OpportunitiesTab";
import { NetworkPayloadTab } from "./NetworkPayloadTab";
import { AuditsListTab } from "./AuditsListTab";
import { SecurityTab } from "./SecurityTab";

interface ReportTabsProps {
  report: ParsedLighthouseReport;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ report }) => {
  return (
    <section className="space-y-4 pt-2">
      <Tabs defaultValue="opportunities" className="space-y-6">
        <div className="border-b border-slate-200">
          <TabsList className="bg-transparent p-0 h-auto gap-2 flex-wrap">
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Opportunities & Savings
              {report.opportunities.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-extrabold">
                  {report.opportunities.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            >
              <HardDrive className="h-4 w-4" />
              Network & Payload
              <span className="ml-1 text-[11px] opacity-80 font-normal">
                ({formatBytes(report.totalByteWeight)})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="audits"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Eye className="h-4 w-4" />
              Accessibility & SEO
              {(report.accessibilityIssues.length > 0 || report.seoIssues.length > 0) && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 data-[state=active]:bg-white/20 text-slate-800 data-[state=active]:text-white font-bold">
                  {report.accessibilityIssues.length + report.seoIssues.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              Security & Practices
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="opportunities" className="focus-visible:outline-hidden">
          <OpportunitiesTab
            opportunities={report.opportunities}
            diagnostics={report.diagnostics}
          />
        </TabsContent>

        <TabsContent value="network" className="focus-visible:outline-hidden">
          <NetworkPayloadTab
            resourceSummary={report.resourceSummary}
            totalByteWeight={report.totalByteWeight}
            thirdParties={report.thirdParties}
          />
        </TabsContent>

        <TabsContent value="audits" className="focus-visible:outline-hidden">
          <AuditsListTab
            accessibilityIssues={report.accessibilityIssues}
            seoIssues={report.seoIssues}
          />
        </TabsContent>

        <TabsContent value="security" className="focus-visible:outline-hidden">
          <SecurityTab securityChecks={report.securityChecks} />
        </TabsContent>
      </Tabs>
    </section>
  );
};
