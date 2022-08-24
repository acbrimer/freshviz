import { createContext } from "react";
import { FilterItemProps } from "../util/filters";

export interface VizRecordState {
  id: string | number;
  data: any;
  global_id: string | number;
  color?: any;
  fillColor?: any;
  opacity?: any;
  geometry?: any;
  select?: boolean;
  focus?: boolean;
  disabled?: boolean;
  exclude?: boolean;
  visited?: boolean;
}

export type VizRecordsObject = {
  [id: string | number]: VizRecordState;
};

export interface VizFieldValues {
  count?: number;
  sum?: number;
  avg?: number;
  stdev?: number;
  min?: any;
  max?: any;
  mode?: any;
  median?: any;
}

export interface VizFieldState {
  name: string;
  label?: string;
  description?: string;
  values: VizFieldValues;
  filtered_values?: VizFieldValues;
}

export type VizFieldFunctionType =
  | "sum"
  | "min"
  | "max"
  | "avg"
  | "count"
  | "countd"
  | "list"
  | "listd"
  | "value";

export type VizDataFieldProps = {
  [k in VizFieldFunctionType]?: boolean | string;
};

export type VizDataFieldsObject = {
  [field: string]: VizDataFieldProps;
};

export interface VizActionState {
  /** The component triggering the action state */
  source: string;
  /** The current action applying to source */
  actionState: "hovered" | "selected";
  /** The id associated with the action state */
  id: string | number;
  /** The data record associated with the action state */
  data: any;
}

export interface VizContextState {
  isLoading: boolean;
  records: VizRecordState[];
  ids: (string | number)[];
  onMouseOver: (id: any) => void;
  onMouseOut: (id: any) => void;
  actionStates: any[];
  handleAddActionState: (actionState: VizActionState) => void;
  handleRemoveActionState: (actionState: VizActionState) => void;
  getFilterIds: (filters: FilterItemProps[]) => any[];
  getData: (
    groupBy: string,
    fields: VizDataFieldsObject,
    useFilter?: boolean,
    innerFilterIds?: any[]
  ) => any[];
}

const VizContext = createContext<VizContextState>({
  isLoading: true,
  records: [],
  ids: [],
  actionStates: [],
  handleAddActionState: (s: any) => {},
  handleRemoveActionState: (s: any) => {},
  onMouseOver: (id: any) => {},
  onMouseOut: (id: any) => {},
  getFilterIds: (filters: FilterItemProps[]) => [],
  getData: (
    groupBy: string,
    fields: VizDataFieldsObject,
    useFilter?: boolean,
    innerFilterIds?: any[]
  ) => [],
});

export default VizContext;
