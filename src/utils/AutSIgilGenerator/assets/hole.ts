/* eslint-disable max-len */
import { DOMParser, XMLSerializer } from "xmldom";

export const Hole = (): string => {
  const SVGDomElement = new DOMParser().parseFromString(
    ` 
    <svg id="uuid-1664ba71-e8d1-43c7-816e-e1a471884772" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="58" height="58" viewBox="0 0 1720 1721">
    <defs>
      <filter id="uuid-bd9f1a26-ab80-4058-9cb5-2f976a5390ed" data-name="outer-glow-1" filterUnits="userSpaceOnUse">
        <feOffset dx="0" dy="0"/>
        <feGaussianBlur result="uuid-0c59ea5d-51f8-44ff-b477-0101dee08b71" stdDeviation="120"/>
        <feFlood flood-color="#192afc" flood-opacity="1"/>
        <feComposite in2="uuid-0c59ea5d-51f8-44ff-b477-0101dee08b71" operator="in"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <filter id="uuid-6f6f7270-4202-4586-a21a-c0d65d93e151" data-name="outer-glow-2" filterUnits="userSpaceOnUse">
        <feOffset dx="0" dy="0"/>
        <feGaussianBlur result="uuid-648d3e97-5c04-4ca1-a707-58541e8dc3d5" stdDeviation="120"/>
        <feFlood flood-color="#14ecec" flood-opacity="1"/>
        <feComposite in2="uuid-648d3e97-5c04-4ca1-a707-58541e8dc3d5" operator="in"/>
        <feComposite in="SourceGraphic"/>
      </filter>
    </defs>
    <g id="uuid-9c1f8b11-b5c8-404d-b4d3-c207316442ba" data-name="Whole">
      <circle cx="860" cy="860.29" r="500" fill="#262626" filter="url(#uuid-bd9f1a26-ab80-4058-9cb5-2f976a5390ed)"/>
      <circle cx="860" cy="860.29" r="500" fill="#262626" filter="url(#uuid-6f6f7270-4202-4586-a21a-c0d65d93e151)"/>
    </g>
  </svg>

  `,
    "application/xml"
  );
  const serializedSVG = new XMLSerializer().serializeToString(SVGDomElement);
  return `data:image/svg+xml;base64, ${btoa(unescape(encodeURIComponent(serializedSVG)))}`;
};
