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
