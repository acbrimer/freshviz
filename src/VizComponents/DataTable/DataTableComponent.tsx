import * as React from "react";
import * as _ from "lodash";
import {
  TableVirtuoso,
  TableVirtuosoHandle,
  TableVirtuosoProps,
} from "react-virtuoso";
import Table, { TableProps } from "@mui/material/Table";
import TableBody, { TableBodyProps } from "@mui/material/TableBody";
import TableContainer, {
  TableContainerProps,
} from "@mui/material/TableContainer";
import TableHead, { TableHeadProps } from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import VizComponentContext from "../VizComponentContext";
import FieldRecordProvider from "../ValueDisplayFields/FieldRecordProvider";

import DataTableHeader from "./DataTableHeader";
import DataTableRowWrapper, { TableRowProps } from "./DataTableRowWrapper";

export interface DataTableComponentProps {
  overscan?:
    | number
    | {
        main: number;
        reverse: number;
      };
  style?: React.CSSProperties;
  TableContainerProps?: TableContainerProps;
  TableProps?: TableProps;
  TableBodyProps?: TableBodyProps;
  TableHeadProps?: TableHeadProps;
  TableRowProps?: TableRowProps;
}

const DataTableComponent = (props: DataTableComponentProps) => {
  const {
    overscan,
    style,
    TableContainerProps,
    TableProps,
    TableBodyProps,
    TableHeadProps,
    TableRowProps,
  } = props;

  const { data, groupBy, sort, focusIds, clearFocusActions, fieldDefinitions } =
    React.useContext(VizComponentContext);
  const tableRef = React.useRef<TableVirtuosoHandle>();

  const getIdIndex = React.useCallback(
    (id: any) =>
      _.indexOf(
        (sort && Object.keys(sort).length > 0
          ? _.orderBy(data, Object.keys(sort), Object.values(sort))
          : data
        ).map((r: any) => r[groupBy]),
        id
      ),
    [sort, data]
  );

  const table = React.useMemo(
    () => (
      <TableVirtuoso
        overscan={
          overscan || {
            main: 100,
            reverse: 100,
          }
        }
        ref={tableRef}
        style={{ height: 200, ...style }}
        data={
          sort && Object.keys(sort).length > 0
            ? _.orderBy(data, Object.keys(sort), Object.values(sort))
            : data
        }
        components={{
          Scroller: React.forwardRef((props, ref) =>
            React.useMemo(
              () => (
                <TableContainer
                  component={Paper}
                  {...props}
                  {...TableContainerProps}
                  ref={ref}
                />
              ),
              []
            )
          ),
          Table: (props) => (
            <Table
              {...props}
              style={{ borderCollapse: "separate" }}
              {...TableProps}
            />
          ),
          TableHead: React.forwardRef((props, ref) => (
            <TableHead {...props} {...TableHeadProps} ref={ref} />
          )),
          // @ts-ignore
          TableRow: React.forwardRef((props, ref) => (
            <DataTableRowWrapper {...props} {...TableRowProps} ref={ref} />
          )),
          TableBody: React.forwardRef((props, ref) => (
            <TableBody {...props} {...TableBodyProps} ref={ref} />
          )),
        }}
        fixedHeaderContent={() => <DataTableHeader />}
        itemContent={(ix, record) => (
          <FieldRecordProvider record={record}>
            {fieldDefinitions.map((field, fieldIx) => (
              <TableCell key={`cell-${ix}-${fieldIx}`}>
                {React.cloneElement(field.valueComponent, {
                  source: field.name,
                  valueType: field.valueType,
                })}
              </TableCell>
            ))}
          </FieldRecordProvider>
        )}
      />
    ),
    [data, sort]
  );

  React.useLayoutEffect(() => {
    if (tableRef.current && focusIds && focusIds.length > 0) {
      const ix = getIdIndex(focusIds[0]);
      if (ix !== -1) {
        tableRef.current.scrollToIndex(ix);
      }
      clearFocusActions();
    }
  }, [getIdIndex, focusIds]);

  return <>{table}</>;
};

DataTableComponent.defaultProps = {
  TableBodyProps: {
    sx: {
      "& .Mui-active, .MuiTableRow-hover:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
  },
};

export default React.memo(DataTableComponent);
