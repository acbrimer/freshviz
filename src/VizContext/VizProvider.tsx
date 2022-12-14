import * as React from "react";
import VizContext, {
  VizFieldFunctionType,
  VizActionState,
  VizComponentRecordState,
  VizCalculatedFieldsObject,
  VizComponentSortState,
  VizSortState,
} from "./VizContext";
import * as _ from "lodash";
import { flatten, unflatten } from "flattenizer";
import AGG_FUNCTIONS, { aggFieldName } from "./vizFieldFunctions";
import { FilterItemProps, applyFilterItem } from "../util/filters";

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

  const [componentSortStates, setComponentSortStates] = React.useState<
    VizComponentSortState[]
  >([]);

  const updateComponentSort = React.useCallback(
    (component: string, sort: VizSortState) => {
      setComponentSortStates((current) =>
        _.find(current, { component: component })
          ? [
              ..._.reject(current, { component: component }),
              { component: component, sort: sort },
            ]
          : [...current, { component: component, sort: sort }]
      );
    },
    []
  );

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
        Object.keys(fields[k])
          .filter((a: any) => a !== "zs")
          .map((a: string) => ({
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

      const dataFieldFunctions = Object.fromEntries(
        _.flatten(
          Object.keys(dataFields).map((df: string) =>
            dataFields[df].map((f: any) => [f.name, f.fn])
          )
        )
      );

      const dataFieldMap = Object.keys(dataFields).flatMap(
        (f: any) => dataFields[f]
      );

      const g = _.groupBy(
        (innerFilterIds && Array.isArray(innerFilterIds)
          ? _.filter(records, (v: any) => innerFilterIds.includes(v[idField]))
          : records
        ).map((v) =>
          flatten(
            Object.fromEntries(
              dataFieldMap.map((df: any) => [df.name, v[df.field]])
            )
          )
        ),
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
      let d = _.map(
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
      const applyZscores = Object.keys(fields)
        .filter((f: string) => _.has(fields[f], "zs"))
        .map((f: any) => ({
          field: f,
          name: fields[f].zs === true ? f : fields[f].zs,
          avg: AGG_FUNCTIONS.avg(d.map((r: any) => r[f])),
          stdev: AGG_FUNCTIONS.stdev(d.map((r: any) => r[f])),
        }));

      if (applyZscores && applyZscores.length > 0) {
        return d.map((r: any) => ({
          ...r,
          ...Object.fromEntries(
            applyZscores.map((zf: any) => [
              zf.name,
              (r[zf.field] - zf.avg) / zf.stdev,
            ])
          ),
        }));
      }

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
    return () => {
      console.log("unmount state", {
        selectedRecords,
        hoveredRecords,
        componentSortStates,
      });
    };
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
        componentSortStates: componentSortStates,
        updateComponentSort: updateComponentSort,
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
