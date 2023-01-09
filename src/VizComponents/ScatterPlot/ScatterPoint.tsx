import * as React from "react";
import { ScatterPoint as ReavizScatterPoint } from "reaviz";
import VizComponentContext from "../VizComponentContext";

const ScatterPoint = (props: any) => {
  const c = React.useContext(VizComponentContext);
  const {
    handleMouseOver,
    handleMouseOut,
    handleClick,
    selectedIds,
    hoveredIds,
    groupBy,
  } = c;

  const { metadata: record } = props.data;

  const onClick = (e: any) => {
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

  const isActive = React.useMemo(
    () => hoveredIds.length === 0 || hoveredIds.includes(record[groupBy]),
    [hoveredIds]
  );

  const point = React.useMemo(
    () => (
      <ReavizScatterPoint
        {...props}
        active={isActive}
        onClick={onClick}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
      />
    ),
    [isActive, isSelected]
  );

  return <>{point}</>;
};

export default React.memo(ScatterPoint);
