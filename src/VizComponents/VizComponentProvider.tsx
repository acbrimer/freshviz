import * as React from "react";
import * as _ from "lodash";
import VizContext, {
  VizContextState,
  VizDataFieldsObject,
  VizActionState,
} from "../VizContext/VizContext";
import VizComponentContext, {
  VizComponentContextState,
} from "./VizComponentContext";
import { applyFilterItem, filterData, FilterItemProps } from "../util/filters";

export interface VizComponentLinkActionProps {
  /**The `name` of the component triggering action  */
  source: string;
  /**The action to listen for from `source` component */
  actionState: string;
  sourceField: string;
  targetField: string;
  op: string;
  targetAction: string;
}

export interface VizComponentProviderProps {
  name?: string;
  groupBy: string;
  fields: VizDataFieldsObject;
  children: JSX.Element | JSX.Element[];
  linkActions?: VizComponentLinkActionProps[];
}

export type VizComponentProps = VizComponentProviderProps &
  VizComponentContextState;

const getActionStateFilter = (f: any) => ({
  field: f.targetField,
  op: f.op,
  value: f.s.data[f.sourceField],
});

const VizComponentProvider = (props: any) => {
  const { groupBy, fields, name, linkActions } = props;
  const dvc = React.useContext(VizContext);
  const {
    handleRemoveActionState,
    handleAddActionState,
    actionStates,
    getData,
    getFilterIds,
  } = dvc;

  const [hoverFilterItems, setHoverFilterItems] = React.useState<any>([]);
  const [innerFilterFilterItems, setInnerFilterFilterItems] =
    React.useState<any>([]);
  const [filterFilterItems, setFilterFilterItems] = React.useState<any>([]);
  const [selectedFilterItems, setSelectedFilterItems] = React.useState<any>([]);

  const innerFilterIds = React.useMemo(
    () =>
      innerFilterFilterItems.length === 0
        ? null
        : getFilterIds(innerFilterFilterItems),
    [innerFilterFilterItems]
  );

  const data = React.useMemo(
    () =>
      filterData(
        getData(groupBy, fields, true, innerFilterIds),
        filterFilterItems
      ),
    [fields, getData, groupBy, innerFilterIds, filterFilterItems]
  );

  const getComponentFilterItemIds = React.useCallback(
    (filter: FilterItemProps) => applyFilterItem(data, groupBy, filter),
    [data]
  );

  const getComponentFilterIds = React.useCallback(
    (filters: FilterItemProps[]) =>
      _.intersection(
        filters.flatMap((fi: FilterItemProps) => getComponentFilterItemIds(fi))
      ),
    [getComponentFilterItemIds]
  );

  const hoveredIds = React.useMemo(
    () =>
      hoverFilterItems.length === 0
        ? []
        : getComponentFilterIds(hoverFilterItems),
    [hoverFilterItems]
  );

  const selectedIds = React.useMemo(
    () =>
      selectedFilterItems.length === 0
        ? []
        : getComponentFilterIds(selectedFilterItems),
    [selectedFilterItems]
  );

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
    const linkActionStates = linkActions
      .map((a: any) => ({
        ...a,
        s: _.find(actionStates, {
          source: a.source,
          actionState: a.actionState,
        }),
      }))
      .filter((a: any) => a.s && true);

    if (linkActionStates.length > 0) {
      // console.log(`${name} 'linkActionStates'`, linkActionStates)
      setHoverFilterItems(
        _.map(
          _.filter(linkActionStates, { targetAction: "hover" }),
          getActionStateFilter
        )
      );
      setInnerFilterFilterItems((c: any) =>
        _.map(
          _.filter(linkActionStates, { targetAction: "innerFilter" }),
          getActionStateFilter
        )
      );
      setFilterFilterItems((c: any) =>
        _.map(
          _.filter(linkActionStates, { targetAction: "filter" }),
          getActionStateFilter
        )
      );
      setSelectedFilterItems((c: any) =>
        _.map(
          _.filter(linkActionStates, { targetAction: "select" }),
          getActionStateFilter
        )
      );
    } else {
      setHoverFilterItems((c: any) => (c.length === 0 ? c : []));
      setInnerFilterFilterItems((c: any) => (c.length === 0 ? c : []));
      setFilterFilterItems((c: any) => (c.length === 0 ? c : []));
      setSelectedFilterItems((c: any) => (c.length === 0 ? c : []));
    }
  }, [actionStates, linkActions]);

  return (
    <VizComponentContext.Provider
      value={{
        name: componentName,
        data: data,
        groupBy: groupBy,
        hoveredIds: hoveredIds,
        selectedIds: selectedIds,
        handleMouseOver: handleMouseOver,
        handleMouseOut: handleMouseOut,
      }}
    >
      {props.children}
    </VizComponentContext.Provider>
  );
};

export default React.memo(VizComponentProvider);
