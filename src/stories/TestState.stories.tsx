import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import TestState from "./TestState";

export default {
  title: "TestState/TestState",
  component: TestState,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof TestState>;

const Template: ComponentStory<typeof TestState> = (args) => (
  <TestState {...args} />
);

export const Default = Template.bind({});
