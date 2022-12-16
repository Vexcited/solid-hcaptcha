import type { Component } from "solid-js";

import { lazy } from "solid-js";
import { A } from "@solidjs/router";

const HomePage: Component = () => {
  return (
    <p>Welcome ! Select a demo from the list above.</p>
  );
};

const Error404Page: Component = () => {
  return (
    <div>
      <p>This demo is unknown. Please select a valid demo from the list above.</p>
      <A href="/">Go to the home page</A>
    </div>
  );
};

export const routes = [
  {
    route: {
      path: "/invisible",
      component: lazy(() => import("./invisible"))
    },

    name: "Invisible",
    show: true
  },
  {
    route: {
      path: "/basic",
      component: lazy(() => import("./basic"))
    },

    name: "Basic",
    show: true
  },

  {
    route: {
      path: "/",
      component: HomePage
    },

    name: "Home",
    show: false
  },
  {
    route: {
      path: "*",
      component: Error404Page
    },

    name: "404",
    show: false
  }
];
