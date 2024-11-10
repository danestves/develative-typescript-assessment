import { createFetch, createSchema } from '@better-fetch/fetch'
import { z } from 'zod'

import { KlineSchema } from '#app/schemas/binance.ts'

export const schema = createSchema({
	'@get/api/v3/klines': {
		query: z.object({
			symbol: z.string(),
			interval: z.string(),
			limit: z.number().optional(),
		}),
		output: z.array(KlineSchema),
	},
})

export const binance = createFetch({
	baseURL: 'https://api.binance.com',
	schema,
})
