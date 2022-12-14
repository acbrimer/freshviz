import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ScatterPlot from "./ScatterPlot";
import VizProvider from "../../VizContext/VizProvider";
import testData from "../test_data";

/**
 * 
<ScatterPlot
        name="precincts"
        keyField="tot_votes"
        dataField="est_voter_turnout"
        groupBy={"precinct_id"}
        fields={{
          tot_votes: { value: true },
          est_voter_turnout: { value: true },
          winning_cand: { value: true },
          county_id: { value: true },
        }}
      />
 */

const ScatterPlotDemo = (props: any) => {
  return (
    <VizProvider
      isLoading={false}
      data={testData as any[]}
      idField={"precinct_id"}
    >
      <ScatterPlot
        name="precincts"
        groupBy="precinct_id"
        keyField="z-score"
        dataField="tot_votes"
        fields={{
          precinct_id: { value: true },
          tot_votes: { value: true, zs: "z-score" },
        }}
      />
    </VizProvider>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Viz Components/Scatter Plot",
  component: ScatterPlotDemo,
} as ComponentMeta<typeof ScatterPlotDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ScatterPlotDemo> = (args) => (
  <ScatterPlotDemo {...args} />
);

export const Primary = Template.bind({});
