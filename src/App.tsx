import { useMemo, useState, type CSSProperties } from "react";
import { sample, type DemoStage, type StageStatus, type WorkItem } from "./data";
import "./styles.css";

const statusLabels: Record<StageStatus, string> = {
  ready: "Ready",
  active: "In progress",
  waiting: "Needs approval",
  queued: "Queued",
};

const statusClass: Record<StageStatus, string> = {
  ready: "status-ready",
  active: "status-active",
  waiting: "status-waiting",
  queued: "status-queued",
};

function App() {
  const [activeStage, setActiveStage] = useState(1);
  const [deliverySpeed, setDeliverySpeed] = useState(2);
  const [checkedItems, setCheckedItems] = useState(() => new Set(["scope", "qa"]));

  const currentStage = sample.stages[activeStage - 1];
  const activeWork = sample.workItems.find((item) => item.status === currentStage.status) ?? sample.workItems[0];
  const readiness = useMemo(() => {
    const base = 58 + deliverySpeed * 7 + checkedItems.size * 6;
    const waitingPenalty = sample.workItems.filter((item) => item.status === "waiting").length * 3;
    return Math.min(98, Math.max(42, base - waitingPenalty));
  }, [checkedItems, deliverySpeed]);

  const appStyle = {
    "--accent": sample.theme.accent,
    "--accent-2": sample.theme.accent2,
    "--ink": sample.theme.ink,
    "--soft": sample.theme.soft,
    "--warm": sample.theme.warm,
    "--surface": sample.theme.surface,
    "--muted": sample.theme.muted,
    "--border": sample.theme.border,
    "--score": `${readiness}%`,
  } as CSSProperties;

  function toggleItem(item: string) {
    setCheckedItems((current) => {
      const next = new Set(current);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }

  return (
    <div className="app-shell" style={appStyle}>
      <header className="site-header">
        <a className="brand" href="https://foxandhenllc.com" aria-label="Fox and Hen website">
          <span className="brand-mark">F&amp;H</span>
          <span>
            <strong>Fox &amp; Hen</strong>
            <small>{sample.subtitle}</small>
          </span>
        </a>
        <nav aria-label="Demo navigation">
          <a href="#workbench">Workbench</a>
          <a href="#handoff">Handoff</a>
          <a className="nav-button" href={sample.repositoryUrl}>Repository</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="service-line">{sample.serviceLine}</p>
            <h1>{sample.heroTitle}</h1>
            <p className="lede">{sample.heroCopy}</p>
            <div className="hero-actions" aria-label="Demo actions">
              <button type="button" className="primary-action" onClick={() => setActiveStage(2)}>
                {sample.primaryAction}
              </button>
              <button type="button" className="secondary-action" onClick={() => setActiveStage(4)}>
                {sample.secondaryAction}
              </button>
            </div>
            <div className="metric-strip" aria-label="Demo metrics">
              {sample.metrics.map((metric) => (
                <article key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.note}</small>
                </article>
              ))}
            </div>
          </div>

          <HeroConsole
            currentStage={currentStage}
            activeWork={activeWork}
            readiness={readiness}
            setActiveStage={setActiveStage}
          />
        </section>

        <section id="workbench" className="workbench">
          <div className="section-heading">
            <p>Live sample workflow</p>
            <h2>Click through the operating model behind the demo.</h2>
          </div>
          <div className="workbench-grid">
            <div className="stage-list" aria-label="Workflow stages">
              {sample.stages.map((stage) => (
                <button
                  type="button"
                  key={stage.label}
                  className={stage.index === activeStage ? "stage-card is-active" : "stage-card"}
                  onClick={() => setActiveStage(stage.index)}
                >
                  <span className="stage-number">{stage.index}</span>
                  <span>
                    <strong>{stage.label}</strong>
                    <small>{stage.detail}</small>
                  </span>
                  <em className={statusClass[stage.status]}>{statusLabels[stage.status]}</em>
                </button>
              ))}
            </div>

            <div className="detail-panel">
              <div className="panel-topline">
                <span>{currentStage.owner}</span>
                <em className={statusClass[currentStage.status]}>{statusLabels[currentStage.status]}</em>
              </div>
              <h3>{currentStage.label}</h3>
              <p>{currentStage.detail}</p>

              <div className="control-panel" aria-label="Scenario controls">
                <label>
                  Sprint intensity
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={deliverySpeed}
                    onChange={(event) => setDeliverySpeed(Number(event.target.value))}
                  />
                </label>
                <div className="toggles">
                  {[
                    ["scope", "Scope locked"],
                    ["qa", "QA pass"],
                    ["handoff", "Handoff note"],
                    ["reuse", "Reuse path"],
                  ].map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      className={checkedItems.has(key) ? "toggle is-on" : "toggle"}
                      onClick={() => toggleItem(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="readiness-card">
                <div className="score-ring" aria-label={`Readiness score ${readiness} percent`}>
                  <strong>{readiness}</strong>
                  <span>ready</span>
                </div>
                <div>
                  <h4>{activeWork.title}</h4>
                  <p>{activeWork.detail}</p>
                  <span className={statusClass[activeWork.status]}>{statusLabels[activeWork.status]}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="handoff" className="handoff">
          <div className="section-heading">
            <p>Handoff package</p>
            <h2>Every sample ends with a buyer-readable delivery bundle.</h2>
          </div>
          <div className="handoff-grid">
            {sample.deliverables.map((deliverable, index) => (
              <article key={deliverable.title} className="deliverable-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{deliverable.title}</h3>
                <p>{deliverable.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="timeline-section">
          <div className="timeline">
            {sample.timeline.map((item) => (
              <article key={item.time}>
                <strong>{item.time}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="proof-card">
            <h2>What this demonstrates</h2>
            <ul>
              {sample.proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href={sample.liveDemoUrl}>Live demo URL</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroConsole({
  currentStage,
  activeWork,
  readiness,
  setActiveStage,
}: {
  currentStage: DemoStage;
  activeWork: WorkItem;
  readiness: number;
  setActiveStage: (stage: number) => void;
}) {
  return (
    <aside className="hero-console" aria-label="Interactive demo console">
      <div className="console-bar">
        <span />
        <span />
        <span />
        <strong>{sample.title}</strong>
      </div>
      <div className="console-body">
        <div className="console-rail">
          {sample.stages.map((stage) => (
            <button
              key={stage.label}
              type="button"
              className={stage.label === currentStage.label ? "rail-item is-active" : "rail-item"}
              onClick={() => setActiveStage(stage.index)}
            >
              <span>{stage.index}</span>
              {stage.label}
            </button>
          ))}
        </div>
        <div className="console-main">
          <div className="console-status">
            <span>Local sample state</span>
            <em className={statusClass[currentStage.status]}>{statusLabels[currentStage.status]}</em>
          </div>
          <h2>{currentStage.label}</h2>
          <p>{currentStage.detail}</p>
          <div className="mini-grid">
            <div className="score-ring compact">
              <strong>{readiness}</strong>
              <span>score</span>
            </div>
            <article>
              <span>Focus item</span>
              <strong>{activeWork.title}</strong>
              <small>{activeWork.detail}</small>
            </article>
          </div>
          <div className="queue-list">
            {sample.workItems.map((item) => (
              <div key={item.title} className="queue-row">
                <span className={statusClass[item.status]}>{statusLabels[item.status]}</span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default App;
