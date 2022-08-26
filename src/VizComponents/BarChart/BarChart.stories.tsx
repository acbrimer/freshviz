import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BarChart from "./BarChart";
import VizProvider from "../../VizContext/VizProvider";
import testData from "../test_data";


const BarChartDemo = (props: any) => {
  return (
    <VizProvider
      isLoading={false}
      data={testData as any[]}
      idField={"precinct_id"}
    >
      <BarChart
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
  title: "Viz Components/Bar Chart",
  component: BarChartDemo,
} as ComponentMeta<typeof BarChartDemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BarChartDemo> = (args) => (
  <BarChartDemo {...args} />
);

export const Primary = Template.bind({});
