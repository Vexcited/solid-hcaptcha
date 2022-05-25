export interface HCaptchaUrlParams {
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | null
}

export const generateScriptUrl = (params: HCaptchaUrlParams, onLoadFunctionName: string, apihost?: string) => {
  const domain = apihost || "https://js.hcaptcha.com";
  const url = new URL(domain);
  url.pathname = "/1/api.js";

  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    url.searchParams.set(encodeURIComponent(key), encodeURIComponent(value));
  }

  // Tell hCaptcha to not automatically render the widget.
  url.searchParams.set("render", "explicit");
  url.searchParams.set("onload", onLoadFunctionName);

  return url.toString();
}