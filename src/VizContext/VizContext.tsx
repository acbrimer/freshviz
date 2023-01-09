import { createContext } from "react";
import { FilterItemProps } from "../util/filters";

export type VizFieldFunctionType =
  | "sum"
  | "min"
  | "max"
  | "avg"
  | "count"
  | "countd"
  | "list"
  | "listd"
  | "value"
  | "stdev"
  | "zs";

export interface VizDataFieldDefinition {
  label?: string;
  description?: string;
  valueType?: "dimension" | "measure";
  order?: number;
  labelComponent?: JSX.Element;
  valueComponent?: JSX.Element;
}

export type VizDataFieldProps = {
  [k in VizFieldFunctionType]?: boolean | string | VizDataFieldDefinition;
};

export type VizDataFieldFuctionsObject = {
  [k in VizFieldFunctionType]?: (vals: any[]) => any;
};

export type VizDataFieldsObject = {
  [field: string]: VizDataFieldProps;
};

export interface VizCalculatedFieldProps {
  label?: string;
  valueType?: "dimension" | "measure";
  description?: string;
  order?: number;
  labelComponent?: JSX.Element;
  valueComponent?: JSX.Element;
  fn: (record: any) => any;
}

export type VizCalculatedFieldsObject = {
  [field: string]: VizCalculatedFieldProps;
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

export interface VizGetDataProps {
  groupBy: string;
  fields: VizDataFieldsObject;
  innerFilterIds?: any[];
  calculatedFields?: VizCalculatedFieldsObject;
  select?: (data: any[]) => any[];
}

export type VizSortState = { [field: string]: "asc" | "desc" };

export type VizComponentSortState = { component: string; sort: VizSortState };

export interface VizContextState {
  isLoading: boolean;
  records: any[];
  ids: (string | number)[];

  componentSortStates: VizComponentSortState[];
  updateComponentSort: (component: string, sort: VizSortState) => void;

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
  getFilterItemIds: (filterItem: FilterItemProps) => any[];

  getData: (
    groupBy: string,
    fields: VizDataFieldsObject,
    innerFilterIds?: any[],
    calculatedFields?: VizCalculatedFieldsObject,
    select?: (data: any[]) => any[]
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
  componentSortStates: [],
  updateComponentSort: (component: string, sort: VizSortState) => {},
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
  getFilterItemIds: (filterItem: FilterItemProps) => [],
  getData: (
    groupBy: string,
    fields: VizDataFieldsObject,
    innerFilterIds?: any[],
    calculatedFields?: VizCalculatedFieldsObject,
    select?: (data: any[]) => any[]
  ) => [],
});

export default VizContext;
