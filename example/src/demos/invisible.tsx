import type { Component } from "solid-js";
import type { HCaptchaFunctions } from "solid-hcaptcha";

import HCaptcha from "solid-hcaptcha";

const InvisibleCaptchaDemo: Component = () => {
    let captcha: HCaptchaFunctions | undefined;
  
    const submitCaptcha = async (event: MouseEvent) => {
      console.log(captcha);
  
      event.preventDefault();
      if (!captcha) return;
  
      const response = await captcha.execute();
      
    }
  
    return (
      <div>
        <HCaptcha
          theme="light"
          onLoad={captcha_instance => (captcha = captcha_instance)}
          sitekey="10000000-ffff-ffff-ffff-000000000001"
          size="invisible"
        />
  
        <button onClick={submitCaptcha}>
          Show invisible captcha
        </button>
      </div>
    );
}

export default InvisibleCaptchaDemo;