/* @refresh reload */
import type { Component } from "solid-js";
import { render } from "solid-js/web";

import HCaptcha from "solid-hcaptcha";

const Main: Component = () => {
  return (
    <div>
      <h1>solid-hcaptcha</h1>
      <HCaptcha />
    </div>
  );
}

render(
  () => <Main />,
  document.getElementById("root") as HTMLDivElement
);
