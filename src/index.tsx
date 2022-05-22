import { Component, on } from "solid-js";
import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

import type { GenerateQueryParams } from "./utils";
import { generateQuery } from "./utils";

import type {
  HCaptchaConfig,
  HCaptchaProps,
  HCaptchaState
} from "./types";

declare global {
  interface Window {
    /**
     * Function that will be started when
     * the hCaptcha script will be loaded.
     */
    _hcaptchaOnLoad: () => void;
  }
}

// Create script to init hCaptcha.
const [onLoadListeners, setOnLoadListeners] = createSignal<(() => void)[]>([]);
const [apiScriptRequested, setApiScriptRequested] = createSignal(false);

/** Generate hCaptcha API script. */
const mountCaptchaScript = (params: GenerateQueryParams = {}) => {
  setApiScriptRequested(true);

  // Create global onload callback.
  window._hcaptchaOnLoad = () => {
    // Iterate over onload listeners, call each listener.
    setOnLoadListeners(listeners => listeners.filter(listener => {
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
  let captcha_ref: HTMLDivElement;

  const [state, setState] = createStore<HCaptchaState>({
    isApiReady: false,
    isRemoved: false,
    elementId: props.id || "solid-hcaptcha-script",
    captchaId: ""
  })

  const isApiReady = () => typeof window.hcaptcha !== "undefined";

  // Once captcha is mounted intialize hCaptcha.
  onMount(() => {

      // Check if hCaptcha has already been loaded, if not create script tag and wait to render captcha
      if (!isApiReady()) {

        if (!apiScriptRequested) {
            const config: HCaptchaConfig = props.config || {};

            // Only create the script tag once, use a global variable to track
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

        // Add onload callback to global onload listeners
        onLoadListeners.push(handleOnLoad);
      }

      else renderCaptcha();
    })


    onCleanup (() => {
        const { captchaId } = state;

        if (!isReady()) {
          return;
        }

        // Reset any stored variables / timers when unmounting
        hcaptcha.reset(captchaId);
        hcaptcha.remove(captchaId);
    });

    createEffect(() => {
        console.log("eff", props);

      // If they have changed, reuove current captcha and render a new one
        removeCaptcha(() => {
          renderCaptcha();
        });
    });

    const renderCaptcha = (onReady?: () => void) => {
      const { isApiReady } = state;
      if (!isApiReady) return;

      const renderParams = Object.assign({
        "open-callback"       : handleOpen,
        "close-callback"      : handleClose,
        "error-callback"      : handleError,
        "chalexpired-callback": handleChallengeExpired,
        "expired-callback"    : handleExpire,
        "callback"            : handleSubmit,
      }, props.config, {
        sitekey: props.sitekey,
        tabindex: props.tabindex,
        size: props.size,
        theme: props.theme
      });

      //Render hCaptcha widget and provide necessary callbacks - hCaptcha
      const captchaId = hcaptcha.render(captcha_ref, renderParams) as string;

      setState({ isRemoved: false, captchaId });
      onReady && onReady();
    }

    const resetCaptcha = () => {
      const { captchaId } = state;

      if (!isReady()) {
        return;
      }
      // Reset captcha state, removes stored token and unticks checkbox
      hcaptcha.reset(captchaId)
    }

    const removeCaptcha = (callback) => {
      const { captchaId } = state;

      if (!isReady()) {
        return;
      }

      setState({ isRemoved: true });

      hcaptcha.remove(captchaId);
      callback && callback()
    }

    const handleOnLoad = () => {
      setState({ isApiReady: true });

        // render captcha and wait for captcha id
        renderCaptcha(() => {
            // Trigger onLoad if it exists
            const { onLoad } = props;
            if (onLoad) onLoad();
        });
    }

    const handleSubmit = (event) => {
      const { onVerify } = props;
      const { isRemoved, captchaId } = state;

      if (typeof hcaptcha === 'undefined' || isRemoved) return

      const token = hcaptcha.getResponse(captchaId) //Get response token from hCaptcha widget
      const ekey  = hcaptcha.getRespKey(captchaId)  //Get current challenge session id from hCaptcha widget
      onVerify(token, ekey) //Dispatch event to verify user response
    }

    const handleExpire = () => {
      const { onExpire } = props;
      const { captchaId } = state;

      if (!isReady()) {
        return;
      }

      // If hCaptcha runs into error, reset captcha.
      hcaptcha.reset(captchaId)

      if (onExpire) onExpire();
    }

    const handleError = (event) => {
      const { onError } = props;
      const { captchaId } = state;

      if (!isReady()) {
        return;
      }

      // If hCaptcha runs into error, reset captcha.
      hcaptcha.reset(captchaId)
      if (onError) onError(event);
    }

    const isReady = () => {
      const { isApiReady, isRemoved } = state;

      return isApiReady && !isRemoved;
    }

    const handleOpen = () => {
      if (!isReady() || !props.onOpen) {
        return;
      }

      props.onOpen();
    }

    const handleClose = () => {
      if (!isReady() || !props.onClose) {
        return;
      }

      props.onClose();
    }

    const handleChallengeExpired = () => {
      if (!isReady() || !props.onChalExpired) {
        return;
      }

      props.onChalExpired();
    }

    const execute = (opts = null) => {
      const { captchaId } = state;

      if (!isReady()) {
        return;
      }

      if (opts && typeof opts !== "object") {
        opts = null;
      }

      return hcaptcha.execute(captchaId, opts);
    }

    const setData = (data) => {
      const { captchaId } = state;

      if (!isReady()) {
        return;
      }

      if (data && typeof data !== "object") {
        data = null;
      }

      hcaptcha.setData(captchaId, data);
    }

    const getResponse = () => {
      return hcaptcha.getResponse(state.captchaId);
    }

    const getRespKey = () => {
      return hcaptcha.getRespKey(state.captchaId)
    }

    return (
      <div ref={captcha_ref} id={state.elementId}></div>
    );
  }

export default HCaptcha;
