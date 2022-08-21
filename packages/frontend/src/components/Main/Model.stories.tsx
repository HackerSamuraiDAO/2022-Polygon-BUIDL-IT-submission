import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Model as Component } from "./Model";

export default {
  title: "Components/Model",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Model = Template.bind({});
Model.args = {
  image: "/img/samples/graffiti.png",
};
