/* eslint-disable max-len */
import { DOMParser, XMLSerializer } from "xmldom";

function addNewLines(data) {
  const split = data.match(/.{1,76}/g);

  const joined = split.join("\n");

  // console.log(joined);

  return joined;
}

export const Scratch = (w: number, h: number): string => {
  const SVGDomElement = new DOMParser().parseFromString(
    ` 
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}"  x="0px" y="0px"
	 viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
	.st0{fill:url(#SVGID_1_);}
	.st1{fill:#fff;}
</style>
<g id="Cut">
	<g>
	 
		<path class="st0" d="M26.9,218c0,25,5.8,49.8,17,73c11.2,23.1,27.6,44.2,48.4,61.9c20.7,17.7,45.3,31.7,72.4,41.3
			c27.1,9.6,56.1,14.5,85.4,14.5s58.3-4.9,85.4-14.5c27.1-9.6,51.7-23.6,72.4-41.3c20.7-17.7,37.1-38.7,48.4-61.9s17-47.9,17-73
			C473.1,218,26.9,218,26.9,218z"/>
		<g>
			<path class="st1" d="M424.3,218H76.1c54.7,3.6,113,3.5,173.8,3.5C310.8,221.5,369.6,221.7,424.3,218z"/>
		</g>
	</g>
</g>
</svg>

  `,
    "application/xml"
  );
  const serializedSVG = new XMLSerializer().serializeToString(SVGDomElement);
  return `data:image/svg+xml;base64, ${addNewLines(btoa(serializedSVG))}`;
};
