import { LRUCache } from 'lru-cache'

export const cache = new LRUCache({
	max: 1000 * 60 * 10, // 10 minutes
	ttl: 1000 * 60 * 60 * 24, // 24 hours
})
