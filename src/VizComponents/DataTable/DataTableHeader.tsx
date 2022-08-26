import * as React from "react";
import VizComponentContext from "../VizComponentContext";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

interface DataTableHeaderProps {
  fields: any[];
}

const DataTableHeaderCell = (props: any) => {
  const { field } = props;
  const { handleUpdateSort, sort } = React.useContext(VizComponentContext);

  const currentSort = React.useMemo(
    () => (Object.keys(sort).includes(field) ? sort[field] : null),
    [sort]
  );

  const updateSort = React.useCallback(
    (e: any) => {
      handleUpdateSort(e, { [field]: currentSort === "asc" ? "desc" : "asc" });
    },
    [currentSort]
  );

  return (
    <TableCell sx={{ background: "white" }}>
      <Box display="flex" flexDirection="row">
        <Typography variant="subtitle1">{field}</Typography>
        <IconButton
          onClick={updateSort}
          color={currentSort && true ? "primary" : "default"}
          size="small"
        >
          <ArrowDropUpIcon
            sx={{
              transform:
                currentSort === "desc" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all 0.3s ease-out",
            }}
            fontSize="inherit"
          />
        </IconButton>
      </Box>
    </TableCell>
  );
};

const DataTableRow = (props: DataTableHeaderProps) => {
  const { fields } = props;
  return (
    <TableRow>
      {fields.map((v: any) => (
        <DataTableHeaderCell key={`header-cell-${v}`} field={v} />
      ))}
    </TableRow>
  );
};

export default React.memo(DataTableRow);
