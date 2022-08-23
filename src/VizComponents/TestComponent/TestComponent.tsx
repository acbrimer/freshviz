import * as React from "react";
import VizComponentContext from "../VizComponentContext";
import VizComponentProvider, {
  VizComponentProps,
  VizComponentProviderProps,
} from "../VizComponentProvider";
import withVizComponentContext from "../withVizComponentContext";

export interface TestComponentProps extends VizComponentProviderProps {
  testComponentStyle?: string;
}

const InnerComponent = () => {
  const { data } = React.useContext(VizComponentContext);

  return (
    <div>
      <code>{JSON.stringify(data)}</code>
    </div>
  );
};

const TestComponent = (props: Omit<VizComponentProviderProps, "children">) => {
  const { groupBy, fields, linkActions, name } = props;
  return (
    <VizComponentProvider
      groupBy={groupBy}
      fields={fields}
      linkActions={linkActions}
      name={name}
    >
      <InnerComponent />
    </VizComponentProvider>
  );
};

export default TestComponent;
