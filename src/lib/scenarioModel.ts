import type { Endpoint } from '../data/scenarios'

export function chooseIllustrativeEndpoint(endpoints: Endpoint[]) {
  return endpoints.find((endpoint) => endpoint.role === 'Primary' && endpoint.healthy)
    ?? endpoints.find((endpoint) => endpoint.healthy)
    ?? null
}

export function exportScenarioSnapshot(input: {
  scenarioId: string
  scenarioTitle: string
  endpoints: Endpoint[]
  activeEndpointId: string | null
}) {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    modelType: 'educational-simplification',
    scenarioId: input.scenarioId,
    scenarioTitle: input.scenarioTitle,
    endpoints: input.endpoints,
    illustrativeActiveEndpointId: input.activeEndpointId,
    disclaimer: 'This snapshot describes a deterministic educational model. It is not a live AWS configuration or an exact service simulation.',
  }
}

export function parseScenarioSnapshot(value: unknown, expectedScenarioId: string) {
  if (!value || typeof value !== 'object') throw new Error('Invalid saved snapshot.')
  const snapshot = value as Record<string, unknown>
  if (snapshot.schemaVersion !== 1 || snapshot.modelType !== 'educational-simplification'
    || snapshot.scenarioId !== expectedScenarioId || !Array.isArray(snapshot.endpoints)
    || snapshot.endpoints.length !== 2) throw new Error('Saved snapshot does not match this scenario.')
  const expected = [
    { id: 'eu-primary', region: 'EU-WEST', city: 'Dublin', role: 'Primary' },
    { id: 'us-standby', region: 'US-EAST', city: 'N. Virginia', role: 'Standby' },
  ]
  const endpoints: Endpoint[] = snapshot.endpoints.map((value: unknown, index: number) => {
    if (!value || typeof value !== 'object') throw new Error('Invalid saved endpoint.')
    const endpoint = value as Record<string, unknown>
    const reference = expected[index]
    if (endpoint.id !== reference.id || endpoint.region !== reference.region
      || endpoint.city !== reference.city || endpoint.role !== reference.role
      || typeof endpoint.healthy !== 'boolean') throw new Error('Invalid saved endpoint.')
    return { ...reference, role: reference.role as Endpoint['role'], healthy: endpoint.healthy }
  })
  const activeId = chooseIllustrativeEndpoint(endpoints)?.id ?? null
  if (snapshot.illustrativeActiveEndpointId !== activeId) throw new Error('Saved outcome is inconsistent.')
  return { endpoints }
}
