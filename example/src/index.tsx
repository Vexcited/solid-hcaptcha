/* @refresh reload */
import type { Component } from "solid-js";
import { render } from "solid-js/web";

import { Router, useRoutes, hashIntegration } from "@solidjs/router";
import { routes } from "./demos";

import "virtual:uno.css";
import Header from "./components/Header";

const AppRouting: Component = () => {
  const Routes = useRoutes(routes.map(route_data => route_data.route));

  return (
    <Router
      /** Using an hash router for GitHub Pages. */
      source={hashIntegration()}
    >
      <Header />

      <main class="px-6">
        <Routes />
      </main>
    </Router>
  );
};

render(
  () => <AppRouting />,
  document.getElementById("root") as HTMLDivElement
);
