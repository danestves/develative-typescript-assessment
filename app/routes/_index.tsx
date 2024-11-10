import { EChart } from '@kbox-labs/react-echarts'
import { type HeadersFunction, type MetaFunction, data } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DateTime } from 'luxon'
import Card from 'react-bootstrap/Card'
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
	const scatterPlot = await time(
		() =>
			binance('@get/api/v3/klines', {
				query: { symbol: 'BTCUSDT', interval: '1d', limit: 180 },
			}),
		{
			type: 'binance',
			desc: 'Fetching scatter plot data from Binance',
			timings,
		},
	)

	return data(
		{ timeSeries: timeSeries.data || [], scatterPlot: scatterPlot.data || [] },
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
	const { timeSeries, scatterPlot } = useLoaderData<typeof loader>()

	const scatterData = scatterPlot.map((item) => {
		const volume = parseFloat(item[5]) // Base volume
		const high = parseFloat(item[2])
		const low = parseFloat(item[3])
		const percentDiff = ((high - low) / low) * 100 // Volatility as percentage

		return [volume, percentDiff]
	})

	return (
		<Container>
			<Row className="g-4 py-4">
				<Col lg={6}>
					<Card style={{ backgroundColor: '#1e1e1e', borderColor: '#333333' }}>
						<Card.Body>
							<Card.Title style={{ color: '#ffffff' }}>
								Bitcoin for the last 30 days
							</Card.Title>
							<EChart
								renderer="svg"
								style={{
									aspectRatio: '4 / 3',
								}}
								xAxis={{
									type: 'time',
									axisLabel: {
										formatter: (value: number) =>
											DateTime.fromMillis(value).toFormat('MMM d'),
										color: '#b3b3b3',
									},
									splitLine: {
										lineStyle: { color: '#333333' },
									},
								}}
								yAxis={{
									type: 'value',
									boundaryGap: [0, '30%'],
									axisLabel: {
										formatter: (value: number) => `$${value.toLocaleString()}`,
										color: '#b3b3b3',
									},
									splitLine: {
										lineStyle: { color: '#333333' },
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
								animation={true}
								animationDuration={1000}
								animationEasing="cubicOut"
								series={[
									{
										type: 'line',
										data: timeSeries.map((item) => [
											item[0], // timestamp
											parseFloat(item[4]), // close price
										]),
										animationDuration: 1500,
										animationDelay: (idx: number) => idx * 50,
										itemStyle: {
											color: '#F7931A',
										},
										lineStyle: {
											color: '#F7931A',
										},
										areaStyle: {
											color: {
												type: 'linear',
												x: 0,
												y: 0,
												x2: 0,
												y2: 1,
												colorStops: [
													{ offset: 0, color: '#F7931A' },
													{ offset: 1, color: 'rgba(247, 147, 26, 0.1)' },
												],
											},
										},
									},
								]}
								theme="dark"
								backgroundColor="#1e1e1e"
							/>
						</Card.Body>
					</Card>
				</Col>

				<Col lg={6}>
					<Card style={{ backgroundColor: '#1e1e1e', borderColor: '#333333' }}>
						<Card.Body>
							<Card.Title>Bitcoin Volatility</Card.Title>
							<EChart
								renderer="svg"
								style={{ aspectRatio: '4 / 3' }}
								xAxis={{
									type: 'value',
									name: 'Volume (BTC)',
									axisLabel: {
										formatter: (value: number) => value.toLocaleString(),
										color: '#b3b3b3',
									},
									splitLine: {
										lineStyle: { color: '#333333' },
									},
								}}
								yAxis={{
									type: 'value',
									name: 'Price Volatility (%)',
									axisLabel: {
										formatter: (value: number) => `${value.toFixed(2)}%`,
										color: '#b3b3b3',
									},
									splitLine: {
										lineStyle: { color: '#333333' },
									},
								}}
								tooltip={{
									trigger: 'item',
									formatter: (params: any) => `
                                        Volume: ${params.value[0].toLocaleString()} BTC
                                        <br/>
                                        Volatility: ${params.value[1].toFixed(2)}%
                                    `,
								}}
								animation={true}
								animationDuration={1000}
								animationEasing="elasticOut"
								series={[
									{
										type: 'scatter',
										data: scatterData,
										symbolSize: 8,
										itemStyle: {
											color: '#F7931A',
											opacity: 0.7,
										},
										animationDelay: (idx: number) => idx * 10,
										animationDuration: 1500,
										animationEasing: 'bounceOut',
									},
								]}
								theme="dark"
								backgroundColor="#1e1e1e"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}
