import { SigilOutput } from "./Sigil.model";
import { LoadImage } from "./ImageLoader";
import { Scratch } from "./assets/scratch";
import { Base } from "./assets/base";
import { Hole } from "./assets/hole";
import { randomIntFromInterval } from "./utils";
import { drawScratch } from "./DrawScratchFunctions";
import { drawHole } from "./DrawHoleFunctions";
// import * as fs from "fs";
// import { Blob } from "node:buffer";
import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas,
  loadImage
} from "canvas";

const sigilCache: { [key: string]: SigilOutput } = {};

const drawSigil = async (ctx: CanvasRenderingContext2D, address: string) => {
  const url3 = Scratch(500, 500);
  const url2 = Scratch(500 - 500 / 3, 500 - 500 / 3);
  const url4 = Scratch(500 + 500 / 5, 500 + 500 / 5);
  const holeUrl = Hole();
  const baseUrl = Base();
  const base = await loadImage(baseUrl);
  const mark3 = await loadImage(url3);
  const mark2 = await loadImage(url2);
  const mark4 = await loadImage(url4);
  const hole = await loadImage(holeUrl);

  const d = (base.height as number) * Math.sqrt(2);
  const xSquared = (d / 2) ** 2 + (d / 2) ** 2;
  const x = Math.sqrt(xSquared) / 2;
  ctx.translate(300, 300);
  // ctx.drawImage(base as any, x * -1, x * -1);

  const zoneHeight = Math.sqrt(xSquared) / 3;
  const zoneDiagonal = zoneHeight * Math.sqrt(2);
  const tripleDiagonalOffestX = 30;
  const tripleDiagonalOffestY = 60;

  const doubleDiagonalOffsetX = 90;
  const doubleMarkOffset = 66;
  // for (let i = 0; i < 9; i++) {
  //   input.push(randomIntFromInterval(1, 9, input[i - 1], input[i - 2]));
  // }

  const parsedAddress = parseInt(`0x${address.substring(35)}`, 16);
  const baseNine = parsedAddress.toString(9);
  const input = baseNine.split("");

  for (let i = 0; i < input.length; i++) {
    if (input[i + 1]) {
      const firstNumber = parseInt(input[i], 10) + 1;
      const secondNumber = parseInt(input[i + 1], 10) + 1;
      const value = [firstNumber, secondNumber].join("");
      if (
        value !== "11" &&
        value !== "22" &&
        value !== "33" &&
        value !== "44" &&
        value !== "55" &&
        value !== "66" &&
        value !== "77" &&
        value !== "88" &&
        value !== "99"
      ) {
        drawScratch(
          value,
          ctx,
          mark3,
          mark2,
          mark4,
          zoneHeight,
          zoneDiagonal,
          doubleMarkOffset,
          tripleDiagonalOffestX,
          tripleDiagonalOffestY,
          doubleDiagonalOffsetX
        );
      }
    }
  }
  // const firstHoleFromBase9 = parseInt(input[0]) + 1;
  // const lastHoleFromBase9 = parseInt(input[input.length - 1]) + 1;
  // drawHole(firstHoleFromBase9, ctx, hole, zoneHeight);
  // drawHole(lastHoleFromBase9, ctx, hole, zoneHeight);
};

export const generateAutIdHubSigil = async (
  address: string
): Promise<SigilOutput> => {
  if (sigilCache[address]) {
    return sigilCache[address];
  }
  const canvasWidth = 600;
  const canvasHeight = 600;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  // ctx.imageSmoothingQuality = "high";

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  await drawSigil(ctx, address);

  const result: SigilOutput = {
    previewElement: canvas,
    toBase64: () => canvas.toDataURL()
  };
  sigilCache[address] = result;
  return result;
};
