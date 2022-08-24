import * as React from "react";
import * as _ from "lodash";
import {
  ScatterPlot as ReavizScatterPlot,
  ScatterSeries as ReavizScatterSeries,
  ScatterSeriesProps as ReavizScatterSeriesProps,
} from "reaviz";

import {
  ReavizScatterPlotProps,
  ReavizComponentCommonProps,
} from "../ReavizComponent";
import VizComponentContext from "../VizComponentContext";
import ScatterPoint from "./ScatterPoint";

export interface ScatterPlotComponentProps extends ReavizComponentCommonProps {
  ScatterPlotProps?: Partial<Omit<ReavizScatterPlotProps, "series" | "data">>;
  ScatterSeriesProps?: Partial<
    Omit<ReavizScatterSeriesProps, "activeIds" | "point">
  >;
}

const ScatterPlotComponent = React.memo((props: ScatterPlotComponentProps) => {
  const { keyField, dataField, idField, ScatterPlotProps, ScatterSeriesProps } =
    props;
  const c = React.useContext(VizComponentContext);
  const { data, groupBy, hoveredIds } = c;

  return (
    <ReavizScatterPlot
      height={300}
      width={300}
      {...ScatterPlotProps}
      series={
        <ReavizScatterSeries
          animated={false}
          {...ScatterSeriesProps}
          activeIds={hoveredIds}
          point={<ScatterPoint />}
        />
      }
      data={data.map((d: any) => ({
        id: d[idField || groupBy],
        key: d[keyField],
        data: d[dataField],
        metadata: d,
      }))}
    />
  );
});

export default ScatterPlotComponent;
