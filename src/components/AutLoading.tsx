import * as animationData from "@assets/aut-load2.json";
import { memo } from "react";
import Lottie from "react-lottie-player/dist/LottiePlayerLight";

const AutLoading = ({ width = "120px", height = "120px" }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%)`
      }}
    >
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ width: width, height: height }}
      />
    </div>
  );
};

export default memo(AutLoading);
