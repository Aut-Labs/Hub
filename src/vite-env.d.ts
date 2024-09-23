/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { HTMLAttributes } from "react";


declare namespace JSX {
    interface IntrinsicElements {
      "d-aut": HTMLAttributes<HTMLElement>;
    }
  }