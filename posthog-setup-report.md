# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Breksa Event App. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which sets up client-side analytics, session replay, and error tracking automatically. A reverse proxy was added to `next.config.ts` to route PostHog requests through `/ingest`, improving data reliability and ad-blocker bypass. Three key user action events were instrumented across the app.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" hero button | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card (includes title, slug, location, date) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link (includes label and href) | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1633797)
- [User engagement over time](/insights/nU5KroKZ)
- [Explore Events button clicks](/insights/nqRRjoLj)
- [Event card clicks](/insights/sX0Pm9Jd)
- [Most clicked events by title](/insights/wMV3AuN7)
- [Unique users engaging with events](/insights/B6mo8ynO)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
