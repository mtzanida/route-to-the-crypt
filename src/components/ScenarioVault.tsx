import { useEffect, useRef, useState } from 'react'
import type { Endpoint } from '../data/scenarios'
import { exportScenarioSnapshot, parseScenarioSnapshot } from '../lib/scenarioModel'

type Props = {
  scenarioId: string
  scenarioTitle: string
  endpoints: Endpoint[]
  activeEndpointId: string | null
  onRestore: (endpoints: Endpoint[]) => void
}

export default function ScenarioVault(props: Props) {
  const pending = useRef<AbortController | null>(null)
  useEffect(() => () => pending.current?.abort(), [])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('Save an incident, change its health states, then restore it from local emulated S3.')

  async function request(action: 'save' | 'load') {
    setBusy(true)
    const controller = new AbortController()
    pending.current = controller
    const timer = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(`/api/vault/${props.scenarioId}`, action === 'save' ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportScenarioSnapshot(props)),
        signal: controller.signal,
      } : { signal: controller.signal })
      const result = await response.json()
      if (controller.signal.aborted) return
      if (!response.ok || result.storage !== 'aws-emulator') {
        throw new Error(result.error || 'Local vault is unavailable.')
      }
      if (action === 'load') {
        const snapshot = parseScenarioSnapshot(result.snapshot, props.scenarioId)
        props.onRestore(snapshot.endpoints)
      }
      setMessage(`${result.operation} succeeded: ${result.key}. ${action === 'save' ? 'Snapshot saved.' : 'Health states restored.'}`)
    } catch (error) {
      setMessage(`${error instanceof Error ? error.message : 'Local vault is unavailable.'} Start the emulator and run npm run lab. No cloud fallback is used.`)
    } finally {
      clearTimeout(timer)
      setBusy(false)
    }
  }

  return (
    <section className="vault-card" aria-labelledby="vault-title">
      <span className="section-kicker">OPTIONAL LOCAL LAB</span>
      <h3 id="vault-title">The Scenario Vault</h3>
      <p>Preserve an incident in AWS Emulator, then bring it back from the crypt.</p>
      <div className="vault-actions">
        <button disabled={busy} onClick={() => request('save')}>{busy ? 'Working…' : 'Save snapshot'}</button>
        <button disabled={busy} onClick={() => request('load')}>Restore snapshot</button>
      </div>
      <p className="vault-message" role="status">{message}</p>
      <small>One slot per scenario; saving replaces it. Stored snapshots disappear when the emulator stops. Routing remains a teaching model.</small>
    </section>
  )
}
