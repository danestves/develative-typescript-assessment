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
							<EChart
								renderer="svg"
								style={{
									aspectRatio: '4 / 3',
								}}
								title={{
									text: 'Bitcoin Price History',
									left: 'center',
									top: 10,
									textStyle: {
										color: '#ffffff',
										fontSize: 16,
										fontWeight: 'normal',
									},
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
										rotate: 45,
									},
									splitLine: {
										lineStyle: { color: '#333333' },
									},
								}}
								grid={{
									top: 60,
									right: 16,
									bottom: 0,
									left: 0,
									containLabel: true,
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
							<EChart
								renderer="svg"
								style={{ aspectRatio: '4 / 3' }}
								title={{
									text: 'Volume vs Price Volatility',
									left: 'center',
									top: 10,
									textStyle: {
										color: '#ffffff',
										fontSize: 16,
										fontWeight: 'normal',
									},
								}}
								xAxis={{
									type: 'value',
									name: 'Volume (BTC)',
									nameLocation: 'middle',
									nameGap: 32,
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
									nameLocation: 'middle',
									nameGap: 56,
									axisLabel: {
										formatter: (value: number) => `${value.toFixed(2)}%`,
										color: '#b3b3b3',
									},
									splitLine: {
										lineStyle: { color: '#333333' },
									},
								}}
								grid={{
									top: 80, // Increased to accommodate legend
									right: 40, // Space for y-axis label
									bottom: 64, // Space for x-axis label
									left: 24, // Space for y-axis label
									containLabel: true,
								}}
								series={[
									{
										name: 'BTC Volume vs Volatility', // Added name for legend
										type: 'scatter',
										data: scatterData,
										symbolSize: 8,
										itemStyle: {
											color: '#F7931A',
											opacity: 0.7,
										},
									},
								]}
								toolbox={{
									right: 10,
									top: 10,
									itemSize: 15,
									feature: {
										saveAsImage: {
											type: 'png',
											title: 'Save',
										},
									},
								}}
								animation={true}
								animationDuration={1000}
								animationEasing="elasticOut"
								animationDelay={0}
								dataZoom={[
									{
										type: 'inside', // Mouse wheel zoom
										xAxisIndex: 0,
										filterMode: 'empty',
									},
									{
										type: 'inside', // Mouse wheel zoom
										yAxisIndex: 0,
										filterMode: 'empty',
									},
									{
										type: 'slider', // Bottom slider
										xAxisIndex: 0,
										height: 20,
										bottom: 10,
										borderColor: '#333333',
										backgroundColor: '#1e1e1e',
										fillerColor: 'rgba(247, 147, 26, 0.2)',
										handleStyle: {
											color: '#F7931A',
										},
									},
									{
										type: 'slider', // Right slider
										yAxisIndex: 0,
										width: 20,
										right: 10,
										borderColor: '#333333',
										backgroundColor: '#1e1e1e',
										fillerColor: 'rgba(247, 147, 26, 0.2)',
										handleStyle: {
											color: '#F7931A',
										},
									},
								]}
								tooltip={{
									trigger: 'item',
									formatter: (params: any) => `
                                        Volume: ${params.value[0].toLocaleString()} BTC
                                        <br/>
                                        Volatility: ${params.value[1].toFixed(2)}%
                                    `,
								}}
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
