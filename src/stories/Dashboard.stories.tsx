import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ScatterPlot from "../VizComponents/ScatterPlot";
import BarChart from "../VizComponents/BarChart";
import VizProvider from "../VizContext/VizProvider";
import testData from "../VizComponents/test_data";
import { FeatureMap } from "../VizComponents";

const DashboardDemo = (props: any) => {
  return (
    <VizProvider
      isLoading={false}
      data={testData as any[]}
      idField={"precinct_id"}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <ScatterPlot
            name="precincts"
            groupBy={"precinct_id"}
            keyField="absmail_votes"
            dataField="tot_votes"
            fields={{
              tot_votes: { value: true },
              absmail_votes: { value: true },
              winning_cand: { value: true },
              county_id: { value: true },
            }}
            linkActions={[
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
          <BarChart
            name="counties"
            groupBy="county_id"
            keyField="county_id"
            dataField="tot_votes"
            fields={{
              tot_votes: { sum: "tot_votes" },
            }}
            linkActions={[
              {
                source: "precincts",
                actionState: "hovered",
                sourceField: "county_id",
                targetField: "county_id",
                op: "xeq",
                targetAction: "innerFilter",
              },
            ]}
          />
        </div>
        <div style={{ width: 500, height: 300, display: "flex" }}>
          <FeatureMap
            name="precincts"
            groupBy={"precinct_id"}
            mapSource="https://storage.googleapis.com/okie-analytica.appspot.com/public_files/OKPrecincts2010.json"
            fields={{
              tot_votes: { value: true },
              absmail_votes: { value: true },
              winning_cand: { value: true },
              county_id: { value: true },
            }}
            linkActions={[
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
        </div>
      </div>
    </VizProvider>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Viz Components/DashboardDemo",
  component: DashboardDemo,
} as ComponentMeta<typeof DashboardDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DashboardDemo> = (args) => (
  <DashboardDemo {...args} />
);

export const Primary = Template.bind({});
