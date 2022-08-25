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

const getActionStateFilter = (f: any) =>
  f.s.length > 0
    ? {
        field: f.targetField,
        op: f.op,
        value: _.map(f.s, (v: any) => v.data[f.sourceField]),
      }
    : {
        field: f.targetField,
        op: f.op,
        value: f.s[0].data[f.sourceField],
      };

interface TargetActionItemProps {
  source: string;
  target: string;
  id: any;
  data: any;
  op: string;
  sourceField: string;
  targetField: string;
}
const getActionFilters = (targetActions: TargetActionItemProps[]) => {
  let operators = _.groupBy(targetActions, "op.targetField");

  const r = Object.keys(operators).reduce((acc: any, c: any) => {
    return { ...acc };
  }, {});

  return operators;
};

const VizComponentProvider = (props: any) => {
  const { groupBy, fields, name, linkActions } = props;
  const dvc = React.useContext(VizContext);
  const {
    hoveredRecords,
    handleAddHoveredRecord,
    handleRemoveHoveredRecord,
    handleClearHoveredRecords,
    selectedRecords,
    handleToggleSelectedRecord,
    handleAddSelectedRecord,
    handleRemoveSelectedRecord,
    handleClearSelectedRecords,
    getData,
    getFilterIds,
  } = dvc;

  const [hoverFilterItems, setHoverFilterItems] = React.useState<any>([]);
  const [innerFilterFilterItems, setInnerFilterFilterItems] =
    React.useState<any>([]);
  const [filterFilterItems, setFilterFilterItems] = React.useState<any>([]);
  const [selectedFilterItems, setSelectedFilterItems] = React.useState<any>([]);

  const [selectActionIds, setSelectActionIds] = React.useState<any>([]);
  const [hoverActionIds, setHoverActionIds] = React.useState<any>([]);

  const innerFilterIds = React.useMemo(
    () =>
      innerFilterFilterItems.length === 0
        ? null
        : getFilterIds(innerFilterFilterItems),
    [innerFilterFilterItems]
  );

  const data = React.useMemo(
    () =>
      filterFilterItems && filterFilterItems.length > 0
        ? filterData(
            getData(groupBy, fields, true, innerFilterIds),
            filterFilterItems
          )
        : getData(groupBy, fields, true, innerFilterIds),
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
      hoverActionIds.length === 0
        ? []
        : _.difference(
            _.intersection(
              _.reject(hoverActionIds, { exculde: true }).flatMap(
                (v: any) => v.ids
              )
            ),
            _.intersection(
              _.filter(hoverActionIds, { exculde: true }).map((v: any) => v.ids)
            )
          ),
    [hoverActionIds]
  );

  const selectedIds = React.useMemo(
    () =>
      selectActionIds.length === 0
        ? []
        : _.difference(
            _.intersection(
              _.reject(selectActionIds, { exculde: true }).flatMap(
                (v: any) => v.ids
              )
            ),
            _.intersection(
              _.filter(selectActionIds, { exculde: true }).map(
                (v: any) => v.ids
              )
            )
          ),
    [selectActionIds]
  );

  const componentName = React.useMemo(
    () => name || `${groupBy}_${Math.round(Math.random() * 100)}`,
    [groupBy, name]
  );

  const handleClick = React.useCallback(
    (e: any, data: any) => {
      handleToggleSelectedRecord(componentName, data[groupBy], data);
    },
    [componentName, groupBy]
  );

  const handleMouseOver = React.useCallback(
    (e: any, data: any) => {
      handleAddHoveredRecord(componentName, data[groupBy], data);
    },
    [componentName, groupBy]
  );

  const handleMouseOut = React.useCallback(
    (e: any, data: any) => {
      handleRemoveHoveredRecord(componentName, data[groupBy]);
    },
    [componentName, groupBy]
  );

  const hoveredLinkActions: VizComponentLinkActionProps[] = React.useMemo(
    () => _.filter(linkActions, { actionState: "hovered" }),
    [linkActions]
  );

  /** Handle updates from `hoveredRecords` */
  React.useLayoutEffect(() => {
    // get current `selectedRecords` w/ `linkActions` from current component
    const _hoveredRecords = hoveredLinkActions.flatMap((link: any) =>
      _.map(_.filter(hoveredRecords, { source: link.source }), (r: any) => ({
        ...link,
        ...r,
      }))
    );

    if (_hoveredRecords.length > 0) {
      const targetActions = _.groupBy(_hoveredRecords, "targetAction");
      // set hoveredActionIds
      if (_.has(targetActions, "select")) {
        setSelectActionIds((current: any) => [
          ..._.reject(current, { sourceAction: "hovered" }),
          ...targetActions.select.flatMap((s: any) => ({
            sourceAction: "hovered",
            exclude: s.op.startsWith("x"),
            ids:
              s.source === componentName
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
          ..._.reject(current, { sourceAction: "hovered" }),
          ...targetActions.hover.flatMap((s: any) => ({
            sourceAction: "hovered",
            exclude: s.op.startsWith("x"),
            ids:
              s.source === componentName
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
    } else {
      setSelectActionIds((current: any) =>
        _.reject(current, { sourceAction: "hovered" })
      );
      setHoverActionIds((current: any) =>
        _.reject(current, { sourceAction: "hovered" })
      );
    }
  }, [hoveredLinkActions, hoveredRecords]);

  const selectedLinkActions: VizComponentLinkActionProps[] =
    React.useMemo(() => {
      return [
        {
          actionState: "selected",
          op: "eq",
          source: componentName,
          sourceField: groupBy,
          targetAction: "select",
          targetField: groupBy,
        },
        ..._.filter(linkActions, { actionState: "selected" }),
      ];
    }, [linkActions]);

  /** Handle updates from `selectedRecords` */
  React.useLayoutEffect(() => {
    // get current `selectedRecords` w/ `linkActions` from current component
    const _selectedRecords = selectedLinkActions.flatMap((link: any) =>
      _.map(_.filter(selectedRecords, { source: link.source }), (r: any) => ({
        ...link,
        ...r,
      }))
    );

    if (_selectedRecords.length > 0) {
      const targetActions = _.groupBy(_selectedRecords, "targetAction");
      // set selectActionIds
      if (_.has(targetActions, "select")) {
        setSelectActionIds((current: any) => [
          ..._.reject(current, { sourceAction: "selected" }),
          ...targetActions.select.flatMap((s: any) => ({
            sourceAction: "selected",
            exclude: s.op.startsWith("x"),
            ids:
              s.source === componentName
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
          ..._.reject(current, { sourceAction: "selected" }),
          ...targetActions.hover.flatMap((s: any) => ({
            sourceAction: "selected",
            exclude: s.op.startsWith("x"),
            ids:
              s.source === componentName
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
    } else {
      setSelectActionIds((current: any) =>
        _.reject(current, { sourceAction: "selected" })
      );
      setHoverActionIds((current: any) =>
        _.reject(current, { sourceAction: "selected" })
      );
    }
  }, [selectedLinkActions, selectedRecords]);

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
        handleClick: handleClick,
      }}
    >
      {props.children}
    </VizComponentContext.Provider>
  );
};

export default React.memo(VizComponentProvider);
