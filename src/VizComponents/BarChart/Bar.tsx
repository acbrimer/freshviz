import * as React from "react";
import { Bar as ReavizBar } from "reaviz";
import VizComponentContext from "../VizComponentContext";

const Bar = React.memo((props: any) => {
  const { data } = props;
  const { key: id, metadata: record } = data;
  const c = React.useContext(VizComponentContext);
  const { handleMouseOver, handleMouseOut, hoveredIds } = c;

  const onMouseOver = React.useCallback(
    async (e: any) => {
      handleMouseOver(e, record);
    },
    [handleMouseOver, record]
  );

  const onMouseOut = React.useCallback(
    async (e: any) => {
      handleMouseOut(e, record);
    },
    [handleMouseOut, record]
  );

  const isHovered = React.useMemo(
    () => hoveredIds.includes(id),
    [hoveredIds, id]
  );
  return (
    <ReavizBar
      {...props}
      active={isHovered}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOut}
    />
  );
});

export default Bar;
