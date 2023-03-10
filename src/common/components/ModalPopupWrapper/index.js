import "@redq/reuse-modal/lib/index.css";
import colors from "common/theme/colors";

const ModalPopupWrapper = ({ children, fullScreen = false }) => {
  return (
    <div
      style={{
        height: "calc(100% - 20px)",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        background: colors.nightBlack,
        borderStyle: "solid",
        borderColor: colors.divider,
        borderWidth: "2px",
      }}
    >
      {children}
    </div>
  );
};

export default ModalPopupWrapper;
