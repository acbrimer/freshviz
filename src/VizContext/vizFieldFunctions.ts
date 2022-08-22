import * as _ from "lodash";
import { VizFieldFunctionType } from "./VizContext";

const countFn = (vals: any[]) => {
  //   console.log("count", vals);

  return vals.length;
};
// @ts-ignore
const countDistinctFn = (vals: any[]) => [...new Set(vals)].length;

const stdevFn = (vals: any[]) => {
  const avg = _.mean(vals);
  return Math.sqrt(
    _.sum(_.map(vals, (i) => Math.pow(i - avg, 2))) / vals.length
  );
};

const listFn = (vals: any[]) => vals;

// @ts-ignore
const listDistinctFn = (vals: any[]) => [...new Set(vals)];

const valueFn = (vals: any[]) => vals[0];

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
} as { [k in VizFieldFunctionType]: any };
