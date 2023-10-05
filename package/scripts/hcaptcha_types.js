import fs from "node:fs";

const path = new URL("../dist/index.d.ts", import.meta.url);
let content = fs.readFileSync(path, { encoding: "utf8" });

// Add the reference to the top of the TS declaration file.
content = `/// <reference types="@hcaptcha/types" />\n${content}`;

// Replace the file.
fs.writeFileSync(path, content, { encoding: "utf8" });
