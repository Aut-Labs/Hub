import {
  Box,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  SvgIcon,
  Card,
  styled
} from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LeafIcon } from "@assets/SocialIcons/LeafIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { AutID } from "@api/aut.model";
import { AutButton } from "@components/buttons";
import { useAppDispatch } from "@store/store.model";
import { setAsCoreTeam, removeAsCoreTeam } from "@api/community.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import {
  CommunityStatus,
  communityUpdateState
} from "@store/Community/community.reducer";
import { ResultState } from "@store/result-status";
import { useSelector } from "react-redux";
import CopyAddress from "@components/CopyAddress";
import { ipfsCIDToHttpUrl } from "@api/storage.api";

const IconContainer = styled("div")(({ theme }) => ({
  paddingTop: pxToRem(40),
  display: "flex",

  "@media(max-width: 769px)": {
    paddingTop: pxToRem(20)
  }
}));

const Stat = styled("div")({
  width: "100%",
  height: pxToRem(80),
  borderStyle: "solid",
  borderWidth: "1px",
  borderTopColor: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `0 ${pxToRem(40)}`,
  margin: "0 auto",
  "&.stat:last-child": {
    borderBottomColor: "white"
  }
});

const StatWrapper = styled("div")({
  maxWidth: pxToRem(550),
  minWidth: pxToRem(550),
  margin: "0 auto"
});

const userStats = [
  {
    title: "Your Interactions",
    value: "0"
  },
  {
    title: "Your Open Tasks",
    value: "0"
  },
  {
    title: "Total Completed Tasks",
    value: "0"
  }
];

const AutCard = styled(Card)(({ theme }) => ({
  "&.MuiCard-root": {
    display: "flex"
  },

  ".MuiCardHeader-root": {
    padding: "0"
  },

  ".MuiCardContent-root:last-child": {
    padding: "0"
  }
}));

const LeftProfile = ({ member }: { member: AutID }) => {
  const dispatch = useAppDispatch();
  const status = useSelector(CommunityStatus);

  const addOrRemoveAsCoreTeam = () => {
    if (member.properties.isAdmin) {
      dispatch(removeAsCoreTeam(member.properties.address));
    } else {
      dispatch(setAsCoreTeam(member.properties.address));
    }
  };

  const handleDialogClose = () => {
    dispatch(
      communityUpdateState({
        status: ResultState.Idle
      })
    );
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column", flex: "1" }}>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message="Something went wrong"
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message="Setting member as core team"
      />
      <Box
        sx={{
          paddingLeft: pxToRem(100),
          paddingRight: pxToRem(100),
          paddingTop: pxToRem(150)
        }}
      >
        <AutCard sx={{ bgcolor: "background.default", border: "none" }}>
          <CardHeader
            avatar={
              <Avatar
                src={ipfsCIDToHttpUrl(member?.image as string)}
                sx={{
                  bgcolor: "background.default",
                  width: pxToRem(150),
                  height: pxToRem(150),
                  borderRadius: 0
                }}
              />
            }
          />
          <CardContent
            sx={{
              ml: pxToRem(30),
              mr: pxToRem(30),
              alignSelf: "flex-end"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontSize={pxToRem(50)}
                color="background.paper"
                textAlign="left"
              >
                {member?.name}
              </Typography>
            </div>

            <CopyAddress
              address={member?.properties?.address}
              variant="body1"
            />
            <IconContainer>
              <SvgIcon
                sx={{
                  height: pxToRem(34),
                  width: pxToRem(31),
                  mr: pxToRem(20)
                }}
                component={DiscordIcon}
              />
              <SvgIcon
                sx={{
                  height: pxToRem(34),
                  width: pxToRem(31),
                  mr: pxToRem(20)
                }}
                component={GitHubIcon}
              />
              <SvgIcon
                sx={{
                  height: pxToRem(34),
                  width: pxToRem(31),
                  mr: pxToRem(20)
                }}
                component={TwitterIcon}
              />
              <SvgIcon
                sx={{
                  height: pxToRem(34),
                  width: pxToRem(31),
                  mr: pxToRem(20)
                }}
                component={TelegramIcon}
              />
              <SvgIcon
                sx={{
                  height: pxToRem(34),
                  width: pxToRem(31),
                  mr: pxToRem(20)
                }}
                component={LeafIcon}
              />
            </IconContainer>
          </CardContent>
        </AutCard>
      </Box>
      <Box
        sx={{
          paddingLeft: pxToRem(100),
          paddingRight: pxToRem(100),
          paddingTop: pxToRem(30),
          paddingBottom: pxToRem(30)
        }}
      >
        <Typography
          fontSize={pxToRem(47)}
          textTransform="uppercase"
          color="background.paper"
          textAlign="left"
        >
          Stats
        </Typography>
      </Box>
      <Box
        sx={{
          paddingLeft: pxToRem(100),
          paddingRight: pxToRem(100)
        }}
      >
        <StatWrapper>
          {userStats.map(({ title, value }) => (
            <Stat className="stat" key={`stat-${title}`}>
              <Typography
                sx={{ color: "white", fontSize: pxToRem(21) }}
                component="div"
              >
                {title}
              </Typography>
              <Typography
                sx={{ color: "white", fontSize: pxToRem(21) }}
                component="div"
              >
                {value}
              </Typography>
            </Stat>
          ))}
        </StatWrapper>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        {window?.ethereum?.selectedAddress?.toLowerCase() !==
          member?.properties?.address?.toLowerCase() && (
          <AutButton
            sx={{
              minWidth: pxToRem(325),
              maxWidth: pxToRem(325),
              height: pxToRem(70),
              my: pxToRem(50)
            }}
            type="button"
            onClick={addOrRemoveAsCoreTeam}
            color="primary"
            variant="outlined"
          >
            {member?.properties?.isAdmin ? "Remove as Admin" : "Set as Admin"}
          </AutButton>
        )}
      </Box>
    </Box>
  );
};

export default LeftProfile;
