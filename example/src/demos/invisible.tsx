import type { Component } from "solid-js";
import type { HCaptchaFunctions, HCaptchaExecuteResponse } from "solid-hcaptcha";

import { createSignal, Show } from "solid-js";
import HCaptcha from "solid-hcaptcha";

const InvisibleCaptchaDemo: Component = () => {
  let captcha: HCaptchaFunctions | undefined;

  const [captchaResponse, setCaptchaResponse] = createSignal<HCaptchaExecuteResponse | null>(null);

  const submitCaptcha = async (event: MouseEvent) => {
    event.preventDefault();
    if (!captcha) return;

    const response = await captcha.execute();
    if (!response) return;

    setCaptchaResponse(response);
  };

  return (
    <div>
      <HCaptcha
        theme="light"
        onLoad={captcha_instance => (captcha = captcha_instance)}
        sitekey={HCAPTCHA_SITEKEY}
        size="invisible"
      />

      <button
        class="px-6 py-2 bg-slate-400 rounded-md mb-2"
        onClick={submitCaptcha}
      >
        Show captcha
      </button>

      <Show when={captchaResponse() !== null} fallback={<p>Click on the button above to open the captcha.</p>}>
        <p>Captcha completed !</p>

        <div>
          <h2>response</h2>
          <code>
            {captchaResponse()!.response}
          </code>

          <h2>key</h2>
          <code>
            {captchaResponse()!.key}
          </code>
        </div>

      </Show>
    </div>
  );
};

export default InvisibleCaptchaDemo;