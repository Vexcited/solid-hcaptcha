export interface HCaptchaState {
  isApiReady: boolean;
  isRemoved: boolean;
  elementId: string;
  captchaId: string;
}

export interface HCaptchaProps {
  
  /**
   * When an error occurs. Component will
   * reset immediately after an error.
   */
  onError?: (err: string) => any;

  /**
   * When challenge is completed.
   * The response `token` and an `eKey` (session ID) are passed along.
   */
  onVerify?: (token: string, eKey: string) => any;

  /** When the current token expires. */
  onExpire?: () => any;

  /** When the hCaptcha API loads. */
  onLoad?: () => any;

  /** When the user display of a challenge starts. */
  onOpen?: () => any;

  /** When the user dismisses a challenge. */
  onClose?: () => any;

  /** When the user display of a challenge times out with no answer. */
  onChalExpired?: () => any;

  /**
   * This is your sitekey, this allows you to load captcha.
   * If you need a sitekey, please visit [hCaptcha](https://www.hcaptcha.com),
   * and sign up to get your sitekey.
   */
  sitekey: string;

  /**
   * This specifies the "size" of the component.
   * hCaptcha allows you to decide how big the component
   * will appear on render.
   * 
   * Defaults to `normal`.
   */
  size?: "normal" | "compact" | "invisible";

  /**
   * hCaptcha supports both a `light` and `dark` theme.
   * 
   * Defaults to `light`.
   */
  theme?: "light" | "dark";

  /**
   * Set the tabindex of the widget and popup.
   * When appropriate, this can make navigation of your site more intuitive.
   * 
   * Defaults to 0.
   */
  tabindex?: number;

  /**
   * Manually set the ID of the hCaptcha component.
   * Make sure each hCaptcha component generated on a single
   * page has its own unique ID when using this prop.
   * 
   * Defaults to "solid-hcaptcha-script".
   */
  id?: string;

  /**
   * Advanced configuration for
   * the hCaptcha component.
   */
  config?: HCaptchaConfig;
}


export interface HCaptchaConfig {


  /**
   * Disable drop-in replacement for reCAPTCHA with `false`
   * to prevent hCaptcha from injecting into `window.grecaptcha`.
   */
  recaptchacompat?: boolean;

  /**
   * When setting to `auto`, hCaptcha auto-detects language via the user's browser.
   * This overrides that to set a default UI language. See [language codes](https://hcaptcha.com/docs/languages).
   * 
   * Defaults to `auto`. The language code should be a ISO 639-2 code.
   */
  hl?: string;

  apihost?: string;
  assethost?: string;
  endpoint?: string;
  host?: string;
  imghost?: string;
  reportapi?: string;
  sentry?: string;
  custom?: boolean;
}

