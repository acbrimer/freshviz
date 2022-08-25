import * as React from "react";

import TableRow from "@mui/material/TableRow";
import VizComponentContext from "../VizComponentContext";

const DataTableRowWrapper = (props: any) => {
  const { children } = props;
  const c = React.useContext(VizComponentContext);
  const {
    handleMouseOver,
    handleMouseOut,
    handleClick,
    selectedIds,
    hoveredIds,
    groupBy,
  } = c;
  const { record } = children.props;

  const handleRowClick = (e: any) => {
    handleClick(e, record);
  };

  const onMouseOver = (e: any) => {
    handleMouseOver(e, record);
  };

  const onMouseOut = (e: any) => {
    handleMouseOut(e, record);
  };

  const isSelected = React.useMemo(
    () => selectedIds.includes(record[groupBy]),
    [selectedIds]
  );

  const isHovered = React.useMemo(
    () => hoveredIds.includes(record[groupBy]),
    [hoveredIds]
  );

  const row = React.useMemo(
    () => (
      <TableRow
        {...props}
        sx={{ backgroundColor: isHovered ? "lightyellow" : "white" }}
        selected={isSelected}
        hover
        onClick={handleRowClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
    ),
    [isSelected, isHovered]
  );

  return <>{row}</>;
};

export default React.memo(DataTableRowWrapper);
