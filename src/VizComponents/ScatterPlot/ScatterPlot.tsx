import * as React from "react";

import VizComponentProvider, {
  VizComponentProviderProps,
} from "../VizComponentProvider";
import ScatterPlotComponent, {
  ScatterPlotComponentProps,
} from "./ScatterPlotComponent";

export type ScatterPlotProps = Omit<VizComponentProviderProps, "children"> &
  ScatterPlotComponentProps;

const ScatterPlot = (props: ScatterPlotProps) => {
  const { groupBy, fields, linkActions, name, keyField, dataField } = props;
  return (
    <VizComponentProvider
      groupBy={groupBy}
      fields={fields}
      linkActions={linkActions}
      name={name}
    >
      <ScatterPlotComponent keyField={keyField} dataField={dataField} />
    </VizComponentProvider>
  );
};

export default React.memo(ScatterPlot);
