import { checkReversed } from "./utils";

// trip horizontal

function OneSix(ctx, mark, zoneHeight) {
  ctx.drawImage(mark, (mark.height / 2) * -1, -218 - zoneHeight);
}

function TwoFive(ctx, mark) {
  ctx.drawImage(mark, (mark.height / 2) * -1, -218);
}

function EightSeven(ctx, mark, zoneHeight) {
  ctx.drawImage(mark, (mark.height / 2) * -1, -218 + zoneHeight);
}

// trip vertical

function OneEight(ctx, mark, zoneHeight) {
  ctx.rotate((90 * Math.PI) / 180);

  ctx.drawImage(mark, (mark.height / 2) * -1, -218 + zoneHeight);

  ctx.rotate((-90 * Math.PI) / 180);
}

function FourThree(ctx, mark) {
  ctx.rotate((90 * Math.PI) / 180);

  ctx.drawImage(mark, (mark.height / 2) * -1, -218);

  ctx.rotate((-90 * Math.PI) / 180);
}

function SixSeven(ctx, mark, zoneHeight) {
  ctx.rotate((90 * Math.PI) / 180);

  ctx.drawImage(mark, (mark.height / 2) * -1, -218 - zoneHeight);

  ctx.rotate((-90 * Math.PI) / 180);
}

// trip left lean

function OneThree(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - triplediagonalOffestX,
    -218 + triplediagonalOffestY
  );
  ctx.rotate((-63 * Math.PI) / 180);
}

function FourSeven(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + triplediagonalOffestX,
    -218 - triplediagonalOffestY
  );
  ctx.rotate((-63 * Math.PI) / 180);
}

// trip right lean

function FourEight(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((-63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - triplediagonalOffestX,
    -218 - triplediagonalOffestY
  );
  ctx.rotate((63 * Math.PI) / 180);
}
function SixThree(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((-63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + triplediagonalOffestX,
    -218 + triplediagonalOffestY
  );
  ctx.rotate((63 * Math.PI) / 180);
}

// trip horizontal left lean
function OneFive(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.rotate((-63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - triplediagonalOffestX,
    -218 - triplediagonalOffestY
  );
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.rotate((63 * Math.PI) / 180);
}

function TwoSeven(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.rotate((-63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + triplediagonalOffestX,
    -218 + triplediagonalOffestY
  );
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.rotate((63 * Math.PI) / 180);
}

// trip horizontal right lean

function TwoSix(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.rotate((63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - triplediagonalOffestX,
    -218 + triplediagonalOffestY
  );
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.rotate((-63 * Math.PI) / 180);
}
function EightFive(ctx, mark, triplediagonalOffestX, triplediagonalOffestY) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.rotate((63 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + triplediagonalOffestX,
    -218 - triplediagonalOffestY
  );
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.rotate((-63 * Math.PI) / 180);
}

// double

function OneNine(ctx, mark, doubleDiagonalOffsetX) {
  ctx.rotate((45 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleDiagonalOffsetX,
    (mark.height / 2) * -1 + 23
  );
  ctx.rotate((-45 * Math.PI) / 180);
}

function NineSeven(ctx, mark, doubleDiagonalOffsetX) {
  ctx.rotate((45 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleDiagonalOffsetX,
    (mark.height / 2) * -1 + 23
  );
  ctx.rotate((-45 * Math.PI) / 180);
}

function TwoThree(ctx, mark, zoneDiagonal) {
  ctx.rotate((45 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1,
    (mark.height / 2) * -1 + 23 + zoneDiagonal / 2
  );
  ctx.rotate((-45 * Math.PI) / 180);
}

function FourFive(ctx, mark, zoneDiagonal) {
  ctx.rotate((45 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1,
    (mark.height / 2) * -1 + 23 - zoneDiagonal / 2
  );
  ctx.rotate((-45 * Math.PI) / 180);
}

// double right

function NineSix(ctx, mark) {
  const doubleDiagonalOffsetX = 90;

  ctx.rotate((-45 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleDiagonalOffsetX,
    (mark.height / 2) * -1 + 23
  );
  ctx.rotate((45 * Math.PI) / 180);
}

function EightNine(ctx, mark) {
  const doubleDiagonalOffsetX = 90;
  ctx.rotate((-45 * Math.PI) / 180);

  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleDiagonalOffsetX,
    (mark.height / 2) * -1 + 23
  );
  ctx.rotate((45 * Math.PI) / 180);
}

function FourTwo(ctx, mark, zoneDiagonal) {
  ctx.rotate((-45 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1,
    (mark.height / 2) * -1 + 23 - zoneDiagonal / 2
  );
  ctx.rotate((45 * Math.PI) / 180);
}

function FiveThree(ctx, mark, zoneDiagonal) {
  ctx.rotate((-45 * Math.PI) / 180);

  ctx.drawImage(
    mark,
    (mark.height / 2) * -1,
    (mark.height / 2) * -1 + 23 + zoneDiagonal / 2
  );
  ctx.rotate((45 * Math.PI) / 180);
}

// double vertical

function FourNine(ctx, mark, doubleMarkOffset) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleMarkOffset,
    (mark.height / 2) * -1 + 23
  );
  ctx.rotate((-90 * Math.PI) / 180);
}

function NineThree(ctx, mark, doubleMarkOffset) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleMarkOffset,
    (mark.height / 2) * -1 + 23
  );
  ctx.rotate((-90 * Math.PI) / 180);
}

function TwoEight(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleMarkOffset,
    (mark.height / 2) * -1 + 23 + zoneHeight
  );
  ctx.rotate((-90 * Math.PI) / 180);
}

function FiveSeven(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleMarkOffset,
    (mark.height / 2) * -1 + 23 - zoneHeight
  );
  ctx.rotate((-90 * Math.PI) / 180);
}

function OneTwo(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleMarkOffset,
    (mark.height / 2) * -1 + 23 + zoneHeight
  );
  ctx.rotate((-90 * Math.PI) / 180);
}

function SixFive(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleMarkOffset,
    (mark.height / 2) * -1 + 23 - zoneHeight
  );
  ctx.rotate((-90 * Math.PI) / 180);
}

// double horizontal

function TwoNine(ctx, mark, doubleMarkOffset) {
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleMarkOffset,
    (mark.height / 2) * -1 + 23
  );
}

function NineFive(ctx, mark, doubleMarkOffset) {
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleMarkOffset,
    (mark.height / 2) * -1 + 23
  );
}

function ThreeSeven(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleMarkOffset,
    (mark.height / 2) * -1 + 23 + zoneHeight
  );
}

function FourSix(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 + doubleMarkOffset,
    (mark.height / 2) * -1 + 23 - zoneHeight
  );
}

function EightThree(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleMarkOffset,
    (mark.height / 2) * -1 + 23 + zoneHeight
  );
}

function OneFour(ctx, mark, zoneHeight, doubleMarkOffset) {
  ctx.drawImage(
    mark,
    (mark.height / 2) * -1 - doubleMarkOffset,
    (mark.height / 2) * -1 + 23 - zoneHeight
  );
}

// diagonal trip
function OneSeven(ctx, mark) {
  ctx.rotate((45 * Math.PI) / 180);
  ctx.drawImage(mark, (mark.height / 2) * -1, -260);

  ctx.rotate((-45 * Math.PI) / 180);
}

function SixEight(ctx, mark) {
  ctx.rotate((-45 * Math.PI) / 180);
  ctx.drawImage(mark, (mark.height / 2) * -1, -260);

  ctx.rotate((45 * Math.PI) / 180);
}

export const drawScratch = (
  value,
  ctx,
  mark3,
  mark2,
  mark4,
  zoneHeight,
  zoneDiagonal,
  doubleMarkOffset,
  triplediagonalOffestX,
  triplediagonalOffestY,
  doubleDiagonalOffsetX
) => {
  if (checkReversed(value, "16")) {
    OneSix(ctx, mark3, zoneHeight);
  }
  if (checkReversed(value, "25")) {
    TwoFive(ctx, mark3);
  }
  if (checkReversed(value, "87")) {
    EightSeven(ctx, mark3, zoneHeight);
  }
  // vertical
  if (checkReversed(value, "18")) {
    OneEight(ctx, mark3, zoneHeight);
  }
  if (checkReversed(value, "43")) {
    FourThree(ctx, mark3);
  }
  if (checkReversed(value, "67")) {
    SixSeven(ctx, mark3, zoneHeight);
  }
  // trip lean left
  if (checkReversed(value, "13")) {
    OneThree(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  if (checkReversed(value, "47")) {
    FourSeven(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  // trip lean right
  if (checkReversed(value, "48")) {
    FourEight(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  if (checkReversed(value, "63")) {
    SixThree(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  // trip horizontal lean left
  if (checkReversed(value, "15")) {
    OneFive(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  if (checkReversed(value, "27")) {
    TwoSeven(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  // trip horizontal lean right
  if (checkReversed(value, "26")) {
    TwoSix(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  if (checkReversed(value, "85")) {
    EightFive(ctx, mark3, triplediagonalOffestX, triplediagonalOffestY);
  }
  // double diagonal left
  if (checkReversed(value, "19")) {
    OneNine(ctx, mark2, doubleDiagonalOffsetX);
  }
  if (checkReversed(value, "97")) {
    NineSeven(ctx, mark2, doubleDiagonalOffsetX);
  }
  if (checkReversed(value, "23")) {
    TwoThree(ctx, mark2, zoneDiagonal);
  }
  if (checkReversed(value, "45")) {
    FourFive(ctx, mark2, zoneDiagonal);
  }
  // double diagonal right
  if (checkReversed(value, "96")) {
    NineSix(ctx, mark2);
  }
  if (checkReversed(value, "89")) {
    EightNine(ctx, mark2);
  }
  if (checkReversed(value, "42")) {
    FourTwo(ctx, mark2, zoneDiagonal);
  }
  if (checkReversed(value, "53")) {
    FiveThree(ctx, mark2, zoneDiagonal);
  }
  // double vertical
  if (checkReversed(value, "49")) {
    FourNine(ctx, mark2, doubleMarkOffset);
  }
  if (checkReversed(value, "93")) {
    NineThree(ctx, mark2, doubleMarkOffset);
  }
  if (checkReversed(value, "28")) {
    TwoEight(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  if (checkReversed(value, "57")) {
    FiveSeven(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  if (checkReversed(value, "12")) {
    OneTwo(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  if (checkReversed(value, "65")) {
    SixFive(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  // double horizontal

  if (checkReversed(value, "29")) {
    TwoNine(ctx, mark2, doubleMarkOffset);
  }
  if (checkReversed(value, "95")) {
    NineFive(ctx, mark2, doubleMarkOffset);
  }
  if (checkReversed(value, "37")) {
    ThreeSeven(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  if (checkReversed(value, "46")) {
    FourSix(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  if (checkReversed(value, "83")) {
    EightThree(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  if (checkReversed(value, "14")) {
    OneFour(ctx, mark2, zoneHeight, doubleMarkOffset);
  }
  // diagonal trip
  if (checkReversed(value, "17")) {
    OneSeven(ctx, mark4);
  }
  if (checkReversed(value, "68")) {
    SixEight(ctx, mark4);
  }
};
