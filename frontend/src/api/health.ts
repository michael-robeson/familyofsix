export interface HealthResponse {
  status: 'ok'
  service: 'familyofsix-api'
}

export async function checkApiHealth(): Promise<HealthResponse> {
  const response = await fetch('/api/health')
  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}`)
  }

  const health: unknown = await response.json()
  if (
    typeof health !== 'object' ||
    health === null ||
    !('status' in health) ||
    health.status !== 'ok' ||
    !('service' in health) ||
    health.service !== 'familyofsix-api'
  ) {
    throw new Error('Health check returned an unexpected response')
  }

  return {
    status: 'ok',
    service: 'familyofsix-api',
  }
}
