import { AspenLogo } from "./AspenLogo";

const OFFICES = [
  {
    city: "Vancouver",
    lines: ["1285 West Broadway, Suite 600", "Vancouver BC V6H 3X8"],
    phone: "604.600.7550",
    tel: "+16046007550",
  },
  {
    city: "Calgary",
    lines: ["444 – 5th Avenue SW, Suite 400", "Calgary AB T2P 2T8"],
    phone: "587.429.2913",
    tel: "+15874292913",
  },
];

/**
 * Placeholder for the CBV stamp submark. Replace with the official asset at
 * `public/cbv-stamp.svg` when it is available.
 */
function CbvSubmark() {
  return (
    <span
      className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border border-teal/50 text-center leading-tight text-teal"
      title="Chartered Business Valuator"
    >
      <span className="text-sm font-bold tracking-widest">CBV</span>
      <span className="text-[0.5rem] tracking-wider text-white/60">
        CHARTERED
      </span>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest text-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <AspenLogo variant="light" className="h-20 w-auto" />
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              Independent business valuation and advisory, delivered by
              Chartered Business Valuators.
            </p>
            <div className="mt-6">
              <CbvSubmark />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {OFFICES.map((office) => (
              <div key={office.city}>
                <h3 className="eyebrow text-white/50">{office.city}</h3>
                <address className="mt-4 text-sm leading-relaxed text-white/80 not-italic">
                  {office.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <a
                    href={`tel:${office.tel}`}
                    className="mt-2 block transition hover:text-teal"
                  >
                    T: {office.phone}
                  </a>
                </address>
              </div>
            ))}

            <div className="sm:col-span-2">
              <h3 className="eyebrow text-white/50">Get in touch</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li>
                  <a
                    href="mailto:info@aspenval.com"
                    className="transition hover:text-teal"
                  >
                    info@aspenval.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://aspenval.com"
                    className="transition hover:text-teal"
                  >
                    aspenval.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/50">
          <p>
            Indicative only. Not a formal valuation opinion or financial advice.
            This calculator works from the figures you enter and does not
            verify them. A Chartered Business Valuator tests each normalization
            adjustment against your financial records before relying on it for
            legal, tax, or transaction purposes.
          </p>
          <p className="mt-3">
            © {new Date().getFullYear()} Aspen Valuations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
