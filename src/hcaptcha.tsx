import type { Component } from "solid-js";

import { createScriptLoader } from "@solid-primitives/script-loader";
import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { generateScriptUrl } from "./utils";

import type {
  HCaptchaConfig,
  HCaptchaProps,
  HCaptchaState,
  HCaptchaFunctions
} from "./types";

/** The name of the function that will be triggered when hCaptcha is loaded. */
const HCAPTCHA_ONLOAD_FUNCTION_NAME = "__hCaptchaOnLoad__";

declare global {
  interface Window {
    [HCAPTCHA_ONLOAD_FUNCTION_NAME]: () => void;
  }
}

const HCaptcha: Component<HCaptchaProps> = (props) => {
  const config: HCaptchaConfig = props.config || {};

  const script_url = generateScriptUrl({
    assethost: config.assethost,
    endpoint: config.endpoint,
    hl: config.hl,
    host: config.host,
    imghost: config.imghost,
    recaptchacompat: config.recaptchacompat === false ? "off" : null,
    reportapi: config.reportapi,
    sentry: config.sentry,
    custom: config.custom
  }, HCAPTCHA_ONLOAD_FUNCTION_NAME, config.apihost);

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
    elementId: props.id,
    captchaId: null
  });

  const renderCaptcha: HCaptchaFunctions["renderCaptcha"] = (onReady) => {
    if (!captcha_ref) return;

    /** Parameters for the hCaptcha widget. */
    const renderParams = Object.assign({
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
      "size"                 : props.size     || "normal"
    });

    /**
     * Render hCaptcha widget and provide necessary callbacks
     * and get the captcha ID from the returned value.
     */
    const captchaId = hcaptcha.render(captcha_ref, renderParams) as string;

    setState({ isRemoved: false, captchaId });
    if (onReady) onReady();
  }

  const resetCaptcha: HCaptchaFunctions["resetCaptcha"] = () => {
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    // Reset captcha state, removes stored token and unticks checkbox.
    hcaptcha.reset(captchaId)
  }

  const removeCaptcha: HCaptchaFunctions["removeCaptcha"] = (callback) => {
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    setState({ isRemoved: true });

    hcaptcha.remove(captchaId);
    callback && callback()
  };

  const executeSync: HCaptchaFunctions["executeSync"] = () => {
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    return hcaptcha.execute(captchaId, { async: false });
  };

  const execute: HCaptchaFunctions["execute"] = async () => {
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    const response = await hcaptcha.execute(captchaId, { async: true }) as HCaptchaResponse;
    return response;
  };

  const setData: HCaptchaFunctions["setData"] = (data) => {
    const { captchaId } = state;
    if (!captchaId) return;

    if (!isReady()) return;
    hcaptcha.setData(captchaId, data);
  }

  const getResponse: HCaptchaFunctions["getResponse"] = () => {
    const { captchaId } = state;
    if (!captchaId) return null;

    return hcaptcha.getResponse(captchaId);
  }

  const getRespKey: HCaptchaFunctions["getRespKey"] = () => {
    const { captchaId } = state;
    if (!captchaId) return null;

    return hcaptcha.getRespKey(captchaId)
  }

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

    renderCaptcha(() => {
      const { onLoad } = props;
      if (onLoad) onLoad(hcaptcha_functions);
    });
  };

  /**
   * Get response from the captcha
   * and dispatch it to the `onVerify` prop.
   */
  const handleSubmit = () => {
    const { isRemoved, captchaId } = state;
    if (typeof hcaptcha === "undefined" || isRemoved || !captchaId) return
    
    const { onVerify } = props;
    if (!onVerify) return;

    // Get response token from hCaptcha widget.
    const token = hcaptcha.getResponse(captchaId); 
    // Get current challenge session ID from hCaptcha widget. 
    const ekey  = hcaptcha.getRespKey(captchaId);  
    
    // Dispatch event to verify user response.
    onVerify(token, ekey);
  };

  /** Handle expire with the `onExpire` prop. */
  const handleExpire = () => {
    const { onExpire } = props;
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    // Reset captcha when running into error.
    hcaptcha.reset(captchaId)
    if (onExpire) onExpire();
  };

  /** Handle error with the `onError` prop. */
  const handleError = (event: string) => {
    const { onError } = props;
    const { captchaId } = state;

    if (!isReady() || !captchaId) return;

    // Reset captcha when running into error.
    hcaptcha.reset(captchaId)
    if (onError) onError(event);
  };

  /** Handle open with the `onOpen` prop. */
  const handleOpen = () => {
    if (!isReady() || !props.onOpen) return;
    props.onOpen();
  };

  /** Handle close with the `onClose` prop. */
  const handleClose = () => {
    if (!isReady() || !props.onClose) return;
    props.onClose();
  };

  /** Handle the expired challenge with the `onChallengeExpired` prop. */
  const handleChallengeExpired = () => {
    if (!isReady() || !props.onChallengeExpired) return;
    props.onChallengeExpired();
  };

  /** On mount, initialize and load the hCaptcha script. */
  onMount(() => {
    if (!isApiReady()) {
      /** Create the hCaptcha main load function. */
      window[HCAPTCHA_ONLOAD_FUNCTION_NAME] = () => handleOnLoad();

      /** Insert the script in the `head` element. */
      createScriptLoader({
        src: script_url
      });
  
    } else handleOnLoad();
  });

  /** On unmount, reset and remove the hCaptcha widget. */
  onCleanup (() => {
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    // Reset any stored variables / timers when unmounting.
    hcaptcha.reset(captchaId);
    hcaptcha.remove(captchaId);

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
      id={state.elementId}
    />
  );
}

export default HCaptcha;
