import type { Component } from "solid-js";

import HCaptcha from "solid-hcaptcha";

const BaiscCaptchaDemo: Component = () => {
  const handleCaptchaVerify = (token: string, eKey: string) => {
    console.log(token, eKey);
  }

  return (
    <div>
      <HCaptcha
        onVerify={handleCaptchaVerify}
        sitekey={HCAPTCHA_SITEKEY}
      />
    </div>
  );
}

export default BaiscCaptchaDemo;