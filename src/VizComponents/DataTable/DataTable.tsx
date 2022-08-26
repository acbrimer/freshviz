import * as React from "react";

import VizComponentProvider, {
  VizComponentProviderProps,
} from "../VizComponentProvider";
import DataTableComponent, {
  DataTableComponentProps,
} from "./DataTableComponent";

export type DataTableProps = Omit<VizComponentProviderProps, "children"> &
  DataTableComponentProps;

const DataTable = (props: DataTableProps) => {
  const {
    groupBy,
    fields,
    linkActions,
    calculatedFields,
    select,
    name,
    style,
  } = props;

  return (
    <VizComponentProvider
      groupBy={groupBy}
      fields={fields}
      linkActions={linkActions}
      name={name}
      calculatedFields={calculatedFields}
      select={select}
    >
      <DataTableComponent style={style} />
    </VizComponentProvider>
  );
};

export default React.memo(DataTable);
