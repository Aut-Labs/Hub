import Typography from "./Typography";

const AppTitle = (props) => {
  return (
    <Typography
      fontWeight="300"
      fontFamily="var(--fractul-regular)"
      as="h2"
      color="white"
      whiteSpace="nowrap"
      {...props}
    >
      Try{" "}
      <strong
        style={{
          fontFamily: "var(--fractul-alt-bold)",
        }}
      >
        Āut
      </strong>
    </Typography>
  );
};

export default AppTitle;
