import { type Component, createSignal, Show } from "solid-js";
import HCaptcha, { type HCaptchaExecuteResponse } from "solid-hcaptcha";

const BasicCaptchaDemo: Component = () => {
  const [captchaResponse, setCaptchaResponse] = createSignal<HCaptchaExecuteResponse | null>(null);

  const handleCaptchaVerify = (token: string, eKey: string) => {
    setCaptchaResponse({
      response: token,
      key: eKey
    });
  };

  return (
    <div>
      <HCaptcha
        sitekey={HCAPTCHA_SITEKEY}
        onVerify={handleCaptchaVerify}
      />

      <Show when={captchaResponse()} fallback={<p>Click on the button above to open the captcha.</p>}>
        {response => (
          <>
            <p>Captcha completed !</p>

            <div>
              <h2>response</h2>
              <code>
                {response().response}
              </code>

              <h2>key</h2>
              <code>
                {response().key}
              </code>
            </div>
          </>
        )}
      </Show>
    </div>
  );
};

export default BasicCaptchaDemo;
