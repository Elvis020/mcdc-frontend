export interface IcdResult {
  code: string
  name: string
}

/**
 * Search ICD-11 codes using the NLM Clinical Table Search Service.
 * Free API, no key required.
 * https://clinicaltables.nlm.nih.gov/apidoc/icd11_codes/v3/doc.html
 */
export async function searchIcd(
  query: string,
  maxResults = 7,
  signal?: AbortSignal
): Promise<IcdResult[]> {
  if (!query || query.trim().length < 2) return []

  const url = new URL('https://clinicaltables.nlm.nih.gov/api/icd11_codes/v3/search')
  url.searchParams.set('sf', 'code,title')
  url.searchParams.set('df', 'code,title')
  url.searchParams.set('terms', query.trim())
  url.searchParams.set('maxList', String(maxResults))

  const res = await fetch(url.toString(), { signal })

  if (!res.ok) {
    throw new Error(`ICD search failed: ${res.status}`)
  }

  // Response format: [totalCount, [codes], extraData, [[code, title], ...]]
  const data = await res.json()
  const pairs: [string, string][] = data[3] || []

  return pairs.map(([code, name]) => ({ code, name }))
}
