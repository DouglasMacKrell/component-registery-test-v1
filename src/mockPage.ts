import type { PageDoc } from "./types";

export const demoPage: PageDoc = {
  pageTitle: "Concert Deals",
  blocks: [
    { type: "Hero", props: { title: "Hot Tickets Tonight", subtitle: "Save up to 40%" } },
    {
      type: "CardList",
      props: {
        items: [
          { title: "Knicks vs. Nets", price: 89 },
          { title: "Taylor Swift", price: 245, href: "/events/tswift" },
        ],
      },
    },
    { type: "CTA", props: { label: "Browse All Events", href: "/events" } },
  ],
};