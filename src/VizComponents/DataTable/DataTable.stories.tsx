import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DataTable from "./DataTable";
import VizProvider from "../../VizContext/VizProvider";
import testData from "../test_data";

const DataTableDemo = (props: any) => {
  return (
    <VizProvider
      isLoading={false}
      data={testData as any[]}
      idField={"precinct_id"}
    >
      <DataTable
        name="precincts"
        groupBy="precinct_id"
        fields={{
          precinct_id: { value: true },
          tot_votes: { value: true },
          absmail_votes: { value: true },
          winning_cand: { value: true },
          county_id: { value: true },
        }}
        linkActions={[
          {
            source: "precincts",
            actionState: "selected",
            sourceField: "precinct_id",
            targetField: "precinct_id",
            op: "eq",
            targetAction: "select",
          },
          {
            source: "precincts",
            actionState: "hovered",
            sourceField: "precinct_id",
            targetField: "precinct_id",
            op: "eq",
            targetAction: "hover",
          },
        ]}
      />
    </VizProvider>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Viz Components/Data Table",
  component: DataTableDemo,
} as ComponentMeta<typeof DataTableDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DataTableDemo> = (args) => (
  <DataTableDemo {...args} />
);

export const Primary = Template.bind({});
