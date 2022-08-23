import * as _ from "lodash";

export const FILTER_FUNCTIONS = {
  eq: (field: string, value: any) => ({ [field]: value }),
  xeq: (field: string, value: any) => ({ [field]: value }),
  gt: (field: string, value: any) => (v: any) => v[field] > value,
  gte: (field: string, value: any) => (v: any) => v[field] >= value,
  lt: (field: string, value: any) => (v: any) => v[field] < value,
  lte: (field: string, value: any) => (v: any) => v[field] <= value,
  in: (field: string, value: any[]) => (v: any) => value.includes(v[field]),
  xin: (field: string, value: any[]) => (v: any) => value.includes(v[field]),
};

export interface FilterItemProps {
  /** Field to filter */
  field: string;
  /** Filter operator */
  op: keyof typeof FILTER_FUNCTIONS;
  /** Value for filter */
  value: any;
}

export function applyFilterItem(
  data: any[],
  level: string,
  filterItem: FilterItemProps
) {
  const { field, op, value } = filterItem;
  const f = op.startsWith("x") ? _.reject : _.filter;
  return _.map(
    f(data, FILTER_FUNCTIONS[op](field, value)),
    (fv: any) => fv[level || "id"]
  );
}
