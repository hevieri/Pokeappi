let cached = null

export async function fetchBaseForms() {
  if (cached) return cached

  const [chainRes, speciesRes] = await Promise.all([
    fetch('https://pokeapi.co/api/v2/evolution-chain?limit=100000').then(r => r.json()),
    fetch('https://pokeapi.co/api/v2/pokemon-species?limit=100000').then(r => r.json()),
  ])

  const nameToId = {}
  speciesRes.results.forEach(s => {
    const id = parseInt(s.url.split('/').filter(Boolean).pop(), 10)
    nameToId[s.name] = id
  })

  const baseNames = new Set(chainRes.results.map(r => r.name))

  cached = speciesRes.results
    .filter(s => baseNames.has(s.name))
    .map(s => ({ name: s.name, id: nameToId[s.name] }))
    .filter(p => p.id)

  return cached
}
