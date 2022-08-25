import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Box from "@mui/material/Box";
import DataTable from "./DataTable";
import VizProvider from "../../VizContext/VizProvider";
import FeatureMap from "../FeatureMap";
import testData from "../test_data";

const DataTableCrossfilter = (props: any) => {
  return (
    <VizProvider
      isLoading={false}
      data={testData as any[]}
      idField={"precinct_id"}
    >
      <Box display="flex" flexDirection="row">
        <Box width="50%" p={1}>
          <FeatureMap
            mapSource=""
            name="precincts"
            groupBy="precinct_id"
            fields={{
              precinct_id: { value: true },
              county_id: { value: true },
              tot_votes: { value: true },
              winning_cand: { value: true },
            }}
            linkActions={[
              {
                source: "counties",
                actionState: "selected",
                sourceField: "county_id",
                targetField: "county_id",
                op: "eq",
                targetAction: "hover",
              },
              {
                source: "counties",
                actionState: "hovered",
                sourceField: "county_id",
                targetField: "county_id",
                op: "eq",
                targetAction: "hover",
              },
            ]}
          />
        </Box>
        <Box width="50%" p={1}>
          <DataTable
            name="counties"
            groupBy="county_id"
            fields={{
              county_id: { value: true },
              tot_votes: { sum: "tot_votes" },
              precinct_id: { count: "tot_precincts" },
            }}
            linkActions={[
              {
                source: "precincts",
                actionState: "hovered",
                sourceField: "county_id",
                targetField: "county_id",
                op: "eq",
                targetAction: "hover",
              },
            ]}
          />
        </Box>
      </Box>
    </VizProvider>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Viz Components/Data Table Feature Map",
  component: DataTableCrossfilter,
} as ComponentMeta<typeof DataTableCrossfilter>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DataTableCrossfilter> = (args) => (
  <DataTableCrossfilter {...args} />
);

export const Primary = Template.bind({});
