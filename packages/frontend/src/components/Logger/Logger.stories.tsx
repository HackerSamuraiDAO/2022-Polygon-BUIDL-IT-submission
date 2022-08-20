import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Logger as Component } from "./Logger";

export default {
  title: "Components/Logger",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Logger = Template.bind({});
