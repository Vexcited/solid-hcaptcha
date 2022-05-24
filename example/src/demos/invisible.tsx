import type { Component } from "solid-js";
import type { HCaptchaFunctions } from "solid-hcaptcha";

import HCaptcha from "solid-hcaptcha";

const InvisibleCaptchaDemo: Component = () => {
  let captcha: HCaptchaFunctions | undefined;

  const submitCaptcha = async (event: MouseEvent) => {
    event.preventDefault();
    if (!captcha) return;

    const response = await captcha.execute();
    console.log(response);
  }

  return (
    <div>
      <HCaptcha
        theme="light"
        onLoad={captcha_instance => (captcha = captcha_instance)}
        sitekey={HCAPTCHA_SITEKEY}
        size="invisible"
      />

      <button onClick={submitCaptcha}>
        Show captcha
      </button>
    </div>
  );
}

export default InvisibleCaptchaDemo;