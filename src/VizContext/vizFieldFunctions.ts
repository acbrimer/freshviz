import * as _ from "lodash";
import { VizDataFieldFuctionsObject } from "./VizContext";

const countFn = (vals: any[]) => {
  //   console.log("count", vals);

  return vals.length;
};
// @ts-ignore
const countDistinctFn = (vals: any[]) => [...new Set(vals)].length;

export const stdevFn = (vals: any[]) => {
  const avg = _.mean(vals);
  return Math.sqrt(
    _.sum(_.map(vals, (i) => Math.pow(i - avg, 2))) / vals.length
  );
};

const listFn = (vals: any[]) => vals;

// @ts-ignore
const listDistinctFn = (vals: any[]) => [...new Set(vals)];

const valueFn = (vals: any[]) => vals[0];

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
export const aggFieldName = (f: string, agg: string) =>
  agg === "value"
    ? f
    : f.includes(".")
    ? `__${agg}__${_.last(f.split("."))}`
    : `__${agg}__${f}`;

export type VizFieldType =
  | "string"
  | "boolean"
  | "integer"
  | "number"
  | "object"
  | "array"
  | "date";

export const getValueDataType = (v: any): VizFieldType => {
  switch (typeof v) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return Number.isInteger(v) ? "integer" : "number";
    case "object":
      if (Array.isArray(v)) return "array";
      if (v instanceof Date) return "date";
      return "object";
    default:
      return "object";
  }
};

export const guessFieldValueType = (
  name: string,
  dataType: string,
  fieldType: "value" | "aggregation" | "calculation",
  isRoot: boolean
) => {
  if (["object", "string", "array", "boolean"].includes(dataType)) {
    return "dimension";
  }
  if (dataType === "number") {
    return "measure";
  }
  if (dataType === "date") {
    return fieldType === "aggregation" ? "measure" : "dimension";
  }
  if (dataType === "integer") {
    if (fieldType === "value" && !isRoot) {
      return "dimension";
    }
    return name.endsWith("Id") ||
      name.endsWith("_id") ||
      name.toUpperCase() === "ID"
      ? "dimension"
      : "measure";
  }
  return "measure";
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  sum: _.sum,
  avg: _.mean,
  min: _.min,
  max: _.max,
  stdev: stdevFn,
  count: countFn,
  countd: countDistinctFn,
  list: listFn,
  listd: listDistinctFn,
  value: valueFn,
  dim: valueFn,
} as VizDataFieldFuctionsObject;
