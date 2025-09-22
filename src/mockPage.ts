import type { PageDoc } from "./types";
import { generateMockTickets } from "./mockEvents";

export const demoPage: PageDoc = {
  pageTitle: "Concert Deals",
  blocks: [
    { type: "Hero", props: { title: "Hot Tickets Tonight", subtitle: "Save up to 40%" } },
    {
      type: "CardList",
      props: {
        items: [
          { title: "Knicks vs. Nets", price: 89 },
          { title: "Taylor Swift Eras Tour", price: 245, href: "/events/tswift" },
        ],
      },
    },
    { type: "CTA", props: { label: "Browse All Events", href: "/events" } },
  ],
};

// Generate a larger dataset for the TicketList component
export const mockTickets = generateMockTickets();