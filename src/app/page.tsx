import { EbitdaCalculator } from "@/components/EbitdaCalculator";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const STEPS = [
  {
    number: "01",
    title: "Start from net income",
    body: "Your bottom line after every expense and tax, straight from the income statement.",
  },
  {
    number: "02",
    title: "Add back to EBITDA",
    body: "Interest, taxes, depreciation and amortization reflect how the business is financed, taxed and accounted for, not how it performs. Adding them back gives EBITDA.",
  },
  {
    number: "03",
    title: "Normalize the earnings",
    body: "Strip out one-time items and owner-specific costs so the figure shows what the business would earn for a new owner. That is the number buyers apply a multiple to.",
  },
];

const FORMULA = [
  { sign: "", label: "Net income" },
  { sign: "+", label: "Interest" },
  { sign: "+", label: "Taxes" },
  { sign: "+", label: "Depreciation" },
  { sign: "+", label: "Amortization" },
  { sign: "=", label: "EBITDA", total: true },
  { sign: "+", label: "One-time expenses" },
  { sign: "−", label: "One-time income" },
  { sign: "+", label: "Discretionary expenses" },
  { sign: "±", label: "Owner compensation above or below market" },
  { sign: "±", label: "Rent above or below market" },
  { sign: "=", label: "Adjusted EBITDA", total: true },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden bg-forest">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-24">
            <div className="max-w-2xl">
              <p className="eyebrow text-teal">Adjusted EBITDA Calculator</p>
              <h1 className="mt-4 text-4xl leading-[1.08] font-bold text-white sm:text-5xl lg:text-6xl">
                What does your business really earn?
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/75">
                Turn your net income into Adjusted EBITDA, the normalized
                earnings figure buyers and valuators start from, and see your
                margin as you type.
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/60">
                <li>Takes a few minutes</li>
                <li>No contact details required</li>
                <li>Calculated in your browser</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="scroll-mt-20 bg-bone">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <EbitdaCalculator />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="eyebrow text-teal">How it works</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-forest sm:text-4xl">
              From net income to Adjusted EBITDA
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.number} className="border-t-2 border-teal pt-5">
                  <span className="text-sm font-bold tracking-widest text-teal">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-charcoal/70">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formula */}
        <section id="formula" className="scroll-mt-24 bg-forest">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="eyebrow text-teal">The formula</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold text-balance text-white sm:text-4xl">
                Every line, in the order we apply it
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/70">
                Adjustments that make the business look stronger need support:
                a buyer&apos;s diligence team will ask for the invoice behind
                every add-back. The margin is Adjusted EBITDA divided by
                revenue.
              </p>
            </div>

            <ol className="overflow-hidden rounded-2xl border border-white/12">
              {FORMULA.map((line) => (
                <li
                  key={line.label}
                  className={`flex items-center gap-4 px-6 py-3 ${
                    line.total
                      ? "bg-white/[0.07] font-bold text-white"
                      : "text-white/80"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-4 shrink-0 text-center font-bold text-teal"
                  >
                    {line.sign}
                  </span>
                  <span>{line.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="rounded-2xl bg-bone px-6 py-10 text-center sm:px-10">
              <p className="eyebrow text-teal">Know your worth</p>
              <h3 className="mt-3 text-2xl font-bold text-forest sm:text-3xl">
                Want a number that holds up in diligence?
              </h3>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-charcoal/70">
                A Chartered Business Valuator tests every adjustment against
                your records. Their normalized EBITDA is the one lenders,
                buyers and the CRA will accept.
              </p>
              <a
                href="https://aspenval.com/ca/contact-us/"
                className="mt-7 inline-block rounded-full bg-teal px-9 py-4 font-semibold text-white transition hover:bg-teal-dark"
              >
                Talk to a valuator
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
