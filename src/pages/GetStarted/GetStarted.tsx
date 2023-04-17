import { Box, Container, styled, Typography } from "@mui/material";
import AppTitle from "@components/AppTitle";
import { DautPlaceholder } from "@api/ProviderFactory/web3-daut-connect";
import BubbleTopRight from "@assets/bubble.svg";
import BubbleBottomLeft from "@assets/bubble2.svg";
import TryFoldImage from "@assets/tryfold.png";
import DiscordServerVerificationPopup from "@components/Dialog/DiscordServerVerificationPopup";
import { useOAuth } from "@components/Oauth2/oauth2";

const Grid = styled("div")(({ theme }) => {
  return {
    display: "flex",
    alignItems: "space-between",
    gridTemplateColumns: "1fr 1fr",
    flex: 1,
    flexDirection: "column",
    gridGap: "100px",
    height: "100%",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row"
    }
  };
});

const BottomLeftBubble = styled("img")(({ theme }) => ({
  position: "fixed",
  width: "400px",
  height: "400px",
  left: "-200px",
  bottom: "-200px",
  filter: "blur(50px)",
  transform: "rotate(-50deg)",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    left: "-350px",
    bottom: "-350px"
  }
}));

const TopRightBubble = styled("img")(({ theme }) => ({
  position: "fixed",
  width: "400px",
  height: "400px",
  top: "-200px",
  right: "-200px",
  filter: "blur(50px)",
  [theme.breakpoints.up("md")]: {
    width: "700px",
    height: "700px",
    top: "-350px",
    right: "-350px"
  }
}));

const Content = styled("div")(({ theme }) => {
  return {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  };
});

const StyledTrifold = styled("img")(({ theme }) => {
  return {
    maxWidth: "500px",
    [theme.breakpoints.up("xxl")]: {
      maxWidth: "700px"
    }
  };
});

const ImageWrapper = styled("div")(({ theme }) => {
  return {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "50%",
    [theme.breakpoints.down("md")]: {
      display: "none",
      width: "unset"
    }
  };
});

const GetStarted = () => {
  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, height: "100%" }}>
      <BottomLeftBubble loading="lazy" src={BubbleBottomLeft} />
      <TopRightBubble loading="lazy" src={BubbleTopRight} />
      <Grid>
        <Content>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row"
            }}
            mb={{
              xs: "25px",
              md: "50px"
            }}
          >
            <AppTitle />
          </Box>
          <Typography
            mb={{
              xs: "10px",
              md: "20px"
            }}
            color="white"
            variant="subtitle2"
            fontWeight="bold"
          >
            Do more with your DAO.
          </Typography>
          <Typography
            mb={{
              xs: "10px",
              md: "20px"
            }}
            color="white"
            variant="subtitle2"
            fontWeight="normal"
          >
            Use your Dashboard to Manage your Nova. Experiment with
            Integrations, and add custom Modules - such as Role-sets &
            on-boarding strategies.
          </Typography>
          <Typography
            mb={{
              xs: "10px",
              md: "20px"
            }}
            color="white"
            variant="subtitle2"
            fontWeight="normal"
          >
            Coordinate, Coordinate, Coordinate.
          </Typography>
          <Typography
            mb={{
              xs: "25px",
              md: "50px"
            }}
            color="white"
            variant="subtitle2"
            fontWeight="normal"
          >
            There is no community like yours - Set your own Standard. Opt Āut.
          </Typography>
          <DautPlaceholder />
        </Content>
        <ImageWrapper>
          <StyledTrifold loading="lazy" src={TryFoldImage}></StyledTrifold>
        </ImageWrapper>
      </Grid>
    </Container>
  );
};

export default GetStarted;
