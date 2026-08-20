"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Zap, HardDrive, Eye, ShieldCheck, Layers } from "lucide-react";
import { ParsedLighthouseReport, formatBytes } from "@/lib/report-parser";
import { OpportunitiesTab } from "./OpportunitiesTab";
import { NetworkPayloadTab } from "./NetworkPayloadTab";
import { AuditsListTab } from "./AuditsListTab";
import { SecurityTab } from "./SecurityTab";
import { DiagnosticsTab } from "./DiagnosticsTab";

interface ReportTabsProps {
  report: ParsedLighthouseReport;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ report }) => {
  const totalA11yAndSeo = report.accessibilityIssues.length + report.seoIssues.length;
  const securityWarnings = report.securityChecks.filter(
    (c) => c.score != null && c.score < 1
  );

  return (
    <section className="space-y-4 pt-2 w-full max-w-full min-w-0">
      <Tabs defaultValue="opportunities" className="space-y-6 w-full min-w-0">
        <div className="border-b border-border pb-2 w-full overflow-x-auto">
          <TabsList className="bg-surface-1 p-1 rounded-lg border border-border h-auto gap-1 flex-wrap max-w-full">
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Zap className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
              Opportunities
              {report.opportunities.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#fff8e5] text-[#b76e00] font-mono font-bold border border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30">
                  {report.opportunities.length}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <HardDrive className="h-3.5 w-3.5" />
              Network & Payload
              <span className="ml-1 text-[11px] font-mono text-text-tertiary">
                ({formatBytes(report.totalByteWeight)})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="audits"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Eye className="h-3.5 w-3.5" />
              Accessibility & SEO
              {totalA11yAndSeo > 0 ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#ffebe6] text-[#de350b] font-mono font-bold border border-[#ffbdad] dark:bg-[#de350b]/15 dark:text-[#ff7452] dark:border-[#de350b]/30">
                  {totalA11yAndSeo}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Security
              {securityWarnings.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#fff8e5] text-[#b76e00] font-mono font-bold border border-[#ffe380] dark:bg-[#b76e00]/15 dark:text-[#ffc400] dark:border-[#b76e00]/30">
                  {securityWarnings.length}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="diagnostics"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-500 data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Layers className="h-3.5 w-3.5" />
              Diagnostics
              {report.diagnostics.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-brand-50 text-brand-500 font-mono font-bold border border-brand-200">
                  {report.diagnostics.length}
                </span>
              ) : null}
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
          <DiagnosticsTab diagnostics={report.diagnostics} />
        </TabsContent>
      </Tabs>
    </section>
  );
};
