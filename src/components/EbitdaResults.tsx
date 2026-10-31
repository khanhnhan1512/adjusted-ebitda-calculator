"use client";

import { useState } from "react";
import {
  contribution,
  formatContribution,
  formatCurrency,
  formatPercent,
  getGroup,
  type EbitdaInputs,
  type EbitdaResult,
} from "@/lib/ebitda";

const EBITDA_GROUP = getGroup("ebitda");
const ADJUSTMENT_GROUP = getGroup("adjustments");

/**
 * The headline figures. Kept short enough to stay fully in view while it
 * sticks beside the form, however far down the form the user is.
 */
export function ResultSummary({ result }: { result: EbitdaResult | null }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!result) return;
    try {
      // Plain digits paste cleanly into the valuation calculator or a spreadsheet.
      await navigator.clipboard.writeText(
        String(Math.round(result.adjustedEbitda)),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the figure is still on screen to copy by hand.
    }
  }

  return (
    <div className="rounded-3xl bg-forest p-6 text-white shadow-[0_18px_60px_-30px_rgba(26,50,47,0.6)] sm:p-8">
      <p className="eyebrow text-teal">Your result</p>

      <p className="mt-5 text-sm font-semibold text-white/60">
        Adjusted EBITDA
      </p>
      {result ? (
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className="text-4xl font-bold tabular-nums">
            {formatCurrency(result.adjustedEbitda)}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold text-white/85 transition hover:border-teal hover:text-teal"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      ) : (
        <p className="mt-1 text-4xl font-bold text-white/25">$—</p>
      )}

      <div className="mt-6 border-t border-white/12 pt-5">
        <p className="text-sm font-semibold text-white/60">
          Adjusted EBITDA margin
        </p>
        <p className="mt-1 text-2xl font-bold text-teal tabular-nums">
          {result?.margin != null ? formatPercent(result.margin) : "—"}
        </p>
        {result && result.margin === null ? (
          <p className="mt-1 text-xs text-white/55">
            Add your revenue to see the margin.
          </p>
        ) : null}
      </div>

      {result ? (
        <dl className="mt-6 space-y-2 border-t border-white/12 pt-5 text-sm">
          <div className="flex justify-between gap-4 text-white/70">
            <dt>EBITDA</dt>
            <dd className="tabular-nums">{formatCurrency(result.ebitda)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-white/70">
            <dt>Normalization adjustments</dt>
            <dd className="tabular-nums">
              {formatContribution(result.adjustments)}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="mt-6 text-sm leading-relaxed text-white/70">
          Enter your net income to see your Adjusted EBITDA. It updates as you
          type.
        </p>
      )}

      {result && result.adjustedEbitda <= 0 ? (
        <p className="mt-6 rounded-xl bg-white/[0.07] p-4 text-sm leading-relaxed text-white/80">
          At or below zero, an earnings multiple will not give a meaningful
          valuation. A valuator can look at asset-based or revenue-based
          approaches instead.
        </p>
      ) : null}
    </div>
  );
}

function Line({
  label,
  value,
  total = false,
}: {
  label: string;
  value: string;
  total?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${
        total
          ? "border-t border-line pt-3 font-bold text-forest"
          : "text-charcoal/75"
      }`}
    >
      <dt>{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  );
}

/** Every line from net income to Adjusted EBITDA. */
export function ResultBreakdown({
  inputs,
  result,
}: {
  inputs: EbitdaInputs;
  result: EbitdaResult;
}) {
  return (
    <section
      aria-labelledby="breakdown-title"
      className="rounded-3xl border border-line bg-white p-6 sm:p-8"
    >
      <span className="eyebrow text-teal">Breakdown</span>
      <h2
        id="breakdown-title"
        className="mt-2 text-xl font-bold text-forest sm:text-2xl"
      >
        How we got there
      </h2>

      <dl className="mt-6 space-y-2.5">
        {EBITDA_GROUP.fields.map((field, position) => {
          const amount = contribution(field, inputs[field.id]);
          return (
            <Line
              key={field.id}
              label={field.shortLabel}
              value={
                // Net income is the starting figure, not an add-back.
                position === 0
                  ? formatCurrency(amount)
                  : formatContribution(amount)
              }
            />
          );
        })}
        <Line label="EBITDA" value={formatCurrency(result.ebitda)} total />
      </dl>

      <dl className="mt-6 space-y-2.5">
        {ADJUSTMENT_GROUP.fields.map((field) => (
          <Line
            key={field.id}
            label={field.shortLabel}
            value={formatContribution(contribution(field, inputs[field.id]))}
          />
        ))}
        <Line
          label="Adjusted EBITDA"
          value={formatCurrency(result.adjustedEbitda)}
          total
        />
      </dl>

      <p className="mt-6 text-xs leading-relaxed text-charcoal/50">
        Indicative only, based on the figures you entered.
      </p>
    </section>
  );
}
