function holeNine(ctx, hole) {
  ctx.drawImage(hole, (hole.height / 2) * -1, (hole.height / 2) * -1);
}
function holeTwo(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1 - zoneHeight,
    (hole.height / 2) * -1
  );
}
function holeFive(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1 + zoneHeight,
    (hole.height / 2) * -1
  );
}
function holeFour(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1,
    (hole.height / 2) * -1 - zoneHeight
  );
}
function holeThree(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1,
    (hole.height / 2) * -1 + zoneHeight
  );
}
function holeOne(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1 - zoneHeight,
    (hole.height / 2) * -1 - zoneHeight
  );
}
function holeSeven(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1 + zoneHeight,
    (hole.height / 2) * -1 + zoneHeight
  );
}
function holeSix(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1 + zoneHeight,
    (hole.height / 2) * -1 - zoneHeight
  );
}
function holeEight(ctx, hole, zoneHeight) {
  ctx.drawImage(
    hole,
    (hole.height / 2) * -1 - zoneHeight,
    (hole.height / 2) * -1 + zoneHeight
  );
}

export const drawHole = (value, ctx, hole, zoneHeight) => {
  const stringValue = value.toString();
  if (stringValue === "9") {
    holeNine(ctx, hole);
  }
  if (stringValue === "2") {
    holeTwo(ctx, hole, zoneHeight);
  }
  if (stringValue === "5") {
    holeFive(ctx, hole, zoneHeight);
  }
  if (stringValue === "4") {
    holeFour(ctx, hole, zoneHeight);
  }
  if (stringValue === "3") {
    holeThree(ctx, hole, zoneHeight);
  }
  if (stringValue === "1") {
    holeOne(ctx, hole, zoneHeight);
  }
  if (stringValue === "7") {
    holeSeven(ctx, hole, zoneHeight);
  }
  if (stringValue === "6") {
    holeSix(ctx, hole, zoneHeight);
  }
  if (stringValue === "8") {
    holeEight(ctx, hole, zoneHeight);
  }
};
