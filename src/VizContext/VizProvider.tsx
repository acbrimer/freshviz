import * as React from "react";
import VizContext, {
  VizFieldFunctionType,
  VizActionState,
  VizComponentRecordState,
  VizCalculatedFieldsObject,
} from "./VizContext";
import * as _ from "lodash";
import { flatten, unflatten } from "flattenizer";
import AGG_FUNCTIONS from "./vizFieldFunctions";
import { FilterItemProps, applyFilterItem } from "../util/filters";

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
  const [records, setRecords] = React.useState<any[]>([]);
  const [ids, setIds] = React.useState<any>([]);
  const [hoveredRecords, setHoveredRecords] = React.useState<
    VizComponentRecordState[]
  >([]);
  const [selectedRecords, setSelectedRecords] = React.useState<
    VizComponentRecordState[]
  >([]);
  const [actionStates, setActionStates] = React.useState<VizActionState[]>([]);

  const handleToggleSelectedRecord = React.useCallback(
    (source: string, id: number | string, data: any) => {
      setSelectedRecords((current) =>
        _.find(current, { source: source, id: id })
          ? _.reject(current, { source: source, id: id })
          : [...current, { source, id, data }]
      );
    },
    []
  );

  const handleAddSelectedRecord = React.useCallback(
    (source: string, id: number | string, data: any) => {
      setSelectedRecords((current) =>
        _.find(current, { source: source, id: id })
          ? current
          : [...current, { source, id, data }]
      );
    },
    []
  );

  const handleRemoveSelectedRecord = React.useCallback(
    (source: string, id: number | string) => {
      setSelectedRecords((current) =>
        _.find(current, { source: source, id: id })
          ? _.reject(current, { source: source, id: id })
          : current
      );
    },
    []
  );

  const handleClearSelectedRecords = React.useCallback((source?: string) => {
    if (source) {
      setSelectedRecords((current) =>
        _.find(current, { source: source })
          ? _.reject(current, { source: source })
          : current
      );
    } else {
      setSelectedRecords([]);
    }
  }, []);

  const handleAddHoveredRecord = React.useCallback(
    (source: string, id: number | string, data: any) => {
      setHoveredRecords((current) =>
        _.find(current, { source: source, id: id })
          ? current
          : [...current, { source, id, data }]
      );
    },
    []
  );

  const handleRemoveHoveredRecord = React.useCallback(
    (source: string, id: number | string) => {
      setHoveredRecords((current) =>
        _.find(current, { source: source, id: id })
          ? _.reject(current, { source: source, id: id })
          : current
      );
    },
    []
  );

  const handleClearHoveredRecords = React.useCallback((source?: string) => {
    if (source) {
      setHoveredRecords((current) =>
        _.find(current, { source: source })
          ? _.reject(current, { source: source })
          : current
      );
    } else {
      setHoveredRecords([]);
    }
  }, []);

  const getFilterItemIds = React.useCallback(
    (filter: FilterItemProps) => applyFilterItem(records, idField, filter),
    [records]
  );

  const getFilterIds = React.useCallback(
    (filters: FilterItemProps[]) =>
      _.intersection(
        filters.flatMap((fi: FilterItemProps) => getFilterItemIds(fi))
      ),
    [getFilterItemIds]
  );

  const getAggregateData = React.useCallback(
    (groupBy: string, fields: any, innerFilterIds?: any[]) => {
      const aggFields = Object.keys(fields).flatMap((k: any) =>
        Object.keys(fields[k]).map((a: string) => ({
          field: k,
          agg: a,
          name: fields[k][a] === true ? aggFieldName(k, a) : fields[k][a],
          re: getRegExp(k),
          fn: _.has(AGG_FUNCTIONS, a)
            ? AGG_FUNCTIONS[a as VizFieldFunctionType]
            : null,
        }))
      );

      const pickFields = (val: any, k: string) =>
        aggFields.filter((v: any) => k.match(v.re)).length > 0;

      let dataFields = Object.fromEntries(
        Object.keys(
          _.pickBy(flatten(Object.values(records)[0]) as any, pickFields)
        ).map((df: any) => [
          df,
          aggFields
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

      // let d = (
      //   innerFilterIds && Array.isArray(innerFilterIds)
      //     ? _.filter(records, (v: any) => innerFilterIds.includes(v[idField]))
      //     : records
      // ).map((v) => _.pick(flatten(v), Object.keys(dataFields)));

      const dataFieldFunctions = Object.fromEntries(
        _.flatten(
          Object.keys(dataFields).map((df: string) =>
            dataFields[df].map((f: any) => [f.name, f.fn])
          )
        )
      );

      const g = _.groupBy(
        (innerFilterIds && Array.isArray(innerFilterIds)
          ? _.filter(records, (v: any) => innerFilterIds.includes(v[idField]))
          : records
        ).map((v) => _.pick(flatten(v), Object.keys(dataFields))),
        groupBy
      );

      return Object.keys(g).map((k: any) =>
        unflatten(applyAggregates(g[k], dataFieldFunctions))
      );
    },
    [records, idField]
  );

  const getData = React.useCallback(
    (
      groupBy: string,
      fields: any,
      innerFilterIds?: any[],
      calculatedFields?: VizCalculatedFieldsObject,
      select?: (data: any[]) => any[]
    ) => {
      const fieldNames = [idField, ...Object.keys(fields)];
      // console.log("records", records[0]);
      console.log("calculatedFields", calculatedFields);
      const d = _.map(
        groupBy === idField
          ? _.map(records, (v: any) => _.pick(v, fieldNames))
          : getAggregateData(groupBy, fields, innerFilterIds),
        (r: any) =>
          calculatedFields && true
            ? {
                ...r,
                ...Object.fromEntries(
                  Object.keys(calculatedFields).map((field: string) => [
                    field,
                    calculatedFields[field].fn(r),
                  ])
                ),
              }
            : r
      );
      console.log("d", d);
      return d;
    },
    [records]
  );

  React.useEffect(() => {
    if (data) {
      setIds(data.map((d: any) => d[idField]));
      setRecords(
        data.map((d: any) => ({
          ...d,
          id: d[idField],
          global_id: d[globalIdField || "id"],
        }))
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
        records: records,
        hoveredRecords: hoveredRecords,

        handleAddHoveredRecord: handleAddHoveredRecord,
        handleRemoveHoveredRecord: handleRemoveHoveredRecord,
        handleClearHoveredRecords: handleClearHoveredRecords,
        selectedRecords: selectedRecords,
        handleToggleSelectedRecord: handleToggleSelectedRecord,
        handleAddSelectedRecord: handleAddSelectedRecord,
        handleRemoveSelectedRecord: handleRemoveSelectedRecord,
        handleClearSelectedRecords: handleClearSelectedRecords,
        getFilterItemIds: getFilterItemIds,
        getFilterIds: getFilterIds,
        getData: getData,
      }}
    >
      {props.children}
    </VizContext.Provider>
  );
};

export default React.memo(VizProvider);
