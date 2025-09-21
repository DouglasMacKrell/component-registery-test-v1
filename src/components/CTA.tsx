import React from "react";

type Props = { label: string; href: string; variant?: "primary" | "secondary" };

function CTABase({ label, href, variant = "primary" }: Props) {
  return (
    <a href={href} className={`btn ${variant}`} aria-label={label}>
      {label}
    </a>
  );
}

const CTA = Object.assign(React.memo(CTABase), { displayName: "CTA" });
export default CTA;