/* eslint-disable max-len */
import { DOMParser, XMLSerializer } from "xmldom";

export const Base = (): string => {
  const SVGDomElement = new DOMParser().parseFromString(
    `
    <svg xmlns="http://www.w3.org/2000/svg" width="388.854" height="388.854" viewBox="0 0 388.854 388.854">
  <g id="Rectangle_2204" data-name="Rectangle 2204" transform="translate(0 129)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2205" data-name="Rectangle 2205" transform="translate(129 129)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2206" data-name="Rectangle 2206" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2207" data-name="Rectangle 2207" transform="translate(129)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2208" data-name="Rectangle 2208" transform="translate(258)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2209" data-name="Rectangle 2209" transform="translate(258 129)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2210" data-name="Rectangle 2210" transform="translate(0 258)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2211" data-name="Rectangle 2211" transform="translate(129 258)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <g id="Rectangle_2212" data-name="Rectangle 2212" transform="translate(258 258)" fill="none" stroke="#707070" stroke-width="1">
    <rect width="130" height="130" stroke="none"/>
    <rect x="0.5" y="0.5" width="129" height="129" fill="none"/>
  </g>
  <line id="Line_1" data-name="Line 1" y1="387" x2="388" transform="translate(0.5 1.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_2" data-name="Line 2" x2="388" y2="388" transform="translate(0.5 0.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_3" data-name="Line 3" y1="258" x2="258" transform="translate(0.5 0.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_4" data-name="Line 4" y1="258" x2="259" transform="translate(129.5 130.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_5" data-name="Line 5" x2="258" y2="258" transform="translate(0.5 130.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_6" data-name="Line 6" x2="258" y2="258" transform="translate(129.5 0.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_7" data-name="Line 7" x2="129" y2="129" transform="translate(258.5 1.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_8" data-name="Line 8" x1="128" y2="129" transform="translate(1.5 0.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_9" data-name="Line 9" x2="129" y2="129" transform="translate(0.5 258.5)" fill="none" stroke="#707070" stroke-width="1"/>
  <line id="Line_10" data-name="Line 10" y1="129" x2="129" transform="translate(258.5 258.5)" fill="none" stroke="#707070" stroke-width="1"/>
</svg>
`,
    "application/xml"
  );

  const serializedSVG = new XMLSerializer().serializeToString(SVGDomElement);
  return `data:image/svg+xml;base64, ${btoa(unescape(encodeURIComponent(serializedSVG)))}`;
};
