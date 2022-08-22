import * as React from "react";
import * as _ from "lodash";
import VizContext, {
  VizDataFieldsObject,
  VizActionState,
} from "../VizContext/VizContext";
import VizComponentContext from "./VizComponentContext";

export interface VizComponentLinkActionProps {
  /**The `name` of the component triggering action  */
  source: string;
  /**The action to listen for from `source` component */
  action: string;
}

export interface VizComponentProviderProps {
  name?: string;
  groupBy: string;
  fields: VizDataFieldsObject;
  children: JSX.Element | JSX.Element[];
  linkActions?: VizComponentLinkActionProps[];
}

const VizComponentProvider = (props: any) => {
  const { groupBy, fields, name, linkActions } = props;
  const dvc = React.useContext(VizContext);
  const {
    handleRemoveActionState,
    handleAddActionState,
    actionStates,
    getData,
  } = dvc;

  const data = React.useMemo(
    () => getData(groupBy, fields, true),
    [fields, getData, groupBy]
  );

  const [hoveredIds, setHoveredIds] = React.useState<any>([]);

  const componentName = React.useMemo(
    () => name || `${groupBy}_${Math.round(Math.random() * 100)}`,
    [groupBy, name]
  );

  const handleMouseOver = React.useCallback(
    (e: any, data: any) => {
      handleAddActionState({
        source: componentName,
        actionState: "hovered",
        id: data[groupBy],
        data: data,
      });
    },
    [handleAddActionState, componentName, groupBy]
  );

  const handleMouseOut = React.useCallback(
    (e: any, data: any) => {
      handleRemoveActionState({
        source: componentName,
        actionState: "hovered",
        id: data[groupBy],
        data: data,
      });
    },
    [componentName, groupBy, handleRemoveActionState]
  );

  React.useLayoutEffect(() => {
    if (linkActions && linkActions.length > 0) {
      const hoveredActions = linkActions
        .filter((a: any) => a.actionState === "hovered")
        .map((a: any) => ({
          ...a,
          s: _.find(actionStates, {
            source: a.source,
            actionState: a.actionState,
          }),
        }))
        .filter((a: any) => a.s && true);

      setHoveredIds(
        _.intersection(
          hoveredActions.flatMap((a: any) =>
            _.map(
              _.filter(data, { [a.targetField]: a.s.data[a.sourceField] }),
              (d: any) => d[groupBy]
            )
          )
        )
      );
    }
  }, [componentName, actionStates, linkActions, data, groupBy]);

  return (
    <VizComponentContext.Provider
      value={{
        name: componentName,
        data: data,
        groupBy: groupBy,
        hoveredIds: hoveredIds,
        handleMouseOver: handleMouseOver,
        handleMouseOut: handleMouseOut,
      }}
    >
      {props.children}
    </VizComponentContext.Provider>
  );
};

export default React.memo(VizComponentProvider);
