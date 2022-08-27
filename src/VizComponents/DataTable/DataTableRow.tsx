import * as React from "react";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { VizComponentFieldDefinition } from "../VizComponentContext";

interface DataTableRowProps {
  record: any;
  ix: number;
  fieldDefinitions: VizComponentFieldDefinition[];
}
const DataTableRow = (props: DataTableRowProps) => {
  const { record, fieldDefinitions } = props;
  return (
    <>
      {fieldDefinitions.map((field: VizComponentFieldDefinition) => (
        <TableCell>
          {React.createElement(field.valueComponent, {
            value: record[field.name],
            source: field.name,
            valueType: field.valueType,
          })}
        </TableCell>
      ))}
    </>
  );
};

export default React.memo(DataTableRow);
