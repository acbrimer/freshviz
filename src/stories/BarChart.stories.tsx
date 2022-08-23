import * as React from "react";
import { boolean, number, object, select, color } from "@storybook/addon-knobs";
import {
  BarSeries,
  Bar,
  BarLabel,
  GuideBar,
  HistogramBarSeries,
  MarimekkoBarSeries,
  RangeLines,
  StackedBarSeries,
  StackedNormalizedBarSeries,
  BarChart,
  LinearXAxis,
  LinearYAxis,
  LinearYAxisTickSeries,
  schemes,
} from "reaviz";

export default {
  title: "Charts/Bar Chart",
  component: BarChart,
  subcomponents: {
    BarSeries,
    StackedBarSeries,
    StackedNormalizedBarSeries,
    MarimekkoBarSeries,
    RangeLines,
    Bar,
    BarLabel,
    GuideBar,
    HistogramBarSeries,
  },
};

const categoryData = [
  {
    key: "Phishing Attack",
    data: 10,
  },
  {
    key: "IDS",
    data: 14,
  },
  {
    key: "Malware",
    data: 5,
  },
  {
    key: "DLP",
    data: 18,
  },
];

export const Simple = () => {
  const hasGradient = boolean("Gradient", true);
  const padding = number("Padding", 0.1);
  const height = number("Height", 350);
  const width = number("Width", 500);
  const color = select("Color Scheme", schemes, "cybertron");
  const hasGuideBar = boolean("Guide Bar", false);
  const guide = hasGuideBar ? <GuideBar /> : null;
  const data = object("Data", categoryData);
  const gradient = hasGradient ? Bar.defaultProps.gradient : null;

  return (
    <BarChart
      width={width}
      height={height}
      data={data}
      xAxis={<LinearXAxis type="value" />}
      yAxis={
        <LinearYAxis
          type="category"
          tickSeries={<LinearYAxisTickSeries tickSize={20} />}
        />
      }
      series={
        <BarSeries
          colorScheme={color}
          layout="horizontal"
          padding={padding}
          bar={<Bar gradient={gradient} guide={guide} />}
        />
      }
    />
  );
};
