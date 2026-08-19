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
        <div className="border-b border-[#e3e8ee] pb-2 w-full overflow-x-auto">
          <TabsList className="bg-[#f1f5f9] p-1 rounded-lg border border-[#e3e8ee] h-auto gap-1 flex-wrap max-w-full">
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Zap className="h-3.5 w-3.5 fill-[#635bff]" />
              Opportunities
              {report.opportunities.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#fff8e5] text-[#b76e00] font-mono font-bold border border-[#ffe380]">
                  {report.opportunities.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <HardDrive className="h-3.5 w-3.5" />
              Network & Payload
              <span className="ml-1 text-[11px] font-mono text-[#8898aa]">
                ({formatBytes(report.totalByteWeight)})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="audits"
              className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Eye className="h-3.5 w-3.5" />
              Accessibility & SEO
              {(report.accessibilityIssues.length > 0 || report.seoIssues.length > 0) && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#f0f2ff] text-[#635bff] font-mono font-bold border border-brand-200">
                  {report.accessibilityIssues.length + report.seoIssues.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Security
            </TabsTrigger>

            <TabsTrigger
              value="diagnostics"
              className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-xs px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Layers className="h-3.5 w-3.5" />
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
