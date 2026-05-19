export const sample = {
  "repoName": "foxhen-safe-bounty-scope-checker",
  "title": "Safe Bounty Scope Checker",
  "subtitle": "Authorization-first bounty planning",
  "serviceLine": "Security research prep",
  "heroTitle": "Check bounty scope before touching a target.",
  "heroCopy": "A fictional bounty planning tool that highlights authorized assets, prohibited actions, payout clarity, and approval gates before any research begins.",
  "primaryAction": "Check scope",
  "secondaryAction": "Review no-touch list",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-safe-bounty-scope-checker",
  "liveDemoUrl": "https://foxhen-safe-bounty-scope-checker.vercel.app",
  "theme": {
    "accent": "#253f6e",
    "accent2": "#ffbf69",
    "ink": "#050b17",
    "soft": "#edf3ff",
    "warm": "#fff2df",
    "surface": "#fffaf4",
    "muted": "#5c667a",
    "border": "rgba(7, 18, 31, 0.12)"
  },
  "metrics": [
    {
      "label": "Allowed assets",
      "value": "14",
      "note": "sample scope"
    },
    {
      "label": "No-touch rules",
      "value": "9",
      "note": "must obey"
    },
    {
      "label": "Payout clarity",
      "value": "78%",
      "note": "needs review"
    }
  ],
  "stages": [
    {
      "label": "Program",
      "detail": "Record payer, payout terms, disclosure channel, and written authorization.",
      "status": "ready",
      "owner": "Research",
      "index": 1
    },
    {
      "label": "Scope",
      "detail": "Separate allowed assets from out-of-scope domains and sensitive actions.",
      "status": "active",
      "owner": "Studio",
      "index": 2
    },
    {
      "label": "Safety",
      "detail": "Flag social engineering, destructive testing, deposits, and blockchain interactions.",
      "status": "waiting",
      "owner": "Chris",
      "index": 3
    },
    {
      "label": "Plan",
      "detail": "Package a safe test checklist without running any exploit activity.",
      "status": "queued",
      "owner": "Ops",
      "index": 4
    }
  ],
  "workItems": [
    {
      "title": "Asset table",
      "detail": "Mark wildcard and app-scope boundaries",
      "status": "ready"
    },
    {
      "title": "Prohibited list",
      "detail": "Promote no-touch actions to the top",
      "status": "active"
    },
    {
      "title": "Payout rules",
      "detail": "Waiting on program wording",
      "status": "waiting"
    },
    {
      "title": "Research memo",
      "detail": "Queued for approval gate",
      "status": "queued"
    }
  ],
  "deliverables": [
    {
      "title": "Scope matrix",
      "detail": "Allowed, restricted, and forbidden targets in one view."
    },
    {
      "title": "Safety checklist",
      "detail": "No-contact, no-deposit, no-transaction boundaries made explicit."
    },
    {
      "title": "Approval memo",
      "detail": "What Chris must approve before any external action."
    }
  ],
  "timeline": [
    {
      "time": "0-1 hr",
      "detail": "Read official program terms"
    },
    {
      "time": "1-2 hrs",
      "detail": "Map scope and payout clarity"
    },
    {
      "time": "2-3 hrs",
      "detail": "Prepare safe research checklist"
    }
  ],
  "proof": [
    "Preserves the Web3/security safe-harbor rules only when relevant.",
    "Shows careful authorization discipline for bounty work.",
    "Does not contact projects or test live targets."
  ]
} as const;

export type StageStatus = "ready" | "active" | "waiting" | "queued";
export type DemoStage = (typeof sample.stages)[number];
export type WorkItem = (typeof sample.workItems)[number];
