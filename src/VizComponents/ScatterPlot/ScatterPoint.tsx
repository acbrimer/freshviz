import * as React from "react";
import { ScatterPoint as ReavizScatterPoint } from "reaviz";
import VizComponentContext from "../VizComponentContext";

const ScatterPoint = (props: any) => {
  const c = React.useContext(VizComponentContext);
  const { handleMouseOver, handleMouseOut } = c;

  const onMouseOver = React.useCallback(
    async (pointData: any) => {
      handleMouseOver(null, pointData.metadata);
    },
    [handleMouseOver]
  );

  const onMouseOut = React.useCallback(
    async (pointData: any) => {
      handleMouseOut(null, pointData.metadata);
    },
    [handleMouseOut]
  );

  return (
    <ReavizScatterPoint
      {...props}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOut}
    />
  );
};

export default React.memo(ScatterPoint);
