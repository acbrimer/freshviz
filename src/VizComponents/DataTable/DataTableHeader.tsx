import * as React from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import VizComponentContext, {
  VizComponentFieldDefinition,
} from "../VizComponentContext";

import DataTableSortButton from "./DataTableSortButton";

interface DataTableHeaderCellProps {
  field: VizComponentFieldDefinition;
}

const DataTableHeaderCell = (props: DataTableHeaderCellProps) => {
  const { field } = props;

  return (
    <TableCell sx={{ background: "white" }}>
      <Box display="flex" flexDirection="row">
        <Box display="inline-flex" flexGrow={1} alignSelf="flex-end">
          <Typography variant="caption">{field.label}</Typography>
        </Box>
        <Box
          display="inline-flex"
          alignSelf="center"
          maxHeight={28}
          flexGrow={1}
          width={28}
          maxWidth={28}
        >
          <DataTableSortButton field={field} />
        </Box>
      </Box>
    </TableCell>
  );
};

const DataTableRow = () => {
  const { fieldDefinitions } = React.useContext(VizComponentContext);

  React.useEffect(() => {
    console.log("fieldDefinitions", fieldDefinitions);
  }, [fieldDefinitions]);
  return (
    <TableRow>
      {fieldDefinitions.map((v: VizComponentFieldDefinition) => (
        <DataTableHeaderCell key={`header-cell-${v}`} field={v} />
      ))}
    </TableRow>
  );
};

export default React.memo(DataTableRow);
