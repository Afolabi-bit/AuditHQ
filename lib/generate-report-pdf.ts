/**
 * lib/generate-report-pdf.ts
 * Re-exports the public API from the pdf/ module.
 * Call sites import from this path — internal structure is an implementation detail.
 */
export { generateReportPDF } from "./pdf/index";
