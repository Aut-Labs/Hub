import Image from "next/legacy/image";

const NextImage = (props) => {
  return <Image width="100%" height="100%" {...props} alt={props.alt} />;
};

export default NextImage;
