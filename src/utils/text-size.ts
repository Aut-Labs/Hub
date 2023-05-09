export const FindTextCenter = (
  parentElWidth: number,
  offset = 0,
  metric: "width" | "height" = "width"
) => {
  const canvas = document.createElement("canvas");
  const middle = parentElWidth / 2;
  return (text: string, fontSize: string) => {
    const context = canvas.getContext("2d");
    context.font = `${fontSize} JosefinSans-Regular, Josefin Sans`;
    const metrics = context.measureText(text);
    const size = Number(metrics[metric]);
    return middle - size / 2 - offset;
  };
};

export const pxToRem = (px: number | string) => {
  px = `${px}`.replace("px", "");

  return `${px}px`;
  // const x = 16;
  // const rem = `${(1 / x) * Number(px)}rem`;
  // return rem;
};
