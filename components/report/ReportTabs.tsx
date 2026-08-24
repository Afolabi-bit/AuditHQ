"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Zap, HardDrive, Eye, ShieldCheck, Layers } from "lucide-react";
import { ParsedLighthouseReport, formatBytes } from "@/lib/report-parser";
import { OpportunitiesTab } from "./OpportunitiesTab";
import { NetworkPayloadTab } from "./NetworkPayloadTab";
import { AuditsListTab } from "./AuditsListTab";
import { SecurityTab } from "./SecurityTab";
import { DiagnosticsTab } from "./DiagnosticsTab";
import { DiagnosticItemDetail } from "./DiagnosticInspectorDrawer";

interface ReportTabsProps {
  report: ParsedLighthouseReport;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onInspectItem?: (item: DiagnosticItemDetail) => void;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  report,
  activeTab,
  onTabChange,
  onInspectItem,
}) => {
  const [internalTab, setInternalTab] = useState("opportunities");
  const currentTab = activeTab || internalTab;

  const handleTabChange = (val: string) => {
    setInternalTab(val);
    if (onTabChange) {
      onTabChange(val);
    }
  };

  const totalA11yAndSeo = report.accessibilityIssues.length + report.seoIssues.length;
  const securityWarnings = report.securityChecks.filter(
    (c) => c.score != null && c.score < 1
  );

  return (
    <section className="space-y-5 pt-2 w-full max-w-full min-w-0">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-6 w-full min-w-0"
      >
        <div className="border-b border-border pb-3 w-full overflow-x-auto">
          <TabsList className="bg-surface-1 p-1 rounded-xl border border-border h-auto gap-1 flex-wrap max-w-full">
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-4 py-2 rounded-lg font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              Opportunities
              {report.opportunities.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] score-badge-warn font-semibold">
                  {report.opportunities.length}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-4 py-2 rounded-lg font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <HardDrive className="h-3.5 w-3.5" />
              Network & Payload
              <span className="ml-1 text-[11px] text-text-tertiary">
                ({formatBytes(report.totalByteWeight)})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="audits"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-4 py-2 rounded-lg font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              Accessibility & SEO
              {totalA11yAndSeo > 0 ? (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] score-badge-poor font-semibold">
                  {totalA11yAndSeo}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-4 py-2 rounded-lg font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Security
              {securityWarnings.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] score-badge-warn font-semibold">
                  {securityWarnings.length}
                </span>
              ) : null}
            </TabsTrigger>

            <TabsTrigger
              value="diagnostics"
              className="data-[state=active]:bg-surface-0 data-[state=active]:text-brand-600 dark:data-[state=active]:text-brand-300 data-[state=active]:shadow-xs px-4 py-2 rounded-lg font-semibold text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              Diagnostics
              {report.diagnostics.length > 0 ? (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 font-semibold">
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
            onInspectItem={onInspectItem}
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
          <DiagnosticsTab
            diagnostics={report.diagnostics}
            onInspectItem={onInspectItem}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};
