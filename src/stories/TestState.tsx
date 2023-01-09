import * as React from "react";
import { Box, Button } from "@mui/material";

const ComponentStateConsumer = (props: any) => {
  const { data, name } = props;
  React.useEffect(() => {
    console.log("ComponentStateConsumer", name);
  }, [name, data]);
  return (
    <div>
      <p>Name: {name}</p>
      <p>Data</p>
      <code>{JSON.stringify(data, null, "\t")}</code>
    </div>
  );
};

const StateContext = React.createContext({ randomUpdate: () => {}, data: {} });

const withStateContext = (Component: any) => {
  return (props: any) => {
    return (
      <StateContext.Consumer>
        {(context: any) => (
          <Component {...props} data={context.data[props.name]} />
        )}
      </StateContext.Consumer>
    );
  };
};

const TestComp = withStateContext(ComponentStateConsumer);

const StateProvider = (props: any) => {
  const [state, setState] = React.useState({
    testcomp_1: {},
    testcomp_2: {},
  });

  const randomUpdate = () => {
    const r = Math.round(Math.random() * 10);
    const v =
      r <= 3
        ? { string: "Random string!!!" }
        : r >= 4 && r <= 6
        ? { number: Math.random() }
        : { hello: "world", number: 120 };
    if (Math.random() > 0.5) {
      setState((c) => ({ ...c, testcomp_1: Math.random() > 0.3 ? v : {} }));
    } else {
      setState((c) => ({ ...c, testcomp_2: Math.random() > 0.3 ? v : {} }));
    }
  };
  return (
    <StateContext.Provider value={{ data: state, randomUpdate: randomUpdate }}>
      {props.children}
    </StateContext.Provider>
  );
};

const TestComponent = (props: any) => {
  const { randomUpdate } = React.useContext(StateContext);
  return (
    <Box>
      <Box>
        <Button onClick={randomUpdate}>Random update</Button>
      </Box>
      <Box>
        <TestComp name="testcomp_1" />
        <TestComp name="testcomp_2" />
      </Box>
    </Box>
  );
};

const TestState = () => {
  return (
    <StateProvider>
      <TestComponent />
    </StateProvider>
  );
};

export default TestState;
