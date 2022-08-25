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
  /** Identiying key for the action state */
  key: string;
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

  selectedRecords: any[];
  handleToggleSelectedRecord: (
    source: string,
    id: string | number,
    data: any
  ) => void;
  handleAddSelectedRecord: (
    source: string,
    id: string | number,
    data: any
  ) => void;

  handleRemoveSelectedRecord: (source: string, id: string | number) => void;
  handleClearSelectedRecords: (source?: string) => void;

  hoveredRecords: any[];
  handleAddHoveredRecord: (
    source: string,
    id: string | number,
    data: any
  ) => void;
  handleRemoveHoveredRecord: (source: string, id: string | number) => void;
  handleClearHoveredRecords: (source?: string) => void;

  getFilterIds: (filters: FilterItemProps[]) => any[];

  getData: (
    groupBy: string,
    fields: VizDataFieldsObject,
    useFilter?: boolean,
    innerFilterIds?: any[]
  ) => any[];
}

export interface VizComponentRecordState {
  source: string;
  id: string | number;
  data: any;
}

const VizContext = createContext<VizContextState>({
  isLoading: true,
  records: [],
  ids: [],
  selectedRecords: [],
  handleToggleSelectedRecord: (
    source: string,
    id: string | number,
    data: any
  ) => {},
  handleAddSelectedRecord: (
    source: string,
    id: string | number,
    data: any
  ) => {},
  handleRemoveSelectedRecord: (source: string, id: string | number) => {},
  handleClearSelectedRecords: (source?: string) => {},

  hoveredRecords: [],

  handleAddHoveredRecord: (
    source: string,
    id: string | number,
    data: any
  ) => {},
  handleRemoveHoveredRecord: (source: string, id: string | number) => {},
  handleClearHoveredRecords: (source?: string) => {},

  getFilterIds: (filters: FilterItemProps[]) => [],
  getData: (
    groupBy: string,
    fields: VizDataFieldsObject,
    useFilter?: boolean,
    innerFilterIds?: any[]
  ) => [],
});

export default VizContext;
