import * as React from "react";
import TableRow, {
  TableRowProps as MuiTableRowProps,
} from "@mui/material/TableRow";
import VizComponentContext from "../VizComponentContext";
import { VizContext } from "../../VizContext";

export interface TableRowProps
  extends Omit<MuiTableRowProps, "children" | "hover"> {
  hover?: boolean;
  select?: boolean;
  ref?: any;
  children: any;
}

const DataTableRowWrapper = (props: TableRowProps) => {
  const { children, hover, select } = props;
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

  const row = React.useMemo(() => {
    return (
      <TableRow
        {...props}
        className={hover && isHovered && "Mui-active"}
        selected={isSelected}
        hover={hover}
        onClick={select && handleRowClick}
        onMouseOver={hover && onMouseOver}
        onMouseOut={hover && onMouseOut}
      />
    );
  }, [isSelected, isHovered, hover, select]);

  return <>{row}</>;
};

DataTableRowWrapper.defaultProps = {
  hover: true,
  select: true,
};

export default React.memo(DataTableRowWrapper);
