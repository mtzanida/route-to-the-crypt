import { useMemo, useState } from 'react'
import { Activity, ArrowDownToLine, ArrowRight, Check, CircleHelp, Ghost, HeartPulse, Moon, Radio, ShieldAlert, Sparkles, Zap } from 'lucide-react'
import { scenarios, type Endpoint } from './data/scenarios'
import { chooseIllustrativeEndpoint, exportScenarioSnapshot } from './lib/scenarioModel'

export default function App() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [endpoints, setEndpoints] = useState<Endpoint[]>(scenarios[0].endpoints)
  const selected = scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0]
  const activeEndpoint = useMemo(() => chooseIllustrativeEndpoint(endpoints), [endpoints])
  const healthyCount = endpoints.filter((endpoint) => endpoint.healthy).length

  function chooseScenario(id: string) {
    const next = scenarios.find((scenario) => scenario.id === id) ?? scenarios[0]
    setScenarioId(next.id)
    setEndpoints(next.endpoints)
  }

  function toggleEndpoint(id: string) {
    setEndpoints((current) => current.map((endpoint) => endpoint.id === id ? { ...endpoint, healthy: !endpoint.healthy } : endpoint))
  }

  function downloadSnapshot() {
    const snapshot = exportScenarioSnapshot({
      scenarioId: selected.id,
      scenarioTitle: selected.title,
      endpoints,
      activeEndpointId: activeEndpoint?.id ?? null,
    })
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `route-to-the-crypt-${selected.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="app-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Route to the Crypt home">
          <span className="brand-mark"><Ghost size={18} /></span>
          <span>ROUTE <i>TO THE</i> CRYPT</span>
        </a>
        <div className="topbar-right">
          <span className="model-pill"><span className="pulse-dot" /> EDUCATIONAL MODEL</span>
          <button className="icon-button" aria-label="About this model" title="About this model"><CircleHelp size={18} /></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Moon size={13} /> A SAFE PLACE TO EXPLORE CLOUD FAILURE</p>
          <h1>When a route<br /><em>goes dark.</em></h1>
          <p className="hero-text">Explore cloud routing scenarios before touching a real environment. Change endpoint health, follow the path, and see what this teaching model assumes.</p>
        </div>
        <div className="hero-stamp"><span>NO LIVE AWS</span><span>NO CREDENTIALS</span><span>JUST SCENARIOS</span></div>
      </section>

      <div className="workspace-grid">
        <aside className="scenario-column panel">
          <div className="panel-heading"><div><span className="section-kicker">CHOOSE YOUR INCIDENT</span><h2>Scenarios</h2></div><span className="count-badge">03</span></div>
          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <button key={scenario.id} className={`scenario-card ${scenario.id === scenarioId ? 'selected' : ''}`} onClick={() => chooseScenario(scenario.id)}>
                <span className="scenario-number">{scenario.number}</span>
                <span className="scenario-card-copy"><strong>{scenario.title}</strong><small>{scenario.subtitle}</small></span>
                <ArrowRight size={15} className="scenario-arrow" />
              </button>
            ))}
          </div>
          <div className="scenario-note"><Sparkles size={15} /><p>Pick a scenario, then change endpoint health to make it your own.</p></div>
          <div className="sidebar-bottom"><span className="tiny-label">ROUTING LAB / SESSION 01</span><span className="session-state"><span className="green-dot" /> LOCAL SESSION</span></div>
        </aside>

        <section className="map-column panel">
          <div className="panel-heading map-heading"><div><span className="section-kicker">THE NIGHT SHIFT</span><h2>{selected.title}</h2></div><span className="scenario-status"><Activity size={14} /> LIVE MODEL</span></div>
          <p className="scenario-description">{selected.description}</p>
          <div className="map-stage">
            <div className="map-grid" aria-hidden="true" />
            <div className="map-orbit orbit-one" aria-hidden="true" />
            <div className="map-orbit orbit-two" aria-hidden="true" />
            <div className="client-node"><div className="client-icon"><Radio size={19} /></div><span>CLIENT</span><small>Incoming request</small></div>
            <div className={`route-line ${activeEndpoint ? 'route-active' : 'route-dead'}`} aria-hidden="true"><span className="route-packet" /></div>
            <div className="accelerator-node"><div className="accelerator-icon"><Zap size={19} /></div><span>GLOBAL ENTRY</span><small>Illustrative path</small></div>
            <div className="route-branch branch-primary" aria-hidden="true" />
            <div className="route-branch branch-standby" aria-hidden="true" />
            <div className="endpoint-node endpoint-primary">
              <span className="endpoint-region">EU-WEST</span><div className={`endpoint-circle ${endpoints[0]?.healthy ? 'healthy' : 'unhealthy'}`}><span /></div><strong>Dublin</strong><small>PRIMARY</small>
            </div>
            <div className="endpoint-node endpoint-standby">
              <span className="endpoint-region">US-EAST</span><div className={`endpoint-circle ${endpoints[1]?.healthy ? 'healthy' : 'unhealthy'}`}><span /></div><strong>N. Virginia</strong><small>STANDBY</small>
            </div>
            <div className={`map-callout ${activeEndpoint ? '' : 'outage'}`}><span className="callout-dot" />{activeEndpoint ? `PATH → ${activeEndpoint.region}` : 'NO HEALTHY PATH'}</div>
            <div className="map-legend"><span><i className="legend-line" /> Illustrative traffic path</span><span><i className="legend-dot" /> Endpoint</span></div>
          </div>
          <div className="map-footer"><span><ShieldAlert size={14} /> Simplified deterministic model</span><span>SCENARIO {selected.number} / 03</span></div>
        </section>

        <aside className="control-column panel">
          <div className="panel-heading"><div><span className="section-kicker">SIMULATION CONTROLS</span><h2>Endpoint health</h2></div></div>
          <div className="health-summary"><HeartPulse size={16} /><span>{healthyCount} OF {endpoints.length} ENDPOINTS HEALTHY</span></div>
          <div className="endpoint-controls">
            {endpoints.map((endpoint) => (
              <div className="endpoint-control" key={endpoint.id}>
                <div className="endpoint-control-top"><div><strong>{endpoint.region}</strong><small>{endpoint.city} · {endpoint.role}</small></div><span className={`status-label ${endpoint.healthy ? 'is-healthy' : 'is-unhealthy'}`}>{endpoint.healthy ? 'HEALTHY' : 'UNHEALTHY'}</span></div>
                <button className={`toggle-button ${endpoint.healthy ? 'on' : ''}`} onClick={() => toggleEndpoint(endpoint.id)} aria-pressed={endpoint.healthy}>
                  <span className="toggle-track"><span /></span>{endpoint.healthy ? 'Mark unhealthy' : 'Mark healthy'}
                </button>
              </div>
            ))}
          </div>
          <div className={`outcome-card ${activeEndpoint ? '' : 'outcome-outage'}`}>
            <div className="outcome-title">{activeEndpoint ? <Check size={15} /> : <ShieldAlert size={15} />}<span>{activeEndpoint ? 'MODEL OUTCOME' : 'MODEL OUTCOME: OUTAGE'}</span></div>
            <p>{activeEndpoint ? `${activeEndpoint.city} is the illustrative active endpoint in this scenario.` : 'No endpoint is marked healthy, so this model has no available destination.'}</p>
          </div>
          <div className="lesson-box"><span className="section-kicker">THE DEBRIEF</span><p>{selected.lesson}</p></div>
          <button className="export-button" onClick={downloadSnapshot}><ArrowDownToLine size={16} /> Export scenario JSON</button>
          <div className="crew-card"><div className="crew-card-icon"><Sparkles size={15} /></div><div><strong>Crew Debrief</strong><p>Optional Kiro Crew add-on. The core lab works without it.</p><span className="coming-soon">STRETCH FEATURE</span></div></div>
        </aside>
      </div>

      <footer className="disclaimer"><ShieldAlert size={14} /><p><strong>Learning model, not a production emulator.</strong> This prototype uses a small deterministic rule set. It does not connect to AWS or reproduce every service behavior. AWS-specific scenario details and source links will be added after documentation review.</p></footer>
    </main>
  )
}
