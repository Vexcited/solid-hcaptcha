/* @refresh reload */
import type { Component } from "solid-js";
import { render } from "solid-js/web";

// "../../src" corresponds to "solid-hcaptcha"
import HCaptcha from "../../src";

const Main: Component = () => {
  return (
    <div>
      <h1>solid-hcaptcha</h1>
      <HCaptcha
        sitekey="10000000-ffff-ffff-ffff-000000000001"
        onVerify={(...e) => console.log(e)}
      />
    </div>
  );
}

render(
  () => <Main />,
  document.getElementById("root") as HTMLDivElement
);
