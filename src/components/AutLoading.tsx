// @ts-ignore
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "@assets/aut-load2.json";
import { useMediaQuery, useTheme } from "@mui/material";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const AutLoading = ({ width = "300px", height = "300px" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div
      style={{
        ...(isMobile && {
          position: "relative"
        }),
        ...(!isMobile && {
          position: "absolute"
        }),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
