import type { Component } from "solid-js";
import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

import type { GenerateQueryParams } from "./utils";
import { generateQuery } from "./utils";

import type {
  HCaptchaConfig,
  HCaptchaProps,
  HCaptchaState,
  HCaptchaFunctions
} from "./types";

declare global {
  interface Window {
    /** Function called when the hCaptcha script is loaded. */
    _hcaptchaOnLoad: () => void;
  }
}

// Create script to init hCaptcha.
const [_onLoadListeners, setOnLoadListeners] = createSignal<(() => void)[]>([]);
const [apiScriptRequested, setApiScriptRequested] = createSignal(false);

/** Generate hCaptcha API script. */
const mountCaptchaScript = (params: GenerateQueryParams = {}) => {
  console.info("mountCaptchaScript: mouting the hcaptcha api");
  setApiScriptRequested(true);

  // Create global onload callback.
  window._hcaptchaOnLoad = () => {
    /** Debug. */ console.info("_hcaptchaOnLoad: init.");

    // Iterate over onload listeners, call each listener.
    setOnLoadListeners(listeners => listeners.filter(listener => {
      /** Debug. */ console.info("_hcaptchaOnLoad: calling a listener.");
      listener();

      return false;
    }));
  }

  const domain = params.apihost || "https://js.hcaptcha.com";
  delete params.apihost;

  const script = document.createElement("script");
  script.src = `${domain}/1/api.js?render=explicit&onload=_hcaptchaOnLoad`;
  script.async = true;

  const query = generateQuery(params);
  script.src += query !== ""? `&${query}` : "";

  document.head.appendChild(script);
}

const HCaptcha: Component<HCaptchaProps> = (props) => {
  /** Reference of the div captcha element. */
  let captcha_ref: HTMLDivElement | undefined;
  
  const [state, setState] = createStore<HCaptchaState>({
    isApiReady: false,
    isRemoved: false,
    elementId: props.id || "solid-hcaptcha-script",
    captchaId: null
  });

  /** Whether the hCaptcha API (in `window`) is ready. */
  const isApiReady = () => typeof window.hcaptcha !== "undefined";

  /** Whether the hCaptcha widget is ready (in `window` and not removed). */
  const isReady = () => {
    const { isApiReady, isRemoved } = state;
    return isApiReady && !isRemoved;
  }

  /** Once component is mounted, intialize hCaptcha. */
  onMount(() => {
    console.info("onMount: checking if api is ready.");

    // Check if hCaptcha has already been loaded,
    // if not create script tag and wait to render captcha.
    if (!isApiReady()) {
      console.info("onMount: api isn't ready, check if we called it.");

      // Only create the script tag once, use a global variable to track.
      if (!apiScriptRequested()) {
        const config: HCaptchaConfig = props.config || {};
        /** debug */ console.info("onMount: api wasn't requested, mounting it with (config)", config);

        mountCaptchaScript({
          apihost: config.apihost,
          assethost: config.assethost,
          endpoint: config.endpoint,
          hl: config.hl,
          host: config.host,
          imghost: config.imghost,
          recaptchacompat: config.recaptchacompat === false ? "off" : null,
          reportapi: config.reportapi,
          sentry: config.sentry,
          custom: config.custom
        });
      }

      // Add onLoad callback to global onLoad listeners.
      setOnLoadListeners(listeners => [...listeners, handleOnLoad]);
    }

    else renderCaptcha();
  })

  /** On unmount, reset the hCaptcha widget. */
  onCleanup (() => {
    const { captchaId } = state;
    if (!isReady() || !captchaId) return;

    // Reset any stored variables / timers when unmounting.
    hcaptcha.reset(captchaId);
    hcaptcha.remove(captchaId);
  });

  const renderCaptcha: HCaptchaFunctions["renderCaptcha"] = (onReady) => {
    const { isApiReady } = state;
    if (!isApiReady || !captcha_ref) return;

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
    setState({ isApiReady: true });

    /** Render captcha and wait for captcha ID. */
    renderCaptcha(() => {
      const { onLoad } = props;
      
      /** Trigger `onLoad` prop if it exists. */
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
    console.log("handleError: (event):", event);

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

  return (
    <div
      ref={captcha_ref!}
      id={state.elementId}
    />
  );
}

export default HCaptcha;
