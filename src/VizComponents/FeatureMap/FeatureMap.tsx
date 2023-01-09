import * as React from "react";

import VizComponentProvider, {
  VizComponentProviderProps,
} from "../VizComponentProvider";
import FeatureMapComponent, {
  FeatureMapComponentProps,
} from "./FeatureMapComponent";

export type FeatureMapProps = Omit<VizComponentProviderProps, "children"> &
  FeatureMapComponentProps;

const FeatureMap = (props: FeatureMapProps) => {
  const { groupBy, fields, linkActions, name } = props;
  return (
    <VizComponentProvider
      groupBy={groupBy}
      fields={fields}
      linkActions={linkActions}
      name={name}
    >
      <FeatureMapComponent {...props} />
    </VizComponentProvider>
  );
};

export default React.memo(FeatureMap);
