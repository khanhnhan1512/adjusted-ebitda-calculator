"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FIELDS,
  FIELD_GROUPS,
  calculateEbitda,
  formatCurrency,
  type EbitdaInputs,
  type Field,
  type FieldId,
} from "@/lib/ebitda";
import { ResultBreakdown, ResultSummary } from "./EbitdaResults";

const EMPTY_VALUES = Object.fromEntries(
  FIELDS.map((field) => [field.id, ""]),
) as Record<FieldId, string>;

/** Twelve digits is up to $999 billion — plenty, and keeps the field tidy. */
const MAX_DIGITS = 12;

function parseAmount(text: string): number {
  return Number(text.replace(/\D/g, "")) || 0;
}

function MoneyField({
  field,
  value,
  negative,
  onValueChange,
  onDirectionChange,
}: {
  field: Field;
  value: string;
  negative: boolean;
  onValueChange: (value: string) => void;
  onDirectionChange: (negative: boolean) => void;
}) {
  const hintId = `${field.id}-hint`;

  return (
    <div>
      <label htmlFor={field.id} className="font-semibold text-forest">
        {field.label}
      </label>
      <p id={hintId} className="mt-1 text-sm leading-relaxed text-charcoal/60">
        {field.description}
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {field.direction ? (
          <fieldset className="flex shrink-0 rounded-xl border border-line bg-bone p-1">
            <legend className="sr-only">{field.label}</legend>
            {[false, true].map((isNegative) => {
              const isSelected = negative === isNegative;
              return (
                <label
                  key={String(isNegative)}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal/40 sm:flex-none ${
                    isSelected
                      ? "bg-white text-forest shadow-[0_1px_3px_rgba(26,50,47,0.18)]"
                      : "text-charcoal/55 hover:text-forest"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${field.id}-direction`}
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => onDirectionChange(isNegative)}
                  />
                  {isNegative
                    ? field.direction!.negative
                    : field.direction!.positive}
                </label>
              );
            })}
          </fieldset>
        ) : null}

        <div className="flex flex-1 items-center rounded-xl border border-line bg-white transition focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/25">
          <span className="shrink-0 pl-4 text-lg font-bold whitespace-nowrap text-charcoal/40">
            {negative ? "−$" : "$"}
          </span>
          <input
            id={field.id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder="0"
            aria-describedby={hintId}
            className="w-full bg-transparent px-2 py-3 text-lg font-semibold text-forest outline-none placeholder:font-normal placeholder:text-charcoal/25"
          />
        </div>
      </div>
    </div>
  );
}

export function EbitdaCalculator() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [negatives, setNegatives] = useState<Partial<Record<FieldId, boolean>>>(
    {},
  );
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsInView, setResultsInView] = useState(false);

  const inputs = useMemo(
    () =>
      Object.fromEntries(
        FIELDS.map((field) => {
          const amount = parseAmount(values[field.id]);
          return [field.id, negatives[field.id] ? -amount : amount];
        }),
      ) as EbitdaInputs,
    [values, negatives],
  );

  const result = useMemo(() => calculateEbitda(inputs), [inputs]);
  // Net income is the starting point, so there is nothing to show without it.
  const hasResult = values.netIncome !== "";

  // On small screens the summary sits below the form; a bar keeps the figure
  // in view while typing, and steps aside once the summary itself is visible.
  useEffect(() => {
    const element = resultsRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setResultsInView(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function handleValueChange(id: FieldId, text: string) {
    const digits = text.replace(/\D/g, "").slice(0, MAX_DIGITS);
    setValues((current) => ({
      ...current,
      [id]: digits === "" ? "" : Number(digits).toLocaleString("en-CA"),
    }));
  }

  function handleDirectionChange(id: FieldId, negative: boolean) {
    setNegatives((current) => ({ ...current, [id]: negative }));
  }

  function handleClear() {
    setValues(EMPTY_VALUES);
    setNegatives({});
  }

  // Desktop: form and breakdown in the left column, with the summary sticking
  // beside both. Small screens stack them as form, summary, breakdown.
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-8">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="space-y-6 lg:col-start-1 lg:row-start-1"
        aria-label="Adjusted EBITDA inputs"
      >
        {FIELD_GROUPS.map((group, position) => (
          <section
            key={group.id}
            aria-labelledby={`${group.id}-title`}
            className="rounded-3xl border border-line bg-white p-6 sm:p-8"
          >
            <span aria-hidden="true" className="eyebrow text-teal">
              {String(position + 1).padStart(2, "0")}
            </span>
            <h2
              id={`${group.id}-title`}
              className="mt-2 text-xl font-bold text-forest sm:text-2xl"
            >
              {group.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              {group.description}
            </p>

            <div className="mt-7 space-y-7">
              {group.fields.map((field) => (
                <MoneyField
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  negative={negatives[field.id] ?? false}
                  onValueChange={(text) => handleValueChange(field.id, text)}
                  onDirectionChange={(negative) =>
                    handleDirectionChange(field.id, negative)
                  }
                />
              ))}
            </div>
          </section>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-charcoal/60 transition hover:text-teal"
          >
            Clear all figures
          </button>
        </div>
      </form>

      <div
        ref={resultsRef}
        id="results"
        className="scroll-mt-24 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
      >
        <ResultSummary result={hasResult ? result : null} />
      </div>

      {hasResult ? (
        <div className="lg:col-start-1 lg:row-start-2">
          <ResultBreakdown inputs={inputs} result={result} />
        </div>
      ) : null}

      {hasResult && !resultsInView ? (
        <a
          href="#results"
          className="no-print fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-white/10 bg-forest px-5 py-3 text-white shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.4)] lg:hidden"
        >
          <span>
            <span className="eyebrow block text-teal">Adjusted EBITDA</span>
            <span className="text-xl font-bold">
              {formatCurrency(result.adjustedEbitda)}
            </span>
          </span>
          <span className="text-sm font-semibold text-white/75">
            Details ↓
          </span>
        </a>
      ) : null}
    </div>
  );
}
