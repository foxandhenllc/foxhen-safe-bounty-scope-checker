# Safe Bounty Scope Checker

Public Fox & Hen working sample for **Security research prep**.

![Demo screenshot](docs/demo-screenshot.png)

## Live Demo

- Demo: [https://foxhen-safe-bounty-scope-checker.vercel.app](https://foxhen-safe-bounty-scope-checker.vercel.app)
- Repository: [https://github.com/foxandhenllc/foxhen-safe-bounty-scope-checker](https://github.com/foxandhenllc/foxhen-safe-bounty-scope-checker)

## Fully Working Behaviors

- Search, filter, and sort the sample work board.
- Add a new sample item and edit owner, notes, priority, value, effort, and friction.
- Advance work status and watch readiness metrics update.
- Run the 24-hour sprint simulation to reprioritize high-value items.
- Toggle QA gates, generate a handoff report, and download the current board as JSON.

## Service Mapping

This demo packages a lightweight security research prep workflow around:

- Ranked board
- Editable item inspector
- Readiness checklist
- Exportable handoff report

The app is intentionally static so prospects can inspect the flow, fork it, and replace only the fictional sample records in `src/data.ts`.

## Fork This Demo

1. Replace the fictional work items in `src/data.ts` with your own public-safe sample scenario.
2. Update colors, service copy, repository URL, and live demo URL in the same file.
3. Keep screenshots, exported JSON, and README examples free of secrets, real customer data, and private contacts.
4. Run `npm run build --silent` before publishing.

See `docs/forking-guide.md` for a checklist and starter client brief.

## Local Run

```bash
npm install
npm run dev
npm run build
```

## Public-Safe Scope

This is a static React/Vite demo with fictional sample data. It includes no production data, credentials, real contacts, copied customer work, backend, auth, or external service calls.
