import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DataTable from "./DataTable";
import VizProvider from "../../VizContext/VizProvider";
import testData from "../test_data";
import * as _ from "lodash";

const CountiesDemo = (props: any) => {
  return (
    <VizProvider
      isLoading={false}
      data={testData as any[]}
      idField={"precinct_id"}
    >
      <DataTable
        name="counties"
        groupBy="county_id"
        fields={{
          county_id: { value: true },
          tot_votes: { sum: "tot_votes" },
          "candidates.*.tot_votes": { sum: "tot_votes" },
          "candidates.*.cand_number": { value: true },
        }}
        calculatedFields={{
          county_label: {
            name: "County label",
            fn: (r: any) => `County ${r.county_id.toString()}`,
          },
          winning_cand: {
            name: "Winning cand",
            fn: (r: any) =>
              _.orderBy(r.candidates, ["tot_votes"], ["desc"])[0].cand_number,
          },
        }}
      />
    </VizProvider>
  );
};

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
          county_id: { value: true },
          tot_votes: { value: true, zs: "tot_votes_z" },
        }}
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
