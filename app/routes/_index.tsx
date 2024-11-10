import { EChart } from '@kbox-labs/react-echarts'
import { type HeadersFunction, type MetaFunction, data } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DateTime } from 'luxon'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { binance } from '#app/services/binance/config.server.ts'
import { makeTimings, time } from '#app/utils/timing.server.ts'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export async function loader() {
	const timings = makeTimings('index loader')
	const timeSeries = await time(
		() =>
			binance('@get/api/v3/klines', {
				query: {
					symbol: 'BTCUSDT',
					interval: '1d',
					limit: 30,
				},
			}),
		{
			type: 'binance',
			desc: 'Fetching time series data from Binance',
			timings,
		},
	)

	return data(
		{ timeSeries: timeSeries.data || [] },
		{
			headers: {
				'Server-Timing': timings.toString(),
			},
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

export default function Index() {
	const { timeSeries } = useLoaderData<typeof loader>()

	return (
		<Container>
			<Row>
				<Col>
					<EChart
						renderer="svg"
						style={{
							aspectRatio: '4 / 3',
						}}
						xAxis={{
							type: 'time',
							axisLabel: {
								formatter: (value: number) =>
									DateTime.fromMillis(value).toLocaleString(),
							},
						}}
						yAxis={{
							type: 'value',
							boundaryGap: [0, '30%'],
							axisLabel: {
								formatter: (value: number) => `$${value.toLocaleString()}`,
							},
						}}
						tooltip={{
							trigger: 'axis',
							formatter: (params: any) => {
								const [data] = params
								return `
                                  Date: ${DateTime.fromMillis(data.value[0]).toLocaleString()}
                                  <br/>
                                  Price: $${data.value[1].toLocaleString()}
                                `
							},
						}}
						series={[
							{
								type: 'line',
								data: timeSeries.map((item) => [
									item[0], // timestamp
									parseFloat(item[4]), // close price
								]),
							},
						]}
					/>
				</Col>
			</Row>
		</Container>
	)
}
