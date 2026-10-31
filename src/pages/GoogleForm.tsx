import React from 'react';
import { ExternalLink, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';

export const GoogleForm: React.FC = () => {
  const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL || '';

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="border-b border-line/60 pb-6 space-y-2">
        <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-brick-bright">
          Centralized Data Collection
        </span>
        <h1 className="font-anton text-4xl sm:text-5xl uppercase tracking-tight text-paper">
          Google Forms Integration
        </h1>
        <p className="font-body text-xs sm:text-sm text-muted max-w-xl">
          Instructions and access point for official university or batch committee centralized order sheets.
        </p>
      </div>

      {/* Critical Workflow Explanation Card (Section 8 requirement) */}
      <div className="bg-ink-2 border border-line p-6 rounded-xs space-y-5">
        <div className="flex items-start gap-3.5">
          <HelpCircle size={22} className="text-brick-bright shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h2 className="font-anton text-xl uppercase tracking-wide text-paper">
              How the Order Flow Works
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted leading-relaxed">
              Submitting the website&apos;s local order form stores your order in your device&apos;s local storage and generates a unique, sequential order number (e.g., <strong className="text-paper">CUET-0001</strong>).
            </p>
          </div>
        </div>

        <div className="bg-[#1C1613] border border-brick-bright/40 p-4 rounded-xs text-xs font-body text-paper/90 space-y-2 leading-relaxed">
          <strong className="text-brick-bright uppercase tracking-wider block font-bold">
            Important Note on Centralized Submission:
          </strong>
          Because this is a serverless static frontend application, submitting the checkout form on this website does <strong>not automatically transmit your data to Google Forms</strong>.
          If your batch representatives or campus merchandise committee requests centralized recordkeeping in Google Sheets, please click the button below to submit your details to the official Google Form as well.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body pt-2">
          <div className="bg-ink-3 p-4 rounded-xs border border-line/50 space-y-1">
            <div className="font-bold text-paper flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <FileCheck size={14} className="text-emerald-400" />
              1. Website Order Form
            </div>
            <p className="text-muted leading-relaxed">
              Provides visual product selection, interactive sizing, instant price calculation, bKash TrxID verification, and sequential order number generation.
            </p>
          </div>

          <div className="bg-ink-3 p-4 rounded-xs border border-line/50 space-y-1">
            <div className="font-bold text-paper flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ExternalLink size={14} className="text-brick-bright" />
              2. Google Form Submission
            </div>
            <p className="text-muted leading-relaxed">
              Aggregates all student orders into a shared Google Sheet accessible to the central campus distribution committee for batch packaging and hall delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Google Form Action / Embed Section */}
      {googleFormUrl ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ink-2 p-6 border border-line rounded-xs">
            <div>
              <h3 className="font-anton text-xl uppercase text-paper tracking-wide">
                Official Pre-Order Google Form
              </h3>
              <p className="font-body text-xs text-muted">
                Click below to open the form in a new tab or complete it embedded directly on this page.
              </p>
            </div>
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Embedded Form View */}
          <div className="border border-line rounded-xs overflow-hidden bg-white">
            <iframe
              src={googleFormUrl}
              width="100%"
              height="800"
              title="CUET Hoodie Google Form"
              className="w-full border-0"
            >
              Loading Google Form...
            </iframe>
          </div>
        </div>
      ) : (
        <div className="bg-ink-2 border border-line p-8 rounded-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-ink-3 border border-line flex items-center justify-center text-brick-bright mx-auto">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-anton text-xl uppercase text-paper">
              Google Form URL Configurable Placeholder
            </h3>
            <p className="font-body text-xs text-muted max-w-md mx-auto">
              The Google Form link will be supplied by your organizing committee. Once provided, specify it in your <code className="text-paper bg-ink px-1.5 py-0.5 border border-line">.env</code> file under <code className="text-brick-bright">VITE_GOOGLE_FORM_URL</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleForm;
