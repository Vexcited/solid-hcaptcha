# Solid hCaptcha Component Library

> This is an unofficial port of [`react-hcaptcha`](https://github.com/hCaptcha/react-hcaptcha) for [Solid](https://www.solidjs.com).

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

```typescript
// First, import the component.
import HCaptcha from "solid-hcaptcha";

// Then use it in your components !
const App: Component = () => {
  return (
    <HCaptcha
      sitekey="10000000-ffff-ffff-ffff-000000000001"
      onVerify={token => console.log(token)}
      theme="light"
      size="normal"
    />
  );
};

export default App;
``` 

## Development

> `git clone https://github.com/Vexcited/solid-hcaptcha`

I use `pnpm` as the package manager, so run `pnpm install` to install the dependencies.

### Scripts

* `pnpm build`: Builds to the `dist` folder.
* `pnpm lint`: Checks if there's any TypeScript error.
* `pnpm release`: Script that I use to release new versions of this package.

### Example

You can see how to contribute to the [example website](https://vexcited.github.io/solid-hcaptcha) in the [`example` folder](./example/). 