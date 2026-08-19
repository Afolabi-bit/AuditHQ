"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Zap, HardDrive, Eye, ShieldCheck, Layers } from "lucide-react";
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
    <section className="space-y-4 pt-2 w-full max-w-full min-w-0">
      <Tabs defaultValue="opportunities" className="space-y-6 w-full min-w-0">
        <div className="border-b border-surface-3 pb-2 w-full overflow-x-auto">
          <TabsList className="bg-transparent p-0 h-auto gap-2 flex-wrap max-w-full">
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-brand px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <Zap className="h-4 w-4 fill-current" />
              Opportunities & Savings
              {report.opportunities.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-mono font-extrabold">
                  {report.opportunities.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-brand px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <HardDrive className="h-4 w-4" />
              Network & Payload
              <span className="ml-1 text-[11px] font-mono opacity-85">
                ({formatBytes(report.totalByteWeight)})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="audits"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-brand px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <Eye className="h-4 w-4" />
              Accessibility & SEO
              {(report.accessibilityIssues.length > 0 || report.seoIssues.length > 0) && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-surface-2 data-[state=active]:bg-white/20 text-text-primary data-[state=active]:text-white font-mono font-bold">
                  {report.accessibilityIssues.length + report.seoIssues.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-brand px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <ShieldCheck className="h-4 w-4" />
              Security & Best Practices
            </TabsTrigger>

            <TabsTrigger
              value="diagnostics"
              className="data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-brand px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <Layers className="h-4 w-4" />
              Diagnostics ({report.diagnostics.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <OpportunitiesTab
            opportunities={report.opportunities}
            diagnostics={report.diagnostics}
          />
        </TabsContent>

        {/* Tab 2: Network */}
        <TabsContent value="network" className="space-y-4">
          <NetworkPayloadTab
            resourceSummary={report.resourceSummary}
            totalByteWeight={report.totalByteWeight}
            thirdParties={report.thirdParties}
          />
        </TabsContent>

        {/* Tab 3: Audits Breakdown */}
        <TabsContent value="audits" className="space-y-4">
          <AuditsListTab
            accessibilityIssues={report.accessibilityIssues}
            seoIssues={report.seoIssues}
          />
        </TabsContent>

        {/* Tab 4: Security */}
        <TabsContent value="security" className="space-y-4">
          <SecurityTab securityChecks={report.securityChecks} />
        </TabsContent>

        {/* Tab 5: Full Diagnostics List */}
        <TabsContent value="diagnostics" className="space-y-4">
          <OpportunitiesTab
            opportunities={[]}
            diagnostics={report.diagnostics}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};
