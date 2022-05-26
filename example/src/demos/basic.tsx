import type { Component } from "solid-js";
import type { HCaptchaResponse } from "solid-hcaptcha";

import { createSignal, Show } from "solid-js";
import HCaptcha from "solid-hcaptcha";

const BaiscCaptchaDemo: Component = () => {
  const [captchaResponse, setCaptchaResponse] = createSignal<HCaptchaResponse | null>(null);

  const handleCaptchaVerify = (token: string, eKey: string) => {
    setCaptchaResponse({
      response: token,
      key: eKey
    });
  }

  return (
    <div>
      <HCaptcha
        sitekey={HCAPTCHA_SITEKEY}
        onVerify={handleCaptchaVerify}
      />

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
}

export default BaiscCaptchaDemo;