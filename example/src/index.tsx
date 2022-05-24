/* @refresh reload */
import { Component, For } from "solid-js";
import { render } from "solid-js/web";

import { Router, useRoutes, hashIntegration, Link } from "solid-app-router";
import { routes } from "./demos";

import "./styles/tailwind.css";

const AppRouting: Component = () => {
  const Routes = useRoutes(routes.map(route_data => route_data.route));

  return (
    <Router
      /** Using an hash router for GitHub Pages. */
      source={hashIntegration()}
    >
      <h1>solid-hcaptcha</h1>
      <p>A Solid component wrapper for the hCaptcha widget.</p>

      <ul>
        <For each={routes.filter(route => route.show)}>
          {route_data =>
            <li>
              <Link href={route_data.route.path}>{route_data.name}</Link>
            </li>
          }
        </For>
      </ul>
      
      <Routes />
    </Router>
  );
}

render(
  () => <AppRouting />,
  document.getElementById("root") as HTMLDivElement
);
