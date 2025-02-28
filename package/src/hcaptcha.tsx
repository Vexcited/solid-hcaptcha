import { type Component, createEffect, on, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import type {
  HCaptchaProps,
  HCaptchaState,
  HCaptchaFunctions,
  HCaptchaExecuteResponse
} from "./types";

// @ts-ignore - hCaptcha API is badly typed
import { hCaptchaLoader } from "@hcaptcha/loader";

const HCaptcha: Component<HCaptchaProps> = (props) => {
  let apiScriptRequest = false;

  const loadCaptcha = () => {
    if (apiScriptRequest) return;

    const mountParams = {
      render: "explicit" as const,
      apihost: props?.apihost,
      assethost: props?.assethost,
      endpoint: props?.endpoint,
      hl: props?.languageOverride,
      host: props?.host,
      imghost: props?.imghost,
      recaptchacompat: props?.reCaptchaCompat === false ? "off" : void 0,
      reportapi: props?.reportapi,
      sentry: props?.sentry,
      custom: props?.custom,
      loadAsync: props?.loadAsync ?? true,
      cleanup: props?.cleanup ?? true,
      scriptSource: props?.scriptSource,
      secureApi: props?.secureApi
    };

    hCaptchaLoader(mountParams)
      .then(handleOnLoad, handleError)
      .catch(handleError);

    apiScriptRequest = true;
  };

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
    if (!isApiReady()) return;

    /** Parameters for the hCaptcha widget. */
    const renderParams: ConfigRender = Object.assign({
      "open-callback"        : handleOpen,
      "close-callback"       : handleClose,
      "error-callback"       : handleError,
      "chalexpired-callback" : handleChallengeExpired,
      "expired-callback"     : handleExpire,
      "callback"             : handleSubmit
    }, props, {
      hl: props.hl || props.languageOverride,
      languageOverride: undefined
    });

    /**
     * Render hCaptcha widget and provide necessary callbacks
     * and get the captcha ID from the returned value.
     */
    const captchaId = hcaptcha.render(captcha_ref, renderParams) as string;

    setState({ isRemoved: false, captchaId });
    onReady?.();
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
    callback?.();
  };

  /** Handle load with the `onLoad` prop. */
  const handleOnLoad = () => {
    renderCaptcha(() => {
      props.onLoad?.(hcaptcha_functions);
    });
  };

  const executeSync: HCaptchaFunctions["executeSync"] = (rqdata?: string) => {
    if (!isReady() || !state.captchaId) return;
    return hcaptcha.execute(state.captchaId, { async: false, rqdata });
  };

  const execute: HCaptchaFunctions["execute"] = async (rqdata?: string) => {
    if (!isReady() || !state.captchaId) return;

    const response = await hcaptcha.execute(state.captchaId, { async: true, rqdata });
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

  /**
   * Get response from the captcha
   * and dispatch it to the `onVerify` prop.
   */
  const handleSubmit = () => {
    if (!isApiReady() || state.isRemoved || !state.captchaId) return;

    // Get response token from hCaptcha widget.
    const token = hcaptcha.getResponse(state.captchaId);
    // Get current challenge session ID from hCaptcha widget.
    const ekey = hcaptcha.getRespKey(state.captchaId);
    // Dispatch event to verify user response.
    props.onVerify?.(token, ekey);
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
    if (isReady() && state.captchaId) {
      // If hCaptcha runs into error, reset captcha.
      hcaptcha.reset(state.captchaId);
    }

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
    if (isApiReady()) {
      renderCaptcha();
    }

    /**
     * If the API is already ready (`window.hcaptcha` exists)
     * render the captcha and trigger `onLoad` prop.
     */
    loadCaptcha();
  });

  /** On unmount, reset and remove the hCaptcha widget. */
  onCleanup (() => {
    if (!isReady() || !state.captchaId) return;

    // Reset any stored variables / timers when unmounting.
    hcaptcha.reset(state.captchaId);
    hcaptcha.remove(state.captchaId);
  });

  createEffect(on([
    () => props.sitekey,
    () => props.size,
    () => props.theme,
    () => props.tabindex,
    () => props.languageOverride,
    () => props.endpoint
  ], () => removeCaptcha(() => renderCaptcha())));

  return (
    <div
      ref={captcha_ref}
      id={props.id}
    />
  );
};

export default HCaptcha;
