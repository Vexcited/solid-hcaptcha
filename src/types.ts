export interface HCaptchaState {
  /** Whether the captcha was removed or not. */
  isRemoved: boolean;

  /** ID of the `div` element that contains the hCaptcha widget. */
  elementId?: string;

  /** Captcha identifier given by hCaptcha. */
  captchaId: string | null;
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
  onLoad?: (hcaptcha: HCaptchaFunctions) => any;

  /** When the user display of a challenge starts. */
  onOpen?: () => any;

  /** When the user dismisses a challenge. */
  onClose?: () => any;

  /** When the user display of a challenge times out with no answer. */
  onChallengeExpired?: () => any;

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
   * @default "normal".
   */
  size?: "normal" | "compact" | "invisible";

  /**
   * hCaptcha supports both a `light` and `dark` theme.
   * 
   * @default "light".
   */
  theme?: "light" | "dark";

  /**
   * Set the tabindex of the widget and popup.
   * When appropriate, this can make navigation of your site more intuitive.
   * 
   * @default 0
   */
  tabindex?: number;

  /**
   * Set an ID to the hCaptcha widget.
   * Make sure each hCaptcha component generated on a single
   * page has its own unique ID when using this prop.
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

export interface HCaptchaFunctions {
  resetCaptcha(): void;
  renderCaptcha(onReady?: () => any): void;
  removeCaptcha(callback: () => any): void;
  
  /**
   * Get the associated ekey (challenge ID) for a successful solve.
   * When the hCaptcha ID cannot be resolved, it throws `null`.
   */
  getRespKey(): string | null;
  
  /**
   * Get the response token, if any.
   * When the hCaptcha ID cannot be resolved, it throws `null`. 
   */
  getResponse(): string | null;
  
  setData(data: ConfigSetData): void;

  /** Run `execute` on the captcha, without returning the response. */
  executeSync(): void;

  /** Returns a promise which resolves with `HCaptchaResponse`. */
  execute(): Promise<HCaptchaResponse | undefined>;
}

export interface HCaptchaResponse {
  response: string;
  key: string;
}
