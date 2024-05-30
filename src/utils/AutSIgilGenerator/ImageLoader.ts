export const LoadImage = (url: string): Promise<HTMLImageElement> => {
  const image = new Image();
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onerror = reject;
    image.onload = () => {
      resolve(image);
    };
    image.crossOrigin = "Anonymous";
    image.src = url;
  });
};
