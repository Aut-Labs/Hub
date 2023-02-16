import { useState } from "react";
import "@redq/reuse-modal/lib/index.css";
import animationData from "common/assets/aut-load.json";
import { Player } from "@lottiefiles/react-lottie-player";
import Text from "common/components/Text";

export const Loading = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%)`,
    }}
  >
    <Player
      loop
      autoplay
      rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
      src={animationData}
      style={{ height: "400px", width: "400px" }}
    />
  </div>
);

const ModalPopupWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div
      style={{
        height: "calc(100% - 20px)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        background: "#000",
        borderStyle: "solid",
        borderImage:
          "linear-gradient(45deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1",
        borderWidth: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          flex: 1,
          padding: "30px",
          ...((loading || error) && {
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }),
        }}
      >
        {error ? (
          <Text fontSize="20px" color="red" content={error} />
        ) : loading ? (
          <Loading />
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  );
};

export default ModalPopupWrapper;
