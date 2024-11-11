import { type EChartsOption, type SetOptionOpts } from 'echarts'
import * as echarts from 'echarts/core'
import { useEffect, useRef, useState } from 'react'

import {
	type EChartEventsProps,
	echartsEvents as ev,
} from '#app/lib/react-echarts/events.ts'

export type UseEChartsOptions = EChartEventsProps &
	SetOptionOpts &
	EChartsOption &
	Parameters<typeof echarts.init>[2] & {
		group?: echarts.ECharts['group']
		theme?: Parameters<typeof echarts.init>[1]
		use?: Parameters<typeof echarts.use>[0]
	}

async function getGlobalUse() {
	const all = [
		import('echarts/features'),
		import('echarts/charts'),
		import('echarts/components'),
		import('echarts/renderers'),
	]

	const promise = await Promise.all(
		// @ts-expect-error
		all.map((m) => m.then((m) => Object.values(m))),
	)

	return promise.flat()
}

export function useECharts<T extends HTMLElement>({
	// Init
	devicePixelRatio,
	height,
	locale,
	pointerSize,
	renderer,
	theme,
	use,
	useCoarsePointer,
	useDirtyRect,
	width,

	// eChartsInstance
	group,

	// SetOption
	lazyUpdate,
	notMerge,
	replaceMerge,
	silent,
	transition,
	darkMode,
	media,
	options,
	stateAnimation,

	// Option
	angleAxis,
	animation,
	animationDelay,
	animationDelayUpdate,
	animationDuration,
	animationDurationUpdate,
	animationEasing,
	animationEasingUpdate,
	animationThreshold,
	aria,
	axisPointer,
	backgroundColor,
	blendMode,
	brush,
	calendar,
	color,
	dataZoom,
	dataset,
	geo,
	graphic,
	grid,
	hoverLayerThreshold,
	legend,
	parallel,
	parallelAxis,
	polar,
	progressive,
	progressiveThreshold,
	radar,
	radiusAxis,
	series,
	singleAxis,
	textStyle,
	timeline,
	title,
	toolbox,
	tooltip,
	useUTC,
	visualMap,
	xAxis,
	yAxis,

	// Events
	onAxisAreaSelected,
	onBrush,
	onBrushEnd,
	onBrushSelected,
	onClick,
	onContextMenu,
	onDataRangeSelected,
	onDataViewChanged,
	onDataZoom,
	onDoubleClick,
	onDownplay,
	onFinished,
	onGeoSelectChanged,
	onGeoSelected,
	onGeoUnselected,
	onGlobalCursorTaken,
	onGlobalOut,
	onHighlight,
	onLegendInverseSelect,
	onLegendScroll,
	onLegendSelectChanged,
	onLegendSelected,
	onLegendUnselected,
	onMagicTypeChanged,
	onMouseDown,
	onMouseMove,
	onMouseOut,
	onMouseOver,
	onRendered,
	onRestore,
	onSelectChanged,
	onTimelineChanged,
	onTimelinePlayChanged,
}: UseEChartsOptions): [(node: T) => void, echarts.ECharts | undefined] {
	const containerRef = useRef<T>(null)
	const echartsRef = useRef<echarts.ECharts | undefined>(null)
	const resizeObserverRef = useRef<ResizeObserver>(null)
	const [started, setStarted] = useState(false)
	const echartsInstance = echartsRef.current

	async function setContainerRef(node: T) {
		if (containerRef.current && echartsRef.current) return

		containerRef.current = node
		echartsRef.current = await startEcharts()
		resizeObserverRef.current = startResizeObserver()

		setStarted(true)
	}

	async function startEcharts() {
		if (!containerRef.current) return

		const useOpts = use || (await getGlobalUse())

		echarts.use(useOpts)

		return echarts.init(containerRef.current, theme, {
			devicePixelRatio,
			height,
			locale,
			pointerSize,
			renderer,
			useCoarsePointer,
			useDirtyRect,
			width,
		})
	}

	function startResizeObserver() {
		const resizeObserver = new ResizeObserver(() => {
			echartsRef.current?.resize()
		})

		if (containerRef.current) resizeObserver.observe(containerRef.current)
		return resizeObserver
	}

	useEffect(() => {
		return () => echartsInstance?.dispose?.()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!echartsInstance) return

		if (group) echartsInstance.group = group
	}, [group, started, echartsInstance])

	useEffect(() => {
		if (!echartsInstance) return

		echartsInstance.setOption(
			{
				series,
				useUTC,
				xAxis,
				yAxis,
				progressive,
				blendMode,
				hoverLayerThreshold,
				progressiveThreshold,
				animation,
				animationDelay,
				animationDelayUpdate,
				animationDuration,
				animationDurationUpdate,
				animationEasing,
				animationEasingUpdate,
				animationThreshold,
				...(angleAxis && { angleAxis }),
				...(aria && { aria }),
				...(axisPointer && { axisPointer }),
				...(backgroundColor && { backgroundColor }),
				...(brush && { brush }),
				...(calendar && { calendar }),
				...(color && { color }),
				...(darkMode && { darkMode }),
				...(dataset && { dataset }),
				...(dataZoom && { dataZoom }),
				...(geo && { geo }),
				...(graphic && { graphic }),
				...(grid && { grid }),
				...(legend && { legend }),
				...(media && { media }),
				...(options && { options }),
				...(parallel && { parallel }),
				...(parallelAxis && { parallelAxis }),
				...(polar && { polar }),
				...(radar && { radar }),
				...(radiusAxis && { radiusAxis }),
				...(series && { series }),
				...(singleAxis && { singleAxis }),
				...(stateAnimation && { stateAnimation }),
				...(textStyle && { textStyle }),
				...(timeline && { timeline }),
				...(title && { title }),
				...(toolbox && { toolbox }),
				...(tooltip && { tooltip }),
				...(useUTC && { useUTC }),
				...(visualMap && { visualMap }),
				...(xAxis && { xAxis }),
				...(yAxis && { yAxis }),
			},
			{
				lazyUpdate,
				notMerge,
				replaceMerge,
				silent,
				transition,
			},
		)
	}, [
		angleAxis,
		animation,
		animationDelay,
		animationDelayUpdate,
		animationDuration,
		animationDurationUpdate,
		animationEasing,
		animationEasingUpdate,
		animationThreshold,
		aria,
		axisPointer,
		backgroundColor,
		blendMode,
		brush,
		calendar,
		color,
		darkMode,
		dataset,
		dataZoom,
		geo,
		graphic,
		grid,
		hoverLayerThreshold,
		legend,
		media,
		options,
		parallel,
		parallelAxis,
		polar,
		progressive,
		progressiveThreshold,
		radar,
		radiusAxis,
		series,
		singleAxis,
		stateAnimation,
		textStyle,
		timeline,
		title,
		toolbox,
		tooltip,
		useUTC,
		visualMap,
		xAxis,
		yAxis,

		//
		lazyUpdate,
		notMerge,
		replaceMerge,
		silent,
		transition,

		//
		started,
		echartsInstance,
	])

	useEffect(() => {
		if (!echartsInstance) return

		if (onAxisAreaSelected) {
			echartsInstance.off(ev.onAxisAreaSelected)
			echartsInstance.on(ev.onAxisAreaSelected, onAxisAreaSelected)
		}
		if (onBrush) {
			echartsInstance.off(ev.onBrush)
			echartsInstance.on(ev.onBrush, onBrush)
		}
		if (onBrushEnd) {
			echartsInstance.off(ev.onBrushEnd)
			echartsInstance.on(ev.onBrushEnd, onBrushEnd)
		}
		if (onBrushSelected) {
			echartsInstance.off(ev.onBrushSelected)
			echartsInstance.on(ev.onBrushSelected, onBrushSelected)
		}
		if (onClick) {
			echartsInstance.off(ev.onClick)
			echartsInstance.on(ev.onClick, onClick)
		}
		if (onContextMenu) {
			echartsInstance.off(ev.onContextMenu)
			echartsInstance.on(ev.onContextMenu, onContextMenu)
		}
		if (onDataRangeSelected) {
			echartsInstance.off(ev.onDataRangeSelected)
			echartsInstance.on(ev.onDataRangeSelected, onDataRangeSelected)
		}
		if (onDataViewChanged) {
			echartsInstance.off(ev.onDataViewChanged)
			echartsInstance.on(ev.onDataViewChanged, onDataViewChanged)
		}
		if (onDataZoom) {
			echartsInstance.off(ev.onDataZoom)
			echartsInstance.on(ev.onDataZoom, onDataZoom)
		}
		if (onDoubleClick) {
			echartsInstance.off(ev.onDoubleClick)
			echartsInstance.on(ev.onDoubleClick, onDoubleClick)
		}
		if (onDownplay) {
			echartsInstance.off(ev.onDownplay)
			echartsInstance.on(ev.onDownplay, onDownplay)
		}
		if (onFinished) {
			echartsInstance.off(ev.onFinished)
			echartsInstance.on(ev.onFinished, onFinished)
		}
		if (onGeoSelectChanged) {
			echartsInstance.off(ev.onGeoSelectChanged)
			echartsInstance.on(ev.onGeoSelectChanged, onGeoSelectChanged)
		}
		if (onGeoSelected) {
			echartsInstance.off(ev.onGeoSelected)
			echartsInstance.on(ev.onGeoSelected, onGeoSelected)
		}
		if (onGeoUnselected) {
			echartsInstance.off(ev.onGeoUnselected)
			echartsInstance.on(ev.onGeoUnselected, onGeoUnselected)
		}
		if (onGlobalCursorTaken) {
			echartsInstance.off(ev.onGlobalCursorTaken)
			echartsInstance.on(ev.onGlobalCursorTaken, onGlobalCursorTaken)
		}
		if (onGlobalOut) {
			echartsInstance.off(ev.onGlobalOut)
			echartsInstance.on(ev.onGlobalOut, onGlobalOut)
		}
		if (onHighlight) {
			echartsInstance.off(ev.onHighlight)
			echartsInstance.on(ev.onHighlight, onHighlight)
		}
		if (onLegendInverseSelect) {
			echartsInstance.off(ev.onLegendInverseSelect)
			echartsInstance.on(ev.onLegendInverseSelect, onLegendInverseSelect)
		}
		if (onLegendScroll) {
			echartsInstance.off(ev.onLegendScroll)
			echartsInstance.on(ev.onLegendScroll, onLegendScroll)
		}
		if (onLegendScroll) {
			echartsInstance.off(ev.onLegendScroll)
			echartsInstance.on(ev.onLegendScroll, onLegendScroll)
		}
		if (onLegendSelectChanged) {
			echartsInstance.off(ev.onLegendSelectChanged)
			echartsInstance.on(ev.onLegendSelectChanged, onLegendSelectChanged)
		}
		if (onLegendSelected) {
			echartsInstance.off(ev.onLegendSelected)
			echartsInstance.on(ev.onLegendSelected, onLegendSelected)
		}
		if (onLegendUnselected) {
			echartsInstance.off(ev.onLegendUnselected)
			echartsInstance.on(ev.onLegendUnselected, onLegendUnselected)
		}
		if (onMagicTypeChanged) {
			echartsInstance.off(ev.onMagicTypeChanged)
			echartsInstance.on(ev.onMagicTypeChanged, onMagicTypeChanged)
		}
		if (onMouseDown) {
			echartsInstance.off(ev.onMouseDown)
			echartsInstance.on(ev.onMouseDown, onMouseDown)
		}
		if (onMouseMove) {
			echartsInstance.off(ev.onMouseMove)
			echartsInstance.on(ev.onMouseMove, onMouseMove)
		}
		if (onMouseOut) {
			echartsInstance.off(ev.onMouseOut)
			echartsInstance.on(ev.onMouseOut, onMouseOut)
		}
		if (onMouseOver) {
			echartsInstance.off(ev.onMouseOver)
			echartsInstance.on(ev.onMouseOver, onMouseOver)
		}
		if (onRendered) {
			echartsInstance.off(ev.onRendered)
			echartsInstance.on(ev.onRendered, onRendered)
		}
		if (onRestore) {
			echartsInstance.off(ev.onRestore)
			echartsInstance.on(ev.onRestore, onRestore)
		}
		if (onSelectChanged) {
			echartsInstance.off(ev.onSelectChanged)
			echartsInstance.on(ev.onSelectChanged, onSelectChanged)
		}
		if (onTimelineChanged) {
			echartsInstance.off(ev.onTimelineChanged)
			echartsInstance.on(ev.onTimelineChanged, onTimelineChanged)
		}
		if (onTimelinePlayChanged) {
			echartsInstance.off(ev.onTimelinePlayChanged)
			echartsInstance.on(ev.onTimelinePlayChanged, onTimelinePlayChanged)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		onAxisAreaSelected,
		onBrush,
		onBrushEnd,
		onBrushSelected,
		onClick,
		onContextMenu,
		onDataRangeSelected,
		onDataViewChanged,
		onDataZoom,
		onDoubleClick,
		onDownplay,
		onFinished,
		onGeoSelectChanged,
		onGeoSelected,
		onGeoUnselected,
		onGlobalCursorTaken,
		onGlobalOut,
		onHighlight,
		onLegendInverseSelect,
		onLegendScroll,
		onLegendSelectChanged,
		onLegendSelected,
		onLegendUnselected,
		onMagicTypeChanged,
		onMouseDown,
		onMouseMove,
		onMouseOut,
		onMouseOver,
		onRendered,
		onRestore,
		onSelectChanged,
		onTimelineChanged,
		onTimelinePlayChanged,

		started,
	])

	// @ts-ignore
	return [setContainerRef, echartsRef.current]
}
