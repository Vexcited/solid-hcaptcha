# Solid hCaptcha Component Library

> This is a port of [`@hcaptcha/react-hcaptcha`](https://github.com/hCaptcha/react-hcaptcha) for [Solid](https://www.solidjs.com).

## Description

[hCaptcha](https://www.hcaptcha.com) is a drop-replacement for reCAPTCHA that protects user privacy, rewards websites, and helps companies get their data labeled.

Sign up at [hCaptcha](https://www.hcaptcha.com) to get your sitekey today. You need a sitekey to use this library.

## Installation

You can install this library via your favorite package manager.

```bash
# NPM
npm install solid-hcaptcha --save

# Yarn
yarn add solid-hcaptcha

# PNPm
pnpm add solid-hcaptcha
```

## Usage

> You can see multiple use cases on the [example website](https://vexcited.github.io/solid-hcaptcha).


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

## API

### Props

| Name | Values/Type | Required | Default | Description |
| ---- | ----------- | -------- | ------- | ----------- |
| `sitekey` | `string` | **Yes** | `-` | This is your sitekey, this allows you to load captcha. If you need a sitekey, please visit hCaptcha, and sign up to get your sitekey. |
| `size` | `"normal" | "compact" | "invisible"` | No | `"normal"` | This specifies the "size" of the component. hCaptcha allows you to decide how big the component will appear on render, this always defaults to normal. |
| `theme` | `"light" | "dark"` | No | `"light"` | hCaptcha supports both a light and dark theme. If no theme is inherently set, the captcha will always default to light. |
| `tabindex` | `number` | No | `0` | Set the tabindex of the widget and popup. When appropriate, this can make navigation of your site more intuitive. |
| `id` | `string` | No | `-` | Set an ID to the hCaptcha widget. Make sure each hCaptcha component generated on a single page has its own unique ID when using this prop. |
| `config` | [`HCaptchaConfig`](#advanced-configuration) | No | `{}` | Advanced configuration for the hCaptcha component. |

### Advanced Configuration

All the parameters are optional.

| Name | Values/Type | Default | Description |
| ---- | ----------- | ------- | ----------- |
| `recaptchacompat` | `boolean` | `true` | Disable drop-in replacement for reCAPTCHA with `false` to prevent hCaptcha from injecting into `window.grecaptcha`. |
| `hl` | `string` (ISO 639-2 code) | `auto` | hCaptcha auto-detects language via the user's browser. This overrides that to set a default UI language. See [language codes](https://hcaptcha.com/docs/languages). |
| `apihost` | `string` | `-` | See enterprise docs. |
| `assethost` | `string` | `-` | See enterprise docs. |
| `endpoint` | `string` | `-` | See enterprise docs. |
| `host` | `string` | `-` | See enterprise docs. |
| `imghost` | `string` | `-` | See enterprise docs. |
| `reportapi` | `string` | `-` | See enterprise docs. |
| `sentry` | `string` | `-` | See enterprise docs. |
| `custom` | `boolean` |`-` | See enterprise docs. |

### Events Props

| Event | Params | Description |
| ----- | ------ | ----------- |
| `onError` | `error: HCaptchaError` | When an error occurs. Component will reset immediately after an error. |
| `onVerify` | `token: string, eKey: string` | When challenge is completed. The response `token` and an `eKey` (session ID) are passed along. |
| `onExpire` | `-` | When the current token expires. |
| `onLoad` | `hcaptcha: HCaptchaFunctions` | When the hCaptcha API loads. The hCaptcha instance is passed along. You can store them to use, later, [its methods](#methods-from-hcaptcha-instance-type-hcaptchafunctions). |
| `onOpen` | `-` | When the user display of a challenge starts. |
| `onClose` | `-` | When the user dismisses a challenge. |
| `onChallengeExpired` | `-` | When the user display of a challenge times out with no answer. |

### Methods from hCaptcha instance (type `HCaptchaFunctions`)

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

**NOTE**: Make sure to reset the hCaptcha state when you submit your form by calling the method `.resetCaptcha` on your hCaptcha Solid Component ! Passcodes are one-time use, so if your user submits the same passcode twice then it will be rejected by the server the second time.

Please note that "invisible" simply means that no hCaptcha button will be rendered. Whether a challenge shows up will depend on the sitekey difficulty level. Note to hCaptcha Enterprise ([BotStop](https://www.botstop.com)) users: select "Passive" or "99.9% Passive" modes to get this No-CAPTCHA behavior.

## Development (for /package)

> `git clone https://github.com/Vexcited/solid-hcaptcha`

I use `pnpm` as the package manager, so run `pnpm install` to install the dependencies.

### Scripts

* `pnpm build`: Lints and builds to the `dist` folder.
* `pnpm lint`: Checks if there's any TypeScript error.
* `pnpm release`: Runs `release-it` to release new versions.

### Example Website

You can see how to contribute to the [example website](https://vexcited.github.io/solid-hcaptcha/) in the [`example` folder](/example/).
