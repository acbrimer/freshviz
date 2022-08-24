import { createContext } from "react";

export interface VizComponentContextState {
  name: string;
  groupBy: string;
  data: any[];
  hoveredIds: any[];
  handleMouseOver: (e: any, data?: any) => void;
  handleMouseOut: (e: any, data?: any) => void;
  getStyle?: (record: any) => any;
}

const VizComponentContext = createContext<VizComponentContextState>({
  name: "",
  groupBy: "",
  data: [],
  hoveredIds: [],
  handleMouseOver: (e: any, data?: any) => {},
  handleMouseOut: (e: any, data?: any) => {},
  getStyle: (record: any) => {},
});

export default VizComponentContext;
