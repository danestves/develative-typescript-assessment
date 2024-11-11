import { z } from 'zod'

export const ParameterValueSchema = z.enum([
	'boolean',
	'boolean_digit',
	'buildingNumber',
	'card_expiration',
	'card_number',
	'card_type',
	'city',
	'company_name',
	'counter',
	'country',
	'countryCode',
	'date',
	'dateTime',
	'ean',
	'email',
	'firstName',
	'first_name',
	'image',
	'lastName',
	'latitude',
	'longText',
	'longitude',
	'name',
	'null',
	'number',
	'phone',
	'pokemon',
	'postcode',
	'state',
	'streetAddress',
	'streetName',
	'text',
	'upc',
	'uuid',
	'vat',
	'website',
	'word',
])

export const User = z.object({
	company: z.string(),
	country: z.string(),
	state: z.string(),
	city: z.string(),
	zipcode: z.string(),
	employees: z.number(),
	revenue: z.number(),
	website: z.string(),
	sales_rep: z.string(),
	last_contacted: z.string(),
	purchased: z.boolean(),
	notes: z.string().optional(),
})

export const CustomApiSchema = z.object({
	status: z.string(),
	code: z.number(),
	locale: z.string(),
	seed: z.string().nullable(),
	total: z.number(),
	data: z.array(User),
})

export const NewUserSchema = z.object({
	company: z.string().min(1, 'Company is required'),
	country: z.string().min(1, 'Country is required'),
	state: z.string().min(1, 'State is required'),
	city: z.string().min(1, 'City is required'),
	zipcode: z
		.string()
		.regex(
			/^\d{5}(-\d{4})?$/,
			'Must be a valid USA ZIP code (e.g. 12345 or 12345-6789)',
		),
	employees: z.coerce
		.number()
		.int('Must be a whole number')
		.positive('Must be greater than 0'),
	revenue: z.coerce
		.number()
		.int('Must be a whole number')
		.positive('Must be greater than 0'),
	website: z.string().url('Must be a valid URL'),
	sales_rep: z.string().min(1, 'Sales rep is required'),
	last_contacted: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'),
	purchased: z.boolean(),
	notes: z.string().optional(),
})
