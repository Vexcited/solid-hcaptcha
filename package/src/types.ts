export interface HCaptchaState {
  /** Whether the captcha was removed or not. */
  isRemoved: boolean;

  /** Captcha identifier given by hCaptcha. */
  captchaId: string | null;
}

export interface HCaptchaProps {
  /**
   * When an error occurs. Component will
   * reset immediately after an error.
   */
  onError?: (error: HCaptchaError) => void;

  /**
   * When challenge is completed.
   * The response `token` and an `eKey` (session ID) are passed along.
   */
  onVerify?: (token: string, eKey: string) => unknown;

  /** When the current token expires. */
  onExpire?: () => unknown;

  /** When the hCaptcha API loads. */
  onLoad?: (hcaptcha: HCaptchaFunctions) => unknown;

  /** When the user display of a challenge starts. */
  onOpen?: () => unknown;

  /** When the user dismisses a challenge. */
  onClose?: () => unknown;

  /** When the user display of a challenge times out with no answer. */
  onChallengeExpired?: () => unknown;

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
  theme?: "light" | "dark" | "contrast" | object;

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
   * Disable drop-in replacement for reCAPTCHA with `false`
   * to prevent hCaptcha from injecting into `window.grecaptcha`.
   */
  reCaptchaCompat?: boolean;

  /**
   * When setting to `auto`, hCaptcha auto-detects language via the user's browser.
   * This overrides that to set a default UI language.
   *
   * @see https://docs.hcaptcha.com/languages/
   * @default "auto"
   */
  languageOverride?: string;
  /** @deprecated Use `languageOverride` instead. */
  hl?: string;

  apihost?: string;
  assethost?: string;
  endpoint?: string;
  host?: string;
  imghost?: string;
  reportapi?: string;
  secureApi?: string;
  scriptSource?: string;
  custom?: boolean;

  /**
   * Set if the script should be loaded asynchronously.
   * @default true
   */
  loadAsync?: boolean;

  /**
   * Remove script tag after setup.
   * @default true
   */
  cleanup?: boolean

  /**
   * Should enable Sentry reporting for hCaptcha.
   */
  sentry?: boolean;
}


export interface HCaptchaFunctions {
  /** Reset the current challenge. */
  resetCaptcha(): void;

  /** Manually render the hCaptcha widget. */
  renderCaptcha(onReady?: () => unknown): void;

  /** Manually remove the hCaptcha widget from the DOM. */
  removeCaptcha(callback?: () => unknown): void;

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

  /** See enterprise docs. */
  setData(data: ConfigSetData): void;

  /** Run `execute` on the captcha, without returning the response. */
  executeSync(): void;

  /** Returns a promise which resolves with `HCaptchaExecuteResponse`. */
  execute(): Promise<HCaptchaExecuteResponse | undefined>;
}

/** Fixes the `String` types from `HCaptchaResponse`. */
export interface HCaptchaExecuteResponse {
  response: string;
  key: string;
}
