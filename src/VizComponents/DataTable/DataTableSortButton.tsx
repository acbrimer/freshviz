import * as React from "react";
import VizComponentContext, {
  VizComponentFieldDefinition,
} from "../VizComponentContext";

import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export interface DataTableSortButtonProps {
  field: VizComponentFieldDefinition;
  color?: Pick<IconButtonProps, "color">;
  activeColor?: Pick<IconButtonProps, "color">;
  IconButtonProps?: Omit<IconButtonProps, "onClick" | "color">;
}

const DataTableSortButton = (props: any) => {
  const { field, color, activeColor, IconButtonProps } = props;
  const { handleUpdateSort, sort } = React.useContext(VizComponentContext);

  const currentSort = React.useMemo(
    () => (Object.keys(sort).includes(field.name) ? sort[field.name] : null),
    [sort]
  );

  const updateSort = React.useCallback(
    (e: any) => {
      handleUpdateSort(e, {
        [field.name]: currentSort === "asc" ? "desc" : "asc",
      });
    },
    [currentSort]
  );

  return (
    <IconButton
      size="small"
      {...IconButtonProps}
      onClick={updateSort}
      color={
        currentSort && true ? activeColor || "primary" : color || "default"
      }
    >
      <ArrowDropUpIcon
        sx={{
          transform: currentSort === "desc" ? "rotate(180deg)" : "rotate(0deg)",
          transition: "all 0.3s ease-out",
        }}
        fontSize="inherit"
      />
    </IconButton>
  );
};

export default DataTableSortButton;
