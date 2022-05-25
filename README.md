# Solid hCaptcha Component Library

> This is an unofficial port of [`@hcaptcha/react-hcaptcha`](https://github.com/hCaptcha/react-hcaptcha) for [Solid](https://www.solidjs.com).

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
import HCaptcha from "solid-hcaptcha";

const App: Component = () => {
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
import type { HCaptchaFunctions } from "solid-hcaptcha";
import HCaptcha from "solid-hcaptcha";

const App: Component = () => {
  let hcaptcha: HCaptchaFunctions | undefined;

  const submitCaptcha = async () => {
    if (!hcaptcha) return; // Check if the widget has loaded.

    // Execute the captcha and get the response.
    const response = await hcaptcha.execute();
    console.log(response);
  }

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

<!-- ## API -->

## Development

> `git clone https://github.com/Vexcited/solid-hcaptcha`

I use `pnpm` as the package manager, so run `pnpm install` to install the dependencies.

### Scripts

* `pnpm build`: Builds to the `dist` folder.
* `pnpm lint`: Checks if there's any TypeScript error.
* `pnpm release`: Script that I use to release new versions of this package.

### Example

You can see how to contribute to the [example website](https://vexcited.github.io/solid-hcaptcha) in the [`example` folder](./example/). 