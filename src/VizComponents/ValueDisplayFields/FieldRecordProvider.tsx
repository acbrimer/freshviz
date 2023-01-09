import * as React from "react";

export const FieldRecordContext = React.createContext({ record: {} });

export interface FieldRecordProviderProps {
  record: any;
  children: JSX.Element | JSX.Element[];
}
const FieldRecordProvider = (props: FieldRecordProviderProps) => {
  return (
    <FieldRecordContext.Provider value={{ record: props.record }}>
      {props.children}
    </FieldRecordContext.Provider>
  );
};

export const withFieldRecordContext = (Component: any) => {
  return (props: any) => {
    return (
      <FieldRecordContext.Consumer>
        {(context: any) => (
          <>
            {context.record[props.source] ? (
              <Component {...props} {...context} />
            ) : (
              <p>-</p>
            )}
          </>
        )}
      </FieldRecordContext.Consumer>
    );
  };
};

export default React.memo(FieldRecordProvider);
