import { LRUCache } from 'lru-cache'

export const cache = new LRUCache({
	max: 1000,
	ttl: 1000 * 60 * 60 * 24, // 24 hours
})
