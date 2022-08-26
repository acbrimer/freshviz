import * as React from "react";
import * as _ from "lodash";
import { TableVirtuoso } from "react-virtuoso";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VizComponentContext from "../VizComponentContext";

import DataTableRow from "./DataTableRow";
import DataTableHeader from "./DataTableHeader";
import DataTableRowWrapper from "./DataTableRowWrapper";

export interface DataTableComponentProps {
  style?: React.CSSProperties;
}

const DataTableComponent = (props: DataTableComponentProps) => {
  const { style } = props;
  const c = React.useContext(VizComponentContext);
  const { data, groupBy, sort } = c;

  const table = React.useMemo(
    () => (
      <TableVirtuoso
        style={{ height: 400, ...style }}
        data={
          sort && Object.keys(sort).length > 0
            ? _.orderBy(data, Object.keys(sort), Object.values(sort))
            : data
        }
        components={{
          Scroller: React.forwardRef((props, ref) =>
            React.useMemo(
              () => <TableContainer component={Paper} {...props} ref={ref} />,
              []
            )
          ),
          Table: (props) => (
            <Table {...props} style={{ borderCollapse: "separate" }} />
          ),
          TableHead: TableHead,
          // @ts-ignore
          TableRow: React.forwardRef((props: any, ref) => (
            <DataTableRowWrapper {...props} ref={ref} />
          )),
          TableBody: React.forwardRef((props, ref) => (
            <TableBody {...props} ref={ref} />
          )),
        }}
        fixedHeaderContent={() => (
          <DataTableHeader fields={Object.keys(data[0])} />
        )}
        itemContent={(ix, record) => <DataTableRow ix={ix} record={record} />}
      />
    ),
    [data, sort]
  );

  return <>{table}</>;
};

export default React.memo(DataTableComponent);
