import * as React from "react";
import { ScatterPoint as ReavizScatterPoint } from "reaviz";
import VizComponentContext from "../VizComponentContext";

const ScatterPoint = (props: any) => {
  const { data } = props;
  const { key, metadata: record } = data;
  const c = React.useContext(VizComponentContext);
  const { handleMouseOver, handleMouseOut, hoveredIds, groupBy } = c;
  const id = record[groupBy];

  const [isHovered, setIsHovered] = React.useState<boolean>(false);

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

  React.useLayoutEffect(() => {
    setIsHovered(hoveredIds.includes(id));
  }, [hoveredIds, id]);

  return (
    <ReavizScatterPoint
      {...props}
      active={hoveredIds.length === 0 || isHovered}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOut}
    />
  );
};

export default React.memo(ScatterPoint);
