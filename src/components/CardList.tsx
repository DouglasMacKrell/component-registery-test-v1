import React, { useMemo } from "react";

type Item = { title: string; price?: number; href?: string };

function CardListBase({ items = [] }: { items: Item[] }) {
  const sorted = useMemo(() => items.slice().sort((a, b) => (a.price ?? 0) - (b.price ?? 0)), [items]);
  if (sorted.length === 0) return <p>No items yet.</p>;
  return (
    <ul>
      {sorted.map((it, i) => (
        <li key={it.href ?? `${it.title}-${i}`}>
          <a href={it.href ?? "#"} aria-label={it.title}>
            {it.title} {typeof it.price === "number" ? `$${it.price}` : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

const CardList = Object.assign(React.memo(CardListBase), { displayName: "CardList" });
export default CardList;