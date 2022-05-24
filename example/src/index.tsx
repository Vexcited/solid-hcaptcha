/* @refresh reload */
import type { Component } from "solid-js";
import { render } from "solid-js/web";

import type { HCaptchaFunctions } from "solid-hcaptcha";
import HCaptcha from "solid-hcaptcha";

const Main: Component = () => {
  let captcha: HCaptchaFunctions | undefined;

  const submitCaptcha = async (event: MouseEvent) => {
    console.log(captcha);

    event.preventDefault();
    if (!captcha) return;

    const response = captcha.execute({ async: true });
  }

  return (
    <div>
      <HCaptcha
        theme="light"
        onLoad={captcha_instance => console.log(captcha_instance)}
        sitekey="10000000-ffff-ffff-ffff-000000000001"
        size="normal"
      />

      <button onClick={submitCaptcha}>
        Show invisible captcha
      </button>
    </div>
  );
}

render(
  () => <Main />,
  document.getElementById("root") as HTMLDivElement
);
