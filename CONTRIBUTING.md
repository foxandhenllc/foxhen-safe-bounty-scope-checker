# Contributing to Safe Bounty Scope Checker

Safe Bounty Scope Checker is part of the Fox & Hen public tool set. Contributions should keep the project useful, inspectable, forkable, and safe to demonstrate in public.

## Good First Contributions

- Add or improve a synthetic sample scenario that demonstrates: A scope checker for payment risk, authorization clarity, boundaries, effort, blockers, and approval gates before pursuing work.
- Improve README examples, screenshots, exported reports, or fork instructions.
- Add smoke coverage for the main interaction, export, or validation path.
- Improve accessibility labels, responsive states, keyboard flow, and empty states.
- Refine public-facing copy so the workflow is easier for a small team to understand and adapt.

## Development

```bash
npm install
npm run typecheck
npm run build
```

Run validation before opening a pull request. If a repo has a dedicated smoke or validation script, run that too.

## Public-Safe Data Rules

- Use synthetic people, companies, domains, dates, IDs, notes, tickets, project names, and screenshots.
- Do not commit real customer exports, analytics dumps, mailing lists, CRM rows, copied private workspace content, credentials, personal contact data, or private URLs.
- Review generated CSV, JSON, Markdown, screenshots, and README examples before publishing.
- Keep demos static and inspectable unless a future roadmap item explicitly adds a reviewed integration.

See `docs/public-safe-data.md` for the full policy.

## Pull Request Checklist

- The project still runs locally.
- Public-safe sample data remains fictional.
- README/docs reflect any user-facing behavior changes.
- Screenshots or exports do not include private material.
- Build, typecheck, and available tests pass.
