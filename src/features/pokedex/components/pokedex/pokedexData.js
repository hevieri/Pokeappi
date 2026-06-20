/**
 * pokedexData
 *
 * Módulo de utilidades para la comunicación con la PokéAPI y la
 * normalización de datos. Contiene:
 *   - maxStat: valor máximo de estadística base usado para las barras
 *   - clampPokemonId: ajusta un ID al rango 1..maxPokemonId (wrap)
 *   - loadFromPokeApi: fetch + validación + normalización de la respuesta
 *   - normalizeApiPokemon: transforma la respuesta cruda de la API al
 *     formato interno que usan los componentes (name, types, stats, etc.)
 *   - getGen1MovesForTypes: asigna 3 movimientos clásicos según el tipo
 *
 * La normalización convierte alturas (dm → m), pesos (hg → kg) y
 * aplica title case a nombres y tipos.
 */

export const maxStat = 120
const maxPokemonId = 1010

export function clampPokemonId(id) {
  if (id < 1) return maxPokemonId
  if (id > maxPokemonId) return 1
  return id
}

function titleCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function statValue(pokemon, statName) {
  return pokemon.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0
}

function normalizeApiPokemon(pokemon) {
  const officialArt = pokemon.sprites?.other?.['official-artwork']?.front_default
  const sprite = officialArt || pokemon.sprites?.front_default || ''

  const typeKeys = pokemon.types.map((slot) => slot.type.name)

  return {
    id: pokemon.id,
    name: titleCase(pokemon.name),
    types: pokemon.types.map((slot) => titleCase(slot.type.name)),
    height: `${(pokemon.height / 10).toFixed(1)} m`,
    weight: `${(pokemon.weight / 10).toFixed(1)} kg`,
    ability: titleCase(pokemon.abilities[0]?.ability?.name || 'Unknown'),
    sprite,
    stats: {
      HP: statValue(pokemon, 'hp'),
      ATK: statValue(pokemon, 'attack'),
      DEF: statValue(pokemon, 'defense'),
    },
    moves: getGen1MovesForTypes(typeKeys),
  }
}

function getGen1MovesForTypes(types) {
  const moveMap = {
    normal: ['Tackle', 'Body Slam', 'Take Down'],
    fire: ['Ember', 'Flamethrower', 'Fire Spin'],
    water: ['Water Gun', 'Bubble', 'Hydro Pump'],
    electric: ['Thunder Shock', 'Thunderbolt', 'Thunder Wave'],
    grass: ['Vine Whip', 'Razor Leaf', 'Solar Beam'],
    ice: ['Ice Beam', 'Blizzard', 'Ice Punch'],
    fighting: ['Karate Chop', 'Low Kick', 'Submission'],
    poison: ['Poison Sting', 'Sludge', 'Toxic'],
    ground: ['Mud-Slap', 'Earthquake', 'Dig'],
    flying: ['Gust', 'Wing Attack', 'Sky Attack'],
    psychic: ['Confusion', 'Psychic', 'Psybeam'],
    bug: ['Leech Life', 'Pin Missile', 'Twinneedle'],
    rock: ['Rock Throw', 'Rock Slide', 'Earthquake'],
    ghost: ['Lick', 'Night Shade', 'Shadow Ball'],
    dragon: ['Dragon Rage', 'Hyper Beam', 'Outrage'],
    dark: ['Bite', 'Crunch', 'Night Slash'],
    steel: ['Metal Claw', 'Iron Tail', 'Flash Cannon'],
    fairy: ['Disarming Voice', 'Draining Kiss', 'Dazzling Gleam'],
  }

  for (const type of types) {
    const normalized = type.toLowerCase()
    if (moveMap[normalized]) {
      return moveMap[normalized]
    }
  }

  return ['Tackle', 'Quick Attack', 'Protect']
}

export async function loadFromPokeApi(query) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toString().toLowerCase()}`)

  if (!response.ok) {
    throw new Error('Pokemon not found')
  }

  const data = await response.json()
  return normalizeApiPokemon(data)
}
