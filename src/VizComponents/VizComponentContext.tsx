import { createContext } from "react";
import { VizSortState } from "../VizContext/VizContext";
import { VizFieldType } from "../VizContext/vizFieldFunctions";

export interface VizComponentFieldDefinition {
  name: string;
  fieldType: "calculation" | "value" | "aggregation";
  valueType: "measure" | "dimension";
  dataType: VizFieldType;
  function: string;
  label: string;
  order: number;
  labelComponent: any;
  valueComponent: any;
  description: string;
}

export interface VizComponentContextState {
  name: string;
  groupBy: string;
  data: any[];
  hoveredIds: any[];
  selectedIds: any[];
  focusIds?: any[];
  clearFocusActions: () => void;
  fieldDefinitions: VizComponentFieldDefinition[];
  handleMouseOver: (e: any, data?: any) => void;
  handleMouseOut: (e: any, data?: any) => void;
  handleClick: (e: any, data?: any) => void;
  handleUpdateSort: (e: any, sort: VizSortState) => void;
  sort?: VizSortState;
  getStyle?: (record: any) => any;
}

const VizComponentContext = createContext<VizComponentContextState>({
  name: "",
  groupBy: "",
  data: [],
  hoveredIds: [],
  selectedIds: [],
  sort: {},
  focusIds: null,
  fieldDefinitions: [],
  clearFocusActions: () => {},
  handleUpdateSort: (e: any, VizSortState) => {},
  handleMouseOver: (e: any, data?: any) => {},
  handleMouseOut: (e: any, data?: any) => {},
  handleClick: (e: any, data?: any) => {},
  getStyle: (record: any) => {},
});

export default VizComponentContext;
