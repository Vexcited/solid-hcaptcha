/** Fixes the `String` types from `HCaptchaResponse`. */
export interface HCaptchaExecuteResponse {
  key: string;
  response: string;
}

export interface HCaptchaFunctions {
  /** Returns a promise which resolves with `HCaptchaExecuteResponse`. */
  execute(): Promise<HCaptchaExecuteResponse | undefined>;

  /** Run `execute` on the captcha, without returning the response. */
  executeSync(): void;

  /**
   * Get the associated ekey (challenge ID) for a successful solve.
   * When the hCaptcha ID cannot be resolved, it throws `null`.
   */
  getRespKey(): null | string;

  /**
   * Get the response token, if any.
   * When the hCaptcha ID cannot be resolved, it throws `null`.
   */
  getResponse(): null | string;

  /** Manually remove the hCaptcha widget from the DOM. */
  removeCaptcha(callback?: () => unknown): void;

  /** Manually render the hCaptcha widget. */
  renderCaptcha(onReady?: () => unknown): void;

  /** Reset the current challenge. */
  resetCaptcha(): void;

  /** See enterprise docs. */
  setData(data: ConfigSetData): void;
}


export interface HCaptchaProps {
  apihost?: string;

  assethost?: string;

  /**
   * Remove script tag after setup.
   * @default true
   */
  cleanup?: boolean

  custom?: boolean;

  endpoint?: string;

  /** @deprecated Use `languageOverride` instead. */
  hl?: string;

  host?: string;

  /**
   * Set an ID to the hCaptcha widget.
   * Make sure each hCaptcha component generated on a single
   * page has its own unique ID when using this prop.
   */
  id?: string;

  imghost?: string;

  /**
   * When setting to `auto`, hCaptcha auto-detects language via the user's browser.
   * This overrides that to set a default UI language.
   *
   * @see https://docs.hcaptcha.com/languages/
   * @default "auto"
   */
  languageOverride?: string;

  /**
   * Set if the script should be loaded asynchronously.
   * @default true
   */
  loadAsync?: boolean;

  /** When the user display of a challenge times out with no answer. */
  onChallengeExpired?: () => unknown;

  /** When the user dismisses a challenge. */
  onClose?: () => unknown;

  /**
   * When an error occurs. Component will
   * reset immediately after an error.
   */
  onError?: (error: HCaptchaError) => void;
  /** When the current token expires. */
  onExpire?: () => unknown;

  /** When the hCaptcha API loads. */
  onLoad?: (hcaptcha: HCaptchaFunctions) => unknown;
  /** When the user display of a challenge starts. */
  onOpen?: () => unknown;
  /**
   * When challenge is completed.
   * The response `token` and an `eKey` (session ID) are passed along.
   */
  onVerify?: (token: string, eKey: string) => unknown;
  /**
   * Disable drop-in replacement for reCAPTCHA with `false`
   * to prevent hCaptcha from injecting into `window.grecaptcha`.
   */
  reCaptchaCompat?: boolean;
  reportapi?: string;
  scriptSource?: string;
  secureApi?: boolean;
  /**
   * Should enable Sentry reporting for hCaptcha.
   */
  sentry?: boolean;
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
  size?: "compact" | "invisible" | "normal";

  /**
   * Set the tabindex of the widget and popup.
   * When appropriate, this can make navigation of your site more intuitive.
   *
   * @default 0
   */
  tabindex?: number;

  /**
   * hCaptcha supports both a `light` and `dark` theme.
   *
   * @default "light".
   */
  theme?: "contrast" | "dark" | "light" | object;
}

export interface HCaptchaState {
  /** Captcha identifier given by hCaptcha. */
  captchaId: null | string;

  /** Whether the captcha was removed or not. */
  isRemoved: boolean;
}
