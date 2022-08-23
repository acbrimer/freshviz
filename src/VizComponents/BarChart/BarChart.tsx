import * as React from "react";

import VizComponentProvider, {
  VizComponentProviderProps,
} from "../VizComponentProvider";
import BarChartComponent, { BarChartComponentProps } from "./BarChartComponent";

export type BarChartProps = Omit<VizComponentProviderProps, "children"> &
  BarChartComponentProps;

const BarChart = (props: BarChartProps) => {
  const { groupBy, fields, linkActions, name, keyField, dataField } = props;
  return (
    <VizComponentProvider
      groupBy={groupBy}
      fields={fields}
      linkActions={linkActions}
      name={name}
    >
      <BarChartComponent keyField={keyField} dataField={dataField} />
    </VizComponentProvider>
  );
};

export default React.memo(BarChart);
