# Solid hCaptcha Component Library

> This is a port of [`@hcaptcha/react-hcaptcha`](https://github.com/hCaptcha/react-hcaptcha) for [Solid](https://www.solidjs.com).

[hCaptcha](https://www.hcaptcha.com) is a drop-replacement for reCAPTCHA that protects user privacy, rewards websites, and helps companies get their data labeled.

Sign up at [hCaptcha](https://www.hcaptcha.com) to get your sitekey today. **You need a sitekey to use this library.**

1. [Installation](#installation)
2. [Implementation](#implementation)
3. [References](#references)
4. [Debugging](#debugging)

## Installation

You can install this library via your favorite package manager.

```bash
# npm
npm install solid-hcaptcha --save

# Yarn
yarn add solid-hcaptcha

# pnpm
pnpm add solid-hcaptcha
```

## Implementation

> You can see multiple demos on the [example website](https://vexcited.github.io/solid-hcaptcha).

### Basic Usage

```tsx
import type { HCaptchaExecuteResponse } from "solid-hcaptcha";
import HCaptcha from "solid-hcaptcha";

const App: Component = () => {
  const handleVerify = (token: string, eKey: string) => {
    console.log(token, eKey);
  };

  return (
    <HCaptcha
      sitekey="10000000-ffff-ffff-ffff-000000000001"
      onVerify={token => console.log(token)}
    />
  );
};

export default App;
```

### Programmatic Usage

```tsx
import type {
  HCaptchaFunctions,
  HCaptchaExecuteResponse
} from "solid-hcaptcha";

import HCaptcha from "solid-hcaptcha";
import { createSignal } from "solid-js";

const App: Component = () => {
  const [captchaResponse, setCaptchaResponse] = createSignal<HCaptchaExecuteResponse | null>(null);
  let hcaptcha: HCaptchaFunctions | undefined;

  const submitCaptcha = async () => {
    if (!hcaptcha) return; // Check if the widget has loaded.

    // Execute the captcha and get the response.
    const response = await hcaptcha.execute();

    setCaptchaResponse(response);
    console.log("stored response", response);
  };

  return (
    <div>
      <HCaptcha
        sitekey="10000000-ffff-ffff-ffff-000000000001"
        onLoad={hcaptcha_instance => (hcaptcha = hcaptcha_instance)}
        size="invisible"
      />

      <button onClick={submitCaptcha}>
        Open captcha
      </button>
    </div>
  );
};

export default App;
```

## References

### Props

| Name | Values/Type | Required | Default | Description |
| ---- | ----------- | -------- | ------- | ----------- |
| `sitekey` | `string` | **Yes** | `-` | This is your sitekey, this allows you to load captcha. If you need a sitekey, please visit hCaptcha, and sign up to get your sitekey. |
| `size` | `"normal" \| "compact" \| "invisible"` | No | `"normal"` | This specifies the "size" of the component. hCaptcha allows you to decide how big the component will appear on render, this always defaults to normal. |
| `theme` | `"light" \| "dark" \| "constrast"` or `object` | No | `"light"` | hCaptcha supports both a light and dark theme. If no theme is inherently set, the captcha will always default to light. Takes `object` if custom theme is used. |
| `tabindex` | `number` | No | `0` | Set the tabindex of the widget and popup. When appropriate, this can make navigation of your site more intuitive. |
| `id` | `string` | No | `-` | Set an ID to the hCaptcha widget. Make sure each hCaptcha component generated on a single page has its own unique ID when using this prop. |
| `reCaptchaCompat` | `boolean` | No | `true` | Disable drop-in replacement for reCAPTCHA with `false` to prevent hCaptcha from injecting into `window.grecaptcha`. |
| `languageOverride` | `string` (ISO 639-2 code) | No | `auto` | hCaptcha auto-detects language via the user's browser. This overrides that to set a default UI language. See [language codes](https://hcaptcha.com/docs/languages). |
| `apihost` | `string` | No | `-` | See enterprise docs. |
| `assethost` | `string` | No | `-` | See enterprise docs. |
| `endpoint` | `string` | No | `-` | See enterprise docs. |
| `host` | `string` | No | `-` | See enterprise docs. |
| `imghost` | `string` | No | `-` | See enterprise docs. |
| `reportapi` | `string` | No | `-` | See enterprise docs. |
| `secureApi` | `boolean` | No |`-`| See enterprise docs. |
| `scriptSource` | `string` | No |`-`| See enterprise docs. |
| `sentry` | `boolean` | **Yes** | `-` | Should enable Sentry reporting for hCaptcha. |
| `custom` | `boolean` | No | `-` | Custom theme: see enterprise docs. |
| `cleanup` | `boolean` | No | `true` | Remove script tag after setup. |
| `loadAsync` | `boolean` | No | `true` | Set if the script should be loaded asynchronously. |

### Events Props

| Event | Params | Description |
| ----- | ------ | ----------- |
| `onError` | `error: HCaptchaError` | When an error occurs. Component will reset immediately after an error. |
| `onVerify` | `token: string, eKey: string` | When challenge is completed. The response `token` and an `eKey` (session ID) are passed along. |
| `onExpire` | `-` | When the current token expires. |
| `onLoad` | `hcaptcha: HCaptchaFunctions` | When the hCaptcha API loads. The hCaptcha instance is passed along. You can store them to use, later, [its methods](#methods-from-hcaptcha-instance-hcaptchafunctions). |
| `onOpen` | `-` | When the user display of a challenge starts. |
| `onClose` | `-` | When the user dismisses a challenge. |
| `onChallengeExpired` | `-` | When the user display of a challenge times out with no answer. |

### Methods from hCaptcha instance (`HCaptchaFunctions`)

| Method | Description |
| ------ | ----------- |
| `execute()` | Programmatically trigger a challenge request. Additionally, this method is run asynchronously and returns a promise with the `token` and `eKey` when the challenge is completed. |
| `executeSync()` | Programmatically trigger a challenge request but doesn't return the captcha response. |
| `getRespKey()` | Get the current challenge reference ID. |
| `getResponse()` | Get the current challenge response token from completed challenge. |
| `renderCaptcha(onReady?: () => unknown)` | Manually render the hCaptcha widget. |
| `removeCaptcha(callback?: () => unknown)` | Manually remove the hCaptcha widget from the DOM. |
| `resetCaptcha()` | Reset the current challenge. |
| `setData()` | See enterprise docs. |

> **Note** \
> Make sure to reset the hCaptcha state when you submit your form by calling the method `.resetCaptcha` on your hCaptcha Solid Component! Passcodes are one-time use, so if your user submits the same passcode twice then it will be rejected by the server the second time.

Please note that "invisible" simply means that no hCaptcha button will be rendered. Whether a challenge shows up will depend on the sitekey difficulty level. Note to hCaptcha Enterprise ([BotStop](https://www.botstop.com)) users: select "Passive" or "99.9% Passive" modes to get this No-CAPTCHA behavior.

## Debugging

### Make sure you don't double-import the `api.js` script

Importing the JS SDK twice can cause unpredictable behavior, so don't do a direct import separately if you are using solid-hcaptcha.

### Make sure you are using `reCaptchaCompat={false}` if you have the reCAPTCHA JS loaded on the same page

The hCaptcha "compatibility mode" will interfere with reCAPTCHA, as it adds properties with the same name. If for any reason you are running both hCaptcha and reCAPTCHA in parallel (we recommend only running hCaptcha) then please disable our compatibility mode.

### Avoid conflicts with legacy Sentry package usage on solid-hcaptcha 1.0.0+

If you are using Sentry 7.x in your SolidJS app, this can conflict with the upstream `hcaptcha-loader` package's Sentry error tracing.
You can avoid this issue by setting the `sentry` prop to `false`.
