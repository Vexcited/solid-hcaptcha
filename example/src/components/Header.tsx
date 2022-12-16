import type { Component } from "solid-js";
import { For } from "solid-js";
import { A } from "@solidjs/router";

import { routes } from "../demos";

const Header: Component = () => {
  return (
    <>
      <header class="w-screen h-12 bg-slate-800 flex flex-row items-center justify-between px-4">
        <A
          href="/"
          class="text-slate-200 text-xl"
        >
          solid-hcaptcha
        </A>

        <div class="flex flex-row items-center justify-center gap-2">
          <a class="text-slate-400" href="https://github.com/Vexcited/solid-hcaptcha" target="_blank">GitHub</a>
        </div>

      </header>
      <nav class="w-screen h-16 bg-slate-600 mb-4">
        <ul class="px-4 flex h-full w-full overflow-y-auto justify-start items-center gap-4">
          <For each={routes.filter(route => route.show)}>
            {route_data =>
              <li>
                <A
                  href={route_data.route.path}
                  class="px-6 py-2 bg-slate-400 rounded-md font-medium"
                >
                  {route_data.name}
                </A>
              </li>
            }
          </For>
        </ul>
      </nav>
    </>
  );
};

export default Header;
