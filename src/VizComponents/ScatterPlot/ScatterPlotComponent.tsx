import * as React from "react";
import {
  ScatterPlot as ReavizScatterPlot,
  ScatterSeries as ReavizScatterSeries,
} from "reaviz";
import VizComponentContext from "../VizComponentContext";
import ScatterPoint from "./ScatterPoint";

export interface ScatterPlotComponentProps {
  keyField: string;
  dataField: string;
}

const ScatterPlotComponent = React.memo((props: any) => {
  const { keyField, dataField } = props;
  const c = React.useContext(VizComponentContext);
  const { data, groupBy } = c;

  return (
    <ReavizScatterPlot
      height={300}
      width={300}
      series={<ReavizScatterSeries animated={false} point={<ScatterPoint />} />}
      data={data.map((d: any) => ({
        key: d[keyField || groupBy],
        data: d[dataField],
        metadata: d,
      }))}
    />
  );
});

export default ScatterPlotComponent;
