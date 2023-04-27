# CSS To Tailwind

Convert CSS code to Tailwindcss syntax in real time

convert online: [https://hymhub.github.io/css-to-tailwind](https://hymhub.github.io/css-to-tailwind)

<p align="center">
  <img src="https://raw.githubusercontent.com/hymhub/css-to-tailwind/HEAD/md/demo.gif">
<p>

## Use npm

### Install

```bash
npm i css-to-tailwind-translator
```

### Usage

```js
import { CssToTailwindTranslator } from "css-to-tailwind-translator";

const cssCode = `body {
  width: 100%;
  height: 50%;
  margin: 0 !important;
  background-color: transparent;
}`;

const conversionResult = CssToTailwindTranslator(cssCode);

console.log(conversionResult);
// {
//   code: 'OK',
//   data: [
//     {
//       selectorName: 'body',
//       resultVal: 'w-full h-1/2 !m-0 bg-transparent'
//     }
//   ]
// }
```

## Configuration

`CssToTailwindTranslator: (code: string, config?: TranslatorConfig)`

### `TranslatorConfig`

| Attribute |                                    Description                                     |  Type  |
| :-------: | :--------------------------------------------------------------------------------: | :----: |
| `prefix`  | [tailwind configuration prefix](https://tailwindcss.com/docs/configuration#prefix) | string |
