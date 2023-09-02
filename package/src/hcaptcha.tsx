import type { Component } from "solid-js";

import { createScriptLoader } from "@solid-primitives/script-loader";
import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { generateScriptUrl } from "./utils";

import type {
  HCaptchaProps,
  HCaptchaState,
  HCaptchaFunctions,
  HCaptchaExecuteResponse
} from "./types";

/** The name of the function that will be triggered when hCaptcha is loaded. */
const HCAPTCHA_ONLOAD_FUNCTION_NAME = "__hCaptchaOnLoad__";

declare global {
  interface Window {
    [HCAPTCHA_ONLOAD_FUNCTION_NAME]: () => void;
  }
}

const HCaptcha: Component<HCaptchaProps> = (props) => {
  const script_url = () => generateScriptUrl({
    assethost: props.config?.assethost,
    endpoint: props.config?.endpoint,
    hl: props.config?.hl,
    host: props.config?.host,
    imghost: props.config?.imghost,
    recaptchacompat: props.config?.recaptchacompat === false ? "off" : null,
    reportapi: props.config?.reportapi,
    sentry: props.config?.sentry,
    custom: props.config?.custom
  }, HCAPTCHA_ONLOAD_FUNCTION_NAME, props.config?.apihost);

  /** Whether the hCaptcha API (in `window`) is ready. */
  const isApiReady = () => typeof window.hcaptcha !== "undefined";

  /** Whether the hCaptcha widget is ready (in `window` and not removed). */
  const isReady = () => {
    const { isRemoved } = state;
    return isApiReady() && !isRemoved;
  };

  /** Reference of the hCaptcha widget element. */
  let captcha_ref: HTMLDivElement | undefined;

  const [state, setState] = createStore<HCaptchaState>({
    isRemoved: false,
    captchaId: null
  });

  const renderCaptcha: HCaptchaFunctions["renderCaptcha"] = (onReady) => {
    if (!captcha_ref) return;

    /** Parameters for the hCaptcha widget. */
    const renderParams: ConfigRender = Object.assign({
      "open-callback"        : handleOpen,
      "close-callback"       : handleClose,
      "error-callback"       : handleError,
      "chalexpired-callback" : handleChallengeExpired,
      "expired-callback"     : handleExpire,
      "callback"             : handleSubmit,
    }, props.config, {
      "sitekey"              : props.sitekey,
      "tabindex"             : props.tabindex || 0,
      "theme"                : props.theme    || "light",
      "size"                 : props.size     || "normal",
    });

    /**
     * Render hCaptcha widget and provide necessary callbacks
     * and get the captcha ID from the returned value.
     */
    const captchaId = hcaptcha.render(captcha_ref, renderParams) as string;

    setState({ isRemoved: false, captchaId });
    if (onReady) onReady();
  };

  const resetCaptcha: HCaptchaFunctions["resetCaptcha"] = () => {
    if (!isReady() || !state.captchaId) return;

    // Reset captcha state, removes stored token and unticks checkbox.
    hcaptcha.reset(state.captchaId);
  };

  const removeCaptcha: HCaptchaFunctions["removeCaptcha"] = (callback) => {
    if (!isReady() || !state.captchaId) return;
    setState({ isRemoved: true });

    hcaptcha.remove(state.captchaId);
    callback && callback();
  };

  const executeSync: HCaptchaFunctions["executeSync"] = () => {
    if (!isReady() || !state.captchaId) return;
    return hcaptcha.execute(state.captchaId, { async: false });
  };

  const execute: HCaptchaFunctions["execute"] = async () => {
    if (!isReady() || !state.captchaId) return;

    const response = await hcaptcha.execute(state.captchaId, { async: true });
    return response as HCaptchaExecuteResponse;
  };

  const setData: HCaptchaFunctions["setData"] = (data) => {
    if (!isReady() || !state.captchaId) return;
    return hcaptcha.setData(state.captchaId, data);
  };

  const getResponse: HCaptchaFunctions["getResponse"] = () => {
    if (!state.captchaId) return null;
    return hcaptcha.getResponse(state.captchaId);
  };

  const getRespKey: HCaptchaFunctions["getRespKey"] = () => {
    if (!state.captchaId) return null;
    return hcaptcha.getRespKey(state.captchaId);
  };

  /**
   * Helpers to be returned on the `onLoad` callback.
   * Can be stored to perform actions on the hCaptcha widget later.
   */
  const hcaptcha_functions: HCaptchaFunctions = {
    execute,
    executeSync,
    getRespKey,
    getResponse,
    removeCaptcha,
    renderCaptcha,
    resetCaptcha,
    setData
  };

  /** Handle load with the `onLoad` prop. */
  const handleOnLoad = () => {
    /** Remove the function when it has been loaded. */
    window[HCAPTCHA_ONLOAD_FUNCTION_NAME] = () => undefined;

    const onReady = () => props.onLoad?.(hcaptcha_functions);
    renderCaptcha(onReady);
  };

  /**
   * Get response from the captcha
   * and dispatch it to the `onVerify` prop.
   */
  const handleSubmit = () => {
    if (typeof hcaptcha === "undefined" || state.isRemoved || !state.captchaId) return;
    if (!props.onVerify) return;

    // Get response token from hCaptcha widget.
    const token = hcaptcha.getResponse(state.captchaId);
    // Get current challenge session ID from hCaptcha widget.
    const ekey = hcaptcha.getRespKey(state.captchaId);

    // Dispatch event to verify user response.
    props.onVerify(token, ekey);
  };

  /** Handle expire with the `onExpire` prop. */
  const handleExpire = () => {
    if (!isReady() || !state.captchaId) return;

    // Reset captcha when running into error.
    hcaptcha.reset(state.captchaId);
    props.onExpire?.();
  };

  /** Handle error with the `onError` prop. */
  const handleError = (event: HCaptchaError) => {
    if (!isReady() || !state.captchaId) return;

    // Reset captcha when running into error.
    hcaptcha.reset(state.captchaId);
    props.onError?.(event);
  };

  /** Handle open with the `onOpen` prop. */
  const handleOpen = () => {
    if (!isReady()) return;
    props.onOpen?.();
  };

  /** Handle close with the `onClose` prop. */
  const handleClose = () => {
    if (!isReady()) return;
    props.onClose?.();
  };

  /** Handle the expired challenge with the `onChallengeExpired` prop. */
  const handleChallengeExpired = () => {
    if (!isReady()) return;
    props.onChallengeExpired?.();
  };

  /** On mount, initialize and load the hCaptcha script. */
  onMount(() => {
    if (!isApiReady()) {
      /** Create the hCaptcha main load function. */
      window[HCAPTCHA_ONLOAD_FUNCTION_NAME] = handleOnLoad;

      /** Insert the script in the `head` element. */
      createScriptLoader({ src: script_url() });
    }

    /**
     * If the API is already ready (`window.hcaptcha` exists)
     * render the captcha and trigger `onLoad` prop.
     */
    else handleOnLoad();
  });

  /** On unmount, reset and remove the hCaptcha widget. */
  onCleanup (() => {
    if (!isReady() || !state.captchaId) return;

    // Reset any stored variables / timers when unmounting.
    hcaptcha.reset(state.captchaId);
    hcaptcha.remove(state.captchaId);

    /**
     * We need to remove also the hCaptcha API on cleanup
     * because `script-loader` automatically removes the script
     * also on cleanup.
     *
     * See here: <https://github.com/solidjs-community/solid-primitives/blob/main/packages/script-loader/src/index.ts>.
     */
    window.hcaptcha = undefined as unknown as HCaptcha;
  });

  return (
    <div
      ref={captcha_ref!}
      id={props.id}
    />
  );
};

export default HCaptcha;
