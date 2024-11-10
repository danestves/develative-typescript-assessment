import { z } from 'zod'

export const KlineSchema = z.tuple([
	z.number(), // Kline open time
	z.string(), // Open price
	z.string(), // High price
	z.string(), // Low price
	z.string(), // Close price
	z.string(), // Volume
	z.number(), // Kline Close time
	z.string(), // Quote asset volume
	z.number(), // Number of trades
	z.string(), // Taker buy base asset volume
	z.string(), // Taker buy quote asset volume
	z.string(), // Unused field, ignore.
])
