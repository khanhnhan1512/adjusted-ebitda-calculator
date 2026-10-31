import Image from "next/image";

/**
 * Official Aspen Valuations lockup (wordmark + "Know your worth" tagline).
 *
 * `dark` is the primary logo for light backgrounds. `light` is the reversed
 * version for dark backgrounds — the forest letters are white, the teal accents
 * are unchanged. Size it with a height class; the width follows the aspect ratio.
 */
export function AspenLogo({
  variant = "dark",
  className = "h-12 w-auto",
  eager = false,
}: {
  variant?: "dark" | "light";
  className?: string;
  /** Load immediately — set for the above-the-fold header logo. */
  eager?: boolean;
}) {
  return (
    <Image
      src={variant === "dark" ? "/aspen-logo.png" : "/aspen-logo-white.png"}
      alt="Aspen Valuations"
      width={1400}
      height={474}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
