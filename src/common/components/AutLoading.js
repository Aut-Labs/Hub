// @ts-ignore
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "common/assets/aut-load.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const AutLoading = ({ width = "300px", height = "300px" }) => {
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
      <Player
        loop
        autoplay
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        src={animationData}
        style={{ height, width }}
      />
    </div>
  );
};

export default AutLoading;
