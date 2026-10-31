/**
 * Adjusted EBITDA — ported from the original Base44 calculator.
 *
 *   EBITDA          = net income + interest + taxes + depreciation + amortization
 *   Adjusted EBITDA = EBITDA
 *                     + one-time expenses − one-time income
 *                     + discretionary expenses
 *                     ± owner compensation above / below market
 *                     ± rent above / below market
 *   Margin          = Adjusted EBITDA ÷ revenue
 *
 * The Base44 version stripped minus signs from every field, so a loss or a
 * below-market salary or rent could not be entered. Here those three fields
 * carry an explicit direction instead.
 */

export type FieldId =
  | "revenue"
  | "netIncome"
  | "interest"
  | "taxes"
  | "depreciation"
  | "amortization"
  | "oneTimeExpense"
  | "oneTimeIncome"
  | "discretionaryExpense"
  | "ownerCompensation"
  | "rent";

export interface Direction {
  /** Label for the case that increases EBITDA. */
  positive: string;
  /** Label for the case that decreases EBITDA. */
  negative: string;
}

export interface Field {
  id: FieldId;
  label: string;
  /** Short name used in the results breakdown. */
  shortLabel: string;
  description: string;
  /** Deducted from EBITDA rather than added back. */
  subtract?: boolean;
  /** The amount can go either way; the user picks which. */
  direction?: Direction;
}

export type GroupId = "revenue" | "ebitda" | "adjustments";

export interface FieldGroup {
  id: GroupId;
  title: string;
  description: string;
  fields: Field[];
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    id: "revenue",
    title: "Revenue",
    description: "Used to work out your Adjusted EBITDA margin.",
    fields: [
      {
        id: "revenue",
        label: "Revenue",
        shortLabel: "Revenue",
        description: "Total revenue for the year.",
      },
    ],
  },
  {
    id: "ebitda",
    title: "From net income to EBITDA",
    description:
      "Start from the bottom line and add back financing, tax and non-cash charges.",
    fields: [
      {
        id: "netIncome",
        label: "Net income",
        shortLabel: "Net income",
        description:
          "Total profit after all expenses and taxes. The starting point for the calculation.",
        direction: { positive: "Profit", negative: "Loss" },
      },
      {
        id: "interest",
        label: "Interest",
        shortLabel: "Interest",
        description: "Interest paid on company debt.",
      },
      {
        id: "taxes",
        label: "Taxes",
        shortLabel: "Taxes",
        description: "Income taxes paid on company profits.",
      },
      {
        id: "depreciation",
        label: "Depreciation",
        shortLabel: "Depreciation",
        description: "Non-cash expense reflecting wear and tear of fixed assets.",
      },
      {
        id: "amortization",
        label: "Amortization",
        shortLabel: "Amortization",
        description: "Non-cash expense for the use of intangible assets.",
      },
    ],
  },
  {
    id: "adjustments",
    title: "Normalization adjustments",
    description:
      "Add back costs a new owner would not carry, and remove income they would not receive.",
    fields: [
      {
        id: "oneTimeExpense",
        label: "One-time expenses",
        shortLabel: "One-time expenses",
        description:
          "Extraordinary expenses not expected to recur, such as a lawsuit settlement or a one-off relocation.",
      },
      {
        id: "oneTimeIncome",
        label: "One-time income",
        shortLabel: "One-time income",
        description:
          "Extraordinary income not expected to recur, such as a gain on an asset sale or an insurance payout.",
        subtract: true,
      },
      {
        id: "discretionaryExpense",
        label: "Discretionary expenses",
        shortLabel: "Discretionary expenses",
        description:
          "Personal or non-essential costs run through the business that a new owner would not incur.",
      },
      {
        id: "ownerCompensation",
        label: "Owner compensation vs. market",
        shortLabel: "Owner compensation",
        description:
          "How much more, or less, you pay yourself than it would cost to hire someone to do your job.",
        direction: { positive: "Above market", negative: "Below market" },
      },
      {
        id: "rent",
        label: "Rent vs. market",
        shortLabel: "Rent",
        description:
          "How much more, or less, the business pays in rent than the market rate. Common when the owner also owns the premises.",
        direction: { positive: "Above market", negative: "Below market" },
      },
    ],
  },
];

export const FIELDS: Field[] = FIELD_GROUPS.flatMap((group) => group.fields);

export function getGroup(id: GroupId): FieldGroup {
  return FIELD_GROUPS.find((group) => group.id === id)!;
}

/** Signed amounts: a loss or a below-market figure is already negative. */
export type EbitdaInputs = Record<FieldId, number>;

export interface EbitdaResult {
  ebitda: number;
  adjustments: number;
  adjustedEbitda: number;
  /** Null until there is revenue to divide by. */
  margin: number | null;
}

/** The amount a field contributes to Adjusted EBITDA, sign included. */
export function contribution(field: Field, amount: number): number {
  return field.subtract ? -amount : amount;
}

export function calculateEbitda(inputs: EbitdaInputs): EbitdaResult {
  const sum = (group: GroupId) =>
    getGroup(group).fields.reduce(
      (total, field) => total + contribution(field, inputs[field.id]),
      0,
    );

  const ebitda = sum("ebitda");
  const adjustments = sum("adjustments");
  const adjustedEbitda = ebitda + adjustments;

  return {
    ebitda,
    adjustments,
    adjustedEbitda,
    margin: inputs.revenue > 0 ? adjustedEbitda / inputs.revenue : null,
  };
}

/** "$1,250,000" or "−$40,000" — whole dollars, matching the valuation calculator. */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const text = `$${Math.abs(rounded).toLocaleString("en-CA")}`;
  return rounded < 0 ? `−${text}` : text;
}

/** "+$40,000", "−$40,000" or "—" for a breakdown line. */
export function formatContribution(amount: number): string {
  if (Math.round(amount) === 0) return "—";
  return amount > 0 ? `+${formatCurrency(amount)}` : formatCurrency(amount);
}

/** "18.4%" or "−1.6%" — one decimal, as in the original calculator. */
export function formatPercent(ratio: number): string {
  const text = `${Math.abs(ratio * 100).toFixed(1)}%`;
  return ratio < 0 && text !== "0.0%" ? `−${text}` : text;
}
