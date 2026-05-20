import { useMemo, useState, type CSSProperties } from "react";
import { sample, type ItemStatus, type QualityCheck, type WorkItem } from "./data";
import "./styles.css";

const statusOrder: ItemStatus[] = ["backlog", "active", "blocked", "ready", "done"];
const statusLabels: Record<ItemStatus, string> = {
  backlog: "Backlog",
  active: "Active",
  blocked: "Blocked",
  ready: "Ready",
  done: "Done",
};

function scoreItem(item: WorkItem) {
  const statusBoost = { backlog: 0, active: 10, blocked: -12, ready: 18, done: 8 }[item.status];
  return item.priority * 18 + item.value * 14 - item.friction * 9 - item.effort * 4 + statusBoost;
}

function App() {
  const [items, setItems] = useState<WorkItem[]>(sample.items);
  const [checks, setChecks] = useState<QualityCheck[]>(sample.checks);
  const [selectedId, setSelectedId] = useState(sample.items[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");
  const [sortMode, setSortMode] = useState<"score" | "effort" | "friction">("score");
  const [report, setReport] = useState("");

  const appStyle = {
    "--accent": sample.theme.accent,
    "--accent-2": sample.theme.accent2,
    "--ink": sample.theme.ink,
    "--soft": sample.theme.soft,
    "--warm": sample.theme.warm,
  } as CSSProperties;

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...items]
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter((item) => !normalized || [item.title, item.category, item.owner, item.notes].join(" ").toLowerCase().includes(normalized))
      .sort((left, right) => {
        if (sortMode === "effort") return left.effort - right.effort;
        if (sortMode === "friction") return left.friction - right.friction;
        return scoreItem(right) - scoreItem(left);
      });
  }, [items, query, sortMode, statusFilter]);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const readyCount = items.filter((item) => item.status === "ready" || item.status === "done").length;
  const blockedCount = items.filter((item) => item.status === "blocked").length;
  const averageScore = Math.round(items.reduce((sum, item) => sum + scoreItem(item), 0) / Math.max(1, items.length));
  const checklistScore = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);
  const readiness = Math.min(99, Math.max(20, averageScore + checklistScore - blockedCount * 7));
  const topItem = filteredItems[0] ?? selected;

  function updateItem(id: string, patch: Partial<WorkItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function advanceItem(id: string) {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;
    const nextIndex = Math.min(statusOrder.length - 1, statusOrder.indexOf(item.status) + 1);
    updateItem(id, { status: statusOrder[nextIndex] });
  }

  function addWorkItem() {
    const nextNumber = items.length + 1;
    const item: WorkItem = {
      id: `new-${Date.now()}`,
      title: `${sample.subtitle} item ${nextNumber}`,
      category: "Intake",
      owner: "Fox & Hen",
      status: "backlog",
      priority: 3,
      effort: 2,
      friction: 2,
      value: 4,
      due: "24h",
      notes: "New sample item added from the live demo.",
    };
    setItems((current) => [item, ...current]);
    setSelectedId(item.id);
  }

  function toggleCheck(id: string) {
    setChecks((current) => current.map((check) => (check.id === id ? { ...check, passed: !check.passed } : check)));
  }

  function runSprintSimulation() {
    const ranked = [...items].sort((left, right) => scoreItem(right) - scoreItem(left)).slice(0, 3).map((item) => item.id);
    setItems((current) =>
      current.map((item) =>
        ranked.includes(item.id)
          ? { ...item, status: item.status === "blocked" ? "ready" : "active", friction: Math.max(1, item.friction - 1) }
          : item,
      ),
    );
    setChecks((current) => current.map((check) => ({ ...check, passed: check.id === "friction" ? true : check.passed })));
  }

  function generateReport() {
    const lines = [
      `${sample.title} handoff report`,
      `Readiness: ${readiness}%`,
      `Top item: ${topItem.title} (${statusLabels[topItem.status]})`,
      "",
      "Prioritized work:",
      ...filteredItems.slice(0, 5).map((item, index) => `${index + 1}. ${item.title} — score ${scoreItem(item)}, owner ${item.owner}, due ${item.due}`),
      "",
      "Open checks:",
      ...checks.filter((check) => !check.passed).map((check) => `- ${check.label}`),
    ];
    setReport(lines.join("\n"));
  }

  function downloadJson() {
    const payload = JSON.stringify({ generatedAt: new Date().toISOString(), readiness, items, checks }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sample.repoName}-handoff.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell" style={appStyle}>
      <header className="site-header">
        <a className="brand" href="https://foxandhenllc.com">
          <span className="brand-mark">F&amp;H</span>
          <span>
            <strong>Fox &amp; Hen</strong>
            <small>{sample.title}</small>
          </span>
        </a>
        <nav>
          <a href="#board">Board</a>
          <a href="#inspector">Inspector</a>
          <a className="nav-button" href={sample.repositoryUrl}>Repository</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="service-line">{sample.serviceLine}</p>
            <h1>{sample.description}</h1>
            <p className="lede">This is a working public sample: edit records, change scoring inputs, run a sprint simulation, generate a handoff report, and export the current state.</p>
            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={runSprintSimulation}>Run 24h sprint simulation</button>
              <button type="button" className="secondary-action" onClick={generateReport}>Generate handoff report</button>
            </div>
          </div>
          <aside className="score-console">
            <div className="console-topline">
              <span>Live readiness</span>
              <strong>{readiness}%</strong>
            </div>
            <div className="meter"><span style={{ width: `${readiness}%` }} /></div>
            <div className="metric-grid">
              <article><span>Ready/done</span><strong>{readyCount}</strong><small>items packaged</small></article>
              <article><span>Blocked</span><strong>{blockedCount}</strong><small>needs decision</small></article>
              <article><span>Top score</span><strong>{scoreItem(topItem)}</strong><small>{topItem.title}</small></article>
            </div>
          </aside>
        </section>

        <section id="board" className="board-layout">
          <div className="section-heading">
            <p>Working tool</p>
            <h2>Prioritize, edit, advance, and package the sample work.</h2>
          </div>

          <div className="controls">
            <input aria-label="Search work items" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, owner, category..." />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ItemStatus | "all")}>
              <option value="all">All statuses</option>
              {statusOrder.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
            </select>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as "score" | "effort" | "friction")}>
              <option value="score">Sort by payout score</option>
              <option value="effort">Sort by fastest effort</option>
              <option value="friction">Sort by lowest friction</option>
            </select>
            <button type="button" onClick={addWorkItem}>Add sample item</button>
          </div>

          <div className="work-grid">
            <div className="item-list">
              {filteredItems.map((item) => (
                <button key={item.id} type="button" className={item.id === selected.id ? "item-card selected" : "item-card"} onClick={() => setSelectedId(item.id)}>
                  <span className={`status ${item.status}`}>{statusLabels[item.status]}</span>
                  <strong>{item.title}</strong>
                  <small>{item.category} · {item.owner} · due {item.due}</small>
                  <em>Score {scoreItem(item)}</em>
                </button>
              ))}
            </div>

            <aside id="inspector" className="inspector">
              <div className="inspector-header">
                <span className={`status ${selected.status}`}>{statusLabels[selected.status]}</span>
                <button type="button" onClick={() => advanceItem(selected.id)}>Advance status</button>
              </div>
              <h3>{selected.title}</h3>
              <label>Owner<input value={selected.owner} onChange={(event) => updateItem(selected.id, { owner: event.target.value })} /></label>
              <label>Notes<textarea value={selected.notes} onChange={(event) => updateItem(selected.id, { notes: event.target.value })} /></label>
              <div className="slider-grid">
                {(["priority", "value", "effort", "friction"] as const).map((field) => (
                  <label key={field}>{field}
                    <input type="range" min="1" max="5" value={selected[field]} onChange={(event) => updateItem(selected.id, { [field]: Number(event.target.value) } as Partial<WorkItem>)} />
                    <span>{selected[field]}</span>
                  </label>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="package-grid">
          <div className="checklist-card">
            <p className="service-line">QA gates</p>
            <h2>Toggle the checks that make this ready to hand off.</h2>
            <div className="check-list">
              {checks.map((check) => (
                <button key={check.id} type="button" className={check.passed ? "check passed" : "check"} onClick={() => toggleCheck(check.id)}>
                  <span>{check.passed ? "✓" : "○"}</span>
                  {check.label}
                  <em>{check.weight} pts</em>
                </button>
              ))}
            </div>
          </div>

          <div className="report-card">
            <p className="service-line">Export</p>
            <h2>Generate a buyer-readable package.</h2>
            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={generateReport}>Refresh report</button>
              <button type="button" className="secondary-action" onClick={downloadJson}>Download JSON</button>
            </div>
            <textarea className="report-output" value={report || "Click Generate handoff report to create a live summary from the current board state."} onChange={(event) => setReport(event.target.value)} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
