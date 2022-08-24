import * as React from "react";
import {
  BarChart as ReavizBarChart,
  BarSeries as ReavizBarSeries,
} from "reaviz";
import VizComponentContext from "../VizComponentContext";
import Bar from "./Bar";

export interface BarChartComponentProps {
  keyField: string;
  dataField: string;
}

const BarChartComponent = React.memo((props: BarChartComponentProps) => {
  const { keyField, dataField } = props;
  const c = React.useContext(VizComponentContext);
  const { data, groupBy } = c;
  return (
    <ReavizBarChart
      height={300}
      width={300}
      series={<ReavizBarSeries bar={<Bar />} />}
      data={data.map((d: any) => ({
        key: d[keyField || groupBy],
        data: d[dataField],
        metadata: d,
      }))}
    />
  );
});

export default BarChartComponent;
