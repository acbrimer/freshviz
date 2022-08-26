import * as React from "react";
import * as _ from "lodash";
import VizContext, {
  VizContextState,
  VizDataFieldsObject,
  VizActionState,
  VizSortState,
  VizGetDataProps,
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

export interface VizComponentProviderProps extends VizGetDataProps {
  name: string;
  children: JSX.Element | JSX.Element[];
  linkActions?: VizComponentLinkActionProps[];
}

export type VizComponentProps = VizComponentProviderProps &
  VizComponentContextState;

interface TargetActionItemProps {
  source: string;
  target: string;
  id: any;
  data: any;
  op: string;
  sourceField: string;
  targetField: string;
}

const mergeActionFilterIds = (actionIds: any[]) =>
  actionIds.length === 0
    ? []
    : _.difference(
        _.intersection(
          _.reject(actionIds, { exculde: true }).flatMap((v: any) => v.ids)
        ),
        _.intersection(
          _.filter(actionIds, { exculde: true }).map((v: any) => v.ids)
        )
      );

const VizComponentProvider = (props: VizComponentProviderProps) => {
  const { name, groupBy, fields, calculatedFields, select, linkActions } =
    props;

  const dvc = React.useContext(VizContext);
  const {
    hoveredRecords,
    handleAddHoveredRecord,
    handleRemoveHoveredRecord,
    selectedRecords,
    handleToggleSelectedRecord,
    getData,
    getFilterItemIds,
    componentSortStates,
    updateComponentSort,
  } = dvc;

  const [selectActionIds, setSelectActionIds] = React.useState<any>([]);
  const [hoverActionIds, setHoverActionIds] = React.useState<any>([]);
  const [innerFilterActionIds, setInnerFilterActionIds] = React.useState<any>(
    []
  );
  const [filterActionIds, setFilterActionIds] = React.useState<any>([]);
  const [focusActionIds, setFocusActionIds] = React.useState<any>([]);

  const sort = React.useMemo(
    () =>
      (
        _.find(componentSortStates, { component: name }) || {
          component: name,
          sort: { [groupBy]: "asc" },
        }
      ).sort,
    [componentSortStates, name]
  );

  const handleUpdateSort = React.useCallback(
    (e: any, sort: VizSortState) => {
      updateComponentSort(name, sort);
    },
    [name]
  );

  const innerFilterIds = React.useMemo(
    () =>
      innerFilterActionIds.length === 0
        ? null
        : mergeActionFilterIds(innerFilterActionIds),
    [innerFilterActionIds]
  );

  const filterIds = React.useMemo(
    () =>
      filterActionIds.length === 0
        ? null
        : mergeActionFilterIds(filterActionIds),
    [filterActionIds]
  );

  const data = React.useMemo(
    () =>
      filterIds && true
        ? _.filter(
            getData(groupBy, fields, innerFilterIds, calculatedFields, select),
            (r: any) => filterIds.includes(r[groupBy])
          )
        : getData(groupBy, fields, innerFilterIds, calculatedFields, select),
    [fields, calculatedFields, getData, groupBy, innerFilterIds, filterIds]
  );

  const getComponentFilterItemIds = React.useCallback(
    (filter: FilterItemProps) => applyFilterItem(data, groupBy, filter),
    [data]
  );

  const hoveredIds = React.useMemo(
    () => mergeActionFilterIds(hoverActionIds),
    [hoverActionIds]
  );

  const focusIds = React.useMemo(
    () =>
      focusActionIds.length === 0 ? null : mergeActionFilterIds(focusActionIds),
    [focusActionIds]
  );

  const clearFocusActions = () => setFocusActionIds([]);

  const selectedIds = React.useMemo(
    () => mergeActionFilterIds(selectActionIds),
    [selectActionIds]
  );

  const handleClick = React.useCallback(
    (e: any, data: any) => {
      handleToggleSelectedRecord(name, data[groupBy], data);
    },
    [name, groupBy]
  );

  const handleMouseOver = React.useCallback(
    (e: any, data: any) => {
      handleAddHoveredRecord(name, data[groupBy], data);
    },
    [name, groupBy]
  );

  const handleMouseOut = React.useCallback(
    (e: any, data: any) => {
      handleRemoveHoveredRecord(name, data[groupBy]);
    },
    [name, groupBy]
  );

  const updateTargetActionIds = React.useCallback(
    (actions: any, sourceAction: string) => {
      if (actions.length > 0) {
        const targetActions = _.groupBy(actions, "targetAction");
        // set hoveredActionIds
        if (_.has(targetActions, "select")) {
          setSelectActionIds((current: any) => [
            ..._.reject(current, { sourceAction: sourceAction }),
            ...targetActions.select.flatMap((s: any) => ({
              sourceAction: sourceAction,
              exclude: s.op.startsWith("x"),
              ids:
                s.source === name
                  ? [s.id]
                  : getComponentFilterItemIds({
                      field: s.targetField,
                      // @ts-ignore
                      op: s.op as any,
                      value: s.data[s.sourceField] as any,
                    }),
            })),
          ]);
        }
        if (_.has(targetActions, "hover")) {
          setHoverActionIds((current: any) => [
            ..._.reject(current, { sourceAction: sourceAction }),
            ...targetActions.hover.flatMap((s: any) => ({
              sourceAction: sourceAction,
              exclude: s.op.startsWith("x"),
              ids:
                s.source === name
                  ? [s.id]
                  : getComponentFilterItemIds({
                      field: s.targetField,
                      // @ts-ignore
                      op: s.op as any,
                      value: s.data[s.sourceField] as any,
                    }),
            })),
          ]);
        }
        if (_.has(targetActions, "filter")) {
          setFilterActionIds((current: any) => [
            ..._.reject(current, { sourceAction: sourceAction }),
            ...targetActions.filter.flatMap((s: any) => ({
              sourceAction: sourceAction,
              exclude: s.op.startsWith("x"),
              ids:
                s.source === name
                  ? [s.id]
                  : getComponentFilterItemIds({
                      field: s.targetField,
                      // @ts-ignore
                      op: s.op as any,
                      value: s.data[s.sourceField] as any,
                    }),
            })),
          ]);
        }
        if (_.has(targetActions, "focus")) {
          setFocusActionIds((current: any) => [
            ..._.reject(current, { sourceAction: sourceAction }),
            ...targetActions.focus.flatMap((s: any) => ({
              sourceAction: sourceAction,
              exclude: s.op.startsWith("x"),
              ids:
                s.source === name
                  ? [s.id]
                  : getComponentFilterItemIds({
                      field: s.targetField,
                      // @ts-ignore
                      op: s.op as any,
                      value: s.data[s.sourceField] as any,
                    }),
            })),
          ]);
        }
        if (_.has(targetActions, "innerFilter")) {
          setInnerFilterActionIds((current: any) => [
            ..._.reject(current, { sourceAction: sourceAction }),
            ...targetActions.innerFilter.flatMap((s: any) => ({
              sourceAction: sourceAction,
              exclude: s.op.startsWith("x"),
              ids:
                s.source === name
                  ? [s.id]
                  : getFilterItemIds({
                      field: s.targetField,
                      // @ts-ignore
                      op: s.op as any,
                      value: s.data[s.sourceField] as any,
                    }),
            })),
          ]);
        }
      } else {
        setSelectActionIds((current: any) =>
          _.reject(current, { sourceAction: sourceAction })
        );
        setHoverActionIds((current: any) =>
          _.reject(current, { sourceAction: sourceAction })
        );
        setInnerFilterActionIds((current: any) =>
          _.reject(current, { sourceAction: sourceAction })
        );
        setFilterActionIds((current: any) =>
          _.reject(current, { sourceAction: sourceAction })
        );
        setFocusActionIds((current: any) =>
          _.reject(current, { sourceAction: sourceAction })
        );
      }
    },
    []
  );

  const hoveredLinkActions: VizComponentLinkActionProps[] = React.useMemo(
    () => _.filter(linkActions, { actionState: "hovered" }),
    [linkActions]
  );

  const selectedLinkActions: VizComponentLinkActionProps[] = React.useMemo(
    () => [
      {
        actionState: "selected",
        op: "eq",
        source: name,
        sourceField: groupBy,
        targetAction: "select",
        targetField: groupBy,
      },
      ..._.filter(linkActions, { actionState: "selected" }),
    ],
    [linkActions]
  );

  /** Handle updates from `hoveredRecords` */
  React.useLayoutEffect(() => {
    // get current `selectedRecords` w/ `linkActions` from current component
    const hoveredSourceActions = hoveredLinkActions.flatMap((link: any) =>
      _.map(_.filter(hoveredRecords, { source: link.source }), (r: any) => ({
        ...link,
        ...r,
      }))
    );
    updateTargetActionIds(hoveredSourceActions, "hovered");
  }, [hoveredLinkActions, hoveredRecords]);

  /** Handle updates from `selectedRecords` */
  React.useLayoutEffect(() => {
    // get current `selectedRecords` w/ `linkActions` from current component
    const selectedSourceActions = selectedLinkActions.flatMap((link: any) =>
      _.map(_.filter(selectedRecords, { source: link.source }), (r: any) => ({
        ...link,
        ...r,
      }))
    );
    updateTargetActionIds(selectedSourceActions, "selected");
  }, [selectedLinkActions, selectedRecords]);

  return (
    <VizComponentContext.Provider
      value={{
        name: name,
        data: data,
        groupBy: groupBy,
        sort: sort,
        focusIds: focusIds,
        clearFocusActions: clearFocusActions,
        handleUpdateSort: handleUpdateSort,
        hoveredIds: hoveredIds,
        selectedIds: selectedIds,
        handleMouseOver: handleMouseOver,
        handleMouseOut: handleMouseOut,
        handleClick: handleClick,
      }}
    >
      {props.children}
    </VizComponentContext.Provider>
  );
};

export default React.memo(VizComponentProvider);
