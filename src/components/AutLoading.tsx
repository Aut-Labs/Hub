// @ts-ignore
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "@assets/aut-load2.json";

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
        zIndex: 1,
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
