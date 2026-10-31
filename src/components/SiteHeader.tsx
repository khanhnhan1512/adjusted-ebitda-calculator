import { AspenLogo } from "./AspenLogo";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="#top" className="shrink-0">
          <AspenLogo eager className="h-10 w-auto sm:h-12" />
        </a>

        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm font-medium text-charcoal transition hover:text-teal md:block"
          >
            How it works
          </a>
          <a
            href="#formula"
            className="hidden text-sm font-medium text-charcoal transition hover:text-teal md:block"
          >
            The formula
          </a>
          <a
            href="https://aspenval.com/ca/contact-us/"
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-light"
          >
            Contact us
          </a>
        </nav>
      </div>
    </header>
  );
}
