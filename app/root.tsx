import {
	type LoaderFunctionArgs,
	type HeadersFunction,
	type LinksFunction,
	data,
} from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { NuqsAdapter } from 'nuqs/adapters/remix'
import { Toaster } from 'react-hot-toast'
import { HoneypotProvider } from 'remix-utils/honeypot/react'

import { useToast } from './hooks/use-toast.ts'
import { ClientHintCheck, getHints } from './utils/client-hints.tsx'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { combineHeaders, getDomainUrl } from './utils/misc.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import { makeTimings } from './utils/timing.server.ts'
import { getToast } from './utils/toast.server.ts'

import './styles/app.css'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://rsms.me/' },
	{
		rel: 'stylesheet',
		href: 'https://rsms.me/inter/inter.css',
	},
]

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')

	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = honeypot.getInputProps()

	return data(
		{
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
			},
			ENV: getEnv(),
			toast,
			honeyProps,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

function Document({
	children,
	nonce,
	env = {},
}: {
	children: React.ReactNode
	nonce: string
	env?: Record<string, string | undefined>
}) {
	const allowIndexing = ENV.ALLOW_INDEXING !== 'false'
	return (
		<html lang="en" className="h-full overflow-x-hidden">
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{allowIndexing ? null : (
					<meta name="robots" content="noindex, nofollow" />
				)}
				<Links />
			</head>
			<body>
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}

function App() {
	// if there was an error running the loader, data could be missing
	const data = useLoaderData<typeof loader | null>()
	const nonce = useNonce()
	useToast(data?.toast)

	return (
		<Document nonce={nonce} env={data?.ENV}>
			<Outlet />

			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						backgroundColor: '#121212',
						color: '#fff',
						border: '1px solid #333',
					},
				}}
			/>
		</Document>
	)
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<HoneypotProvider {...data.honeyProps}>
			<NuqsAdapter>
				<App />
			</NuqsAdapter>
		</HoneypotProvider>
	)
}

export default AppWithProviders
