g = hc.Highstock()

g.chart.height = 550
g.legend.enabled = True
g.legend.layout = 'horizontal'
g.legend.align = 'center'
g.legend.maxHeight = 100
g.tooltip.enabled = True
g.tooltip.valueDecimals = 2
g.exporting.enabled = True

g.chart.zoomType = 'xy'
g.title.text = 'Monte Carlo Paths'
g.subtitle.text = 'Plotted with ezhc'

g.plotOptions.series.compare = 'percent'
g.yAxis.labels.formatter = hc.scripts.FORMATTER_PERCENT
g.tooltip.pointFormat = hc.scripts.TOOLTIP_POINT_FORMAT_PERCENT
g.tooltip.positioner = hc.scripts.TOOLTIP_POSITIONER_CENTER_TOP

g.xAxis.gridLineWidth = 1.0
g.xAxis.gridLineDashStyle = 'Dot'
g.yAxis.gridLineWidth = 1.0
g.yAxis.gridLineDashStyle = 'Dot'

g.credits.enabled = True
g.credits.text = 'Source: XXX Cross Asset Solutions.'
g.credits.href = 'http://www.example.com'

g.series = hc.build.series(df)

g.plot(save=False)