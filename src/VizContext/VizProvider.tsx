import * as React from "react";
import VizContext, {
  VizRecordsObject,
  VizFieldFunctionType,
  VizRecordState,
  VizActionState,
} from "./VizContext";
import * as _ from "lodash";
import { flatten, unflatten } from "flattenizer";
import AGG_FUNCTIONS from "./vizFieldFunctions";

/**
 * aggFieldName
 * Needed to pepend agg in correct place for flattened array/nested values
 * Example:
 * `('name', 'value') -> 'name'`
 *
 * `('height', 'avg') -> '__AVG__height'`
 *
 * `('orders.*.tot_price', 'sum') -> 'orders.*.__SUM__tot_price`
 * @param f the name of the field
 * @param agg the aggregation method
 * @returns name of field with prepended __{agg}__
 */
const aggFieldName = (f: string, agg: string) =>
  agg === "value"
    ? f
    : f.includes(".")
    ? `__${agg}__${_.last(f.split("."))}`
    : `__${agg}__${f}`;

/**
 * applyAggregates
 * @param data
 * @returns flattened
 */
const applyAggregates = (data: any[], fieldFunctions: any) =>
  Object.fromEntries(
    Object.keys(data[0]).map((k: string) => [
      k,
      fieldFunctions[k] && true
        ? fieldFunctions[k](data.map((r: any) => r[k]))
        : data[0][k],
    ])
  );

const getRegExp = (field: string) => {
  if (field.includes(".*.")) {
    return new RegExp("\\b^" + field.replace(".*.", "\\.\\d\\.") + "$\\b", "g");
  }
  return new RegExp(`\\b^${field}$\\b`);
};

interface VizProviderProps {
  isLoading: boolean;
  data: any[];
  idField: string;
  globalIdField?: string;
  children: JSX.Element | JSX.Element[];
}

const VizProvider = (props: VizProviderProps) => {
  const { data, idField, globalIdField } = props;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [records, setRecords] = React.useState<VizRecordState[]>([]);
  const [ids, setIds] = React.useState<any>([]);
  const [filterIds, setFilterIds] = React.useState<any>([]);
  const [hoveredIds, setHoveredIds] = React.useState<any>([]);
  const [actionStates, setActionStates] = React.useState<VizActionState[]>([]);

  const onMouseOver = (id: any) => {
    if (Array.isArray(id)) {
      // @ts-ignore
      setHoveredIds(id);
    } else {
      // @ts-ignore
      setHoveredIds([id]);
    }
  };

  const onMouseOut = () => {
    setHoveredIds([]);
  };

  const handleAddActionState = React.useCallback((s: VizActionState) => {
    setActionStates((current: VizActionState[]) => [...current, s]);
  }, []);

  const handleRemoveActionState = React.useCallback((s: VizActionState) => {
    setActionStates((current: VizActionState[]) =>
      _.filter(
        current,
        (v: VizActionState) =>
          v.actionState !== s.actionState &&
          v.id !== s.id &&
          v.source !== s.source
      )
    );
  }, []);

  const getData = React.useCallback(
    (groupBy: string, aggFields: any, useFilter?: boolean) => {
      console.log("getData");
      const _aggFields = Object.keys(aggFields).flatMap((k: any) =>
        Object.keys(aggFields[k]).map((a: string) => ({
          field: k,
          agg: a,
          name: aggFields[k][a] === true ? aggFieldName(k, a) : aggFields[k][a],
          re: getRegExp(k),
          fn: _.has(AGG_FUNCTIONS, a)
            ? AGG_FUNCTIONS[a as VizFieldFunctionType]
            : null,
        }))
      );

      const pickFields = (val: any, k: string) =>
        _aggFields.filter((v: any) => k.match(v.re)).length > 0;

      let dataFields = Object.fromEntries(
        Object.keys(
          _.pickBy(flatten(Object.values(records)[0]) as any, pickFields)
        ).map((df: any) => [
          df,
          _aggFields
            .filter((af: any) => df.match(af.re))
            .map((f: any) => ({
              ...f,
              name: df.includes(".")
                ? `${df.split(".").slice(0, -1).join(".")}.${f.name}`
                : f.name,
            })),
        ])
      );
      // add groupBy field
      dataFields[groupBy] = [{ field: groupBy, name: groupBy, agg: "value" }];

      let d = records
        .filter((r: any) => (useFilter ? filterIds.includes(r.id) : true))
        .map((r: any) => flatten(r));

      d = d.map((r: any, ix: number) =>
        Object.fromEntries(
          Object.keys(dataFields).flatMap((df: string) =>
            dataFields[df].map((f: any) => [f.name, r[df]])
          )
        )
      );

      const dataFieldFunctions = Object.fromEntries(
        _.flatten(
          Object.keys(dataFields).map((df: string) =>
            dataFields[df].map((f: any) => [f.name, f.fn])
          )
        )
      );

      const g = _.groupBy(d, groupBy);

      const res = Object.keys(g).map((k: any) =>
        unflatten(applyAggregates(g[k], dataFieldFunctions))
      );

      return res;
    },
    [filterIds, records]
  );

  const updateFilter = () => {
    if (filterIds.length === ids.length) {
      const _filterIds = _.shuffle([...ids]).slice(
        0,
        Math.round(Math.random() * 1000)
      );
      setHoveredIds([]);
      setFilterIds(_filterIds);
    } else {
      setFilterIds(ids);
    }
  };

  React.useEffect(() => {
    if (data) {
      setIds(data.map((d: any) => d[idField]));
      setFilterIds(data.map((d: any) => d[idField]));
      setRecords(
        data.map(
          (d: any) =>
            ({
              ...d,
              id: d[idField],
              global_id: d[globalIdField || "id"],
            } as VizRecordState)
        )
      );
      setIsLoading(false);
    }
  }, [data, globalIdField, idField]);

  if (props.isLoading || isLoading) {
    return <div>loading...</div>;
  }
  return (
    <VizContext.Provider
      value={{
        isLoading: isLoading,
        ids: ids,
        hoveredIds: hoveredIds,
        records: records,
        actionStates: actionStates,
        handleAddActionState: handleAddActionState,
        handleRemoveActionState: handleRemoveActionState,
        getData: getData,
        onMouseOut: onMouseOut,
        onMouseOver: onMouseOver,
        updateFilter: updateFilter,
      }}
    >
      {props.children}
    </VizContext.Provider>
  );
};

export default VizProvider;
