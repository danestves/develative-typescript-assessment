import { createFetch, createSchema } from '@better-fetch/fetch'
import { z } from 'zod'

import { ParameterValueSchema } from '#app/schemas/fakerapi.ts'

export const schema = createSchema({
	'@get/api/v2/custom': {
		query: z
			.object({
				_locale: z.string().optional().default('en_US'),
				_quantity: z.number().optional().default(10),
				_seed: z.string().nullable().optional(),
				company: ParameterValueSchema.optional().default('company_name'),
				country: ParameterValueSchema.optional().default('country'),
				state: ParameterValueSchema.optional().default('state'),
				city: ParameterValueSchema.optional().default('city'),
				zipcode: ParameterValueSchema.optional().default('postcode'),
				employees: ParameterValueSchema.optional().default('counter'),
				revenue: ParameterValueSchema.optional().default('number'),
				website: ParameterValueSchema.optional().default('website'),
				sales_rep: ParameterValueSchema.optional().default('first_name'),
				last_contacted: ParameterValueSchema.optional().default('date'),
				purchased: ParameterValueSchema.optional().default('boolean'),
				notes: ParameterValueSchema.optional().default('text'),
			})
			.optional(),
		output: z.object({
			status: z.string(),
			code: z.number(),
			locale: z.string(),
			seed: z.string().nullable(),
			total: z.number(),
			data: z.array(z.any()), // TODO: type this
		}),
	},
})

export const fakerapi = createFetch({
	baseURL: 'https://fakerapi.it',
	schema,
})
