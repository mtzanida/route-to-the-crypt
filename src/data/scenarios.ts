export type Endpoint = {
  id: string
  region: string
  city: string
  role: 'Primary' | 'Standby'
  healthy: boolean
}

export type Scenario = {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  endpoints: Endpoint[]
  lesson: string
}

export const scenarios: Scenario[] = [
  {
    id: 'quiet-night',
    number: '01',
    title: 'A quiet night',
    subtitle: 'Both endpoints report healthy',
    description: 'Start with a calm, simplified routing picture. Change an endpoint health state to explore what the model shows next.',
    endpoints: [
      { id: 'eu-primary', region: 'EU-WEST', city: 'Dublin', role: 'Primary', healthy: true },
      { id: 'us-standby', region: 'US-EAST', city: 'N. Virginia', role: 'Standby', healthy: true },
    ],
    lesson: 'The model starts with the primary endpoint. The standby endpoint is available in the scenario if the primary becomes unhealthy.',
  },
  {
    id: 'primary-fades',
    number: '02',
    title: 'The primary fades',
    subtitle: 'Primary endpoint is unhealthy',
    description: 'The primary endpoint has stopped answering health checks in this teaching scenario.',
    endpoints: [
      { id: 'eu-primary', region: 'EU-WEST', city: 'Dublin', role: 'Primary', healthy: false },
      { id: 'us-standby', region: 'US-EAST', city: 'N. Virginia', role: 'Standby', healthy: true },
    ],
    lesson: 'In this simplified model, the highlighted path moves to the healthy standby endpoint. Real service behavior depends on the documented configuration and health-check rules.',
  },
  {
    id: 'dark-regions',
    number: '03',
    title: 'Dark across regions',
    subtitle: 'No endpoint is healthy',
    description: 'Both endpoints are unhealthy. Explore what the model reports when it has nowhere to send traffic.',
    endpoints: [
      { id: 'eu-primary', region: 'EU-WEST', city: 'Dublin', role: 'Primary', healthy: false },
      { id: 'us-standby', region: 'US-EAST', city: 'N. Virginia', role: 'Standby', healthy: false },
    ],
    lesson: 'The model reports an outage because no endpoint is marked healthy. This is an educational simplification, not a prediction for a particular AWS configuration.',
  },
]
