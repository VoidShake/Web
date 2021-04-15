const BASE_URL = 'https://addons-ecs.forgesvc.net/api/v2'

export function getMod(id: number) {
   return fetch(`${BASE_URL}/addon/${id}`).then(r => r.json())
}