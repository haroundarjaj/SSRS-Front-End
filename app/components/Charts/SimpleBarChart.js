import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

let chart = null;

class SimpleBarChart extends Component {
  componentDidMount() {
    const {
      axisList,
      chartParam,
      chartId,
      data,
      isReport,
      isDashboard
    } = this.props;
    try {
      chart = am4core.create('chart' + chartId, am4charts.XYChart);
      if (!isReport && !isDashboard) {
        chart.exporting.menu = new am4core.ExportMenu();
      }
      chart.paddingRight = 40;
      chart.data = data;

      const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = chartParam.axisX;
      xAxis.renderer.cellStartLocation = 0.1;
      xAxis.renderer.cellEndLocation = 0.9;
      xAxis.renderer.grid.template.location = 0;
      xAxis.renderer.minGridDistance = 10;

      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;

      if (isDashboard) {
        xAxis.renderer.labels.template.disabled = true;
        yAxis.renderer.labels.template.disabled = true;
      } else {
        xAxis.renderer.labels.template.rotation = -90;
        xAxis.renderer.labels.template.fontSize = 15;
        xAxis.renderer.labels.template.verticalCenter = 'center';
        xAxis.renderer.labels.template.horizontalCenter = 'left';
        chart.legend = new am4charts.Legend();
        chart.legend.position = 'bottom';
        chart.legend.labels.template.maxWidth = 95;
      }

      const title = chart.titles.create();
      title.text = chartParam.title;
      title.textAlign = 'middle';
      title.fontSize = 25;
      title.marginBottom = 20;

      xAxis.title.text = chartParam.xtitle;
      yAxis.title.text = chartParam.ytitle;

      chart.colors.list = [];

      axisList.map(prm => chart.colors.list.push(am4core.color(prm.color)));

      axisList.map(prm => this.createSeries(prm.dataKey, prm.name, chartParam.axisX)
      );

      chart.cursor = new am4charts.XYCursor();
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      chart.scrollbarX.disabled = true;

      this.chart = chart;
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(oldProps) {
    try {
      const { chartParam, data } = this.props;
      if (oldProps.chartParam.axisX !== chartParam.axisX) {
        chart.xAxes.getIndex(0).dataFields.category = chartParam.axisX;
        this.refrechPlots();
        chart.invalidateData();
        console.log('difference');
      } else if (oldProps.chartParam.title !== chartParam.title) {
        console.log('change title');
        chart.titles.getIndex(0).text = chartParam.title;
      } else if (oldProps.chartParam.xtitle !== chartParam.xtitle) {
        chart.xAxes.getIndex(0).title.text = chartParam.xtitle;
      } else if (oldProps.chartParam.ytitle !== chartParam.ytitle) {
        chart.yAxes.getIndex(0).title.text = chartParam.ytitle;
      } else if (oldProps.chartParam.showBrush !== chartParam.showBrush) {
        chart.scrollbarX.disabled = !chartParam.showBrush;
      } else if (oldProps.data !== data) {
        chart.data = data;
        this.refrechPlots();
        chart.invalidateData();
        console.log('change data');
        console.log(chart.data);
      } else {
        this.refrechPlots();
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  refrechPlots = () => {
    const { chartParam, axisList } = this.props;
    chart.colors.list = [];
    axisList.map(prm => chart.colors.list.push(am4core.color(prm.color)));
    chart.series.clear();
    axisList.map(prm => this.createSeries(prm.dataKey, prm.name, chartParam.axisX)
    );
  };

  createSeries = (value, name, axisX) => {
    const { stacked } = this.props;
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.8;
    series.dataFields.valueY = value;
    series.dataFields.categoryX = axisX;
    series.name = name;
    if (stacked) {
      series.stacked = true;
    }
    series.tooltipText = name + ': [bold]{valueY}[/]';
    series.tooltip.pointerOrientation = 'vertical';
    series.legendSettings.labelText = name;
  };

  render() {
    const { chartId } = this.props;
    return (
      <div id={'chart' + chartId} style={{ width: '100%', height: '100%' }} />
    );
  }
}

SimpleBarChart.propTypes = {
  axisList: PropTypes.array.isRequired,
  chartParam: PropTypes.object.isRequired,
  chartId: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  isDashboard: PropTypes.bool,
  stacked: PropTypes.bool,
  isReport: PropTypes.bool
};

SimpleBarChart.defaultProps = {
  stacked: false,
  isReport: false,
  isDashboard: false
};

export default SimpleBarChart;