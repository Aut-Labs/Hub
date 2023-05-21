import { useEffect, memo } from "react";
import Box from "@mui/material/Box";
import { useAppDispatch } from "@store/store.model";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Stack,
  Typography,
  styled
} from "@mui/material";
import { setTitle } from "@store/ui-reducer";
import { useGetAllMembersQuery } from "@api/community.api";
import { DAOMember } from "@api/aut.model";
import IosShareIcon from "@mui/icons-material/IosShare";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import LoadingProgressBar from "@components/LoadingProgressBar";
import AutLoading from "@components/AutLoading";

const GridBox = styled(Box)(({ theme }) => {
  return {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridGap: "30px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))"
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(3,minmax(0,1fr))"
    },
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(4,minmax(0,1fr))"
    }
  };
});

const GridCard = styled(Card)(({ theme }) => {
  return {
    minHeight: "340px",
    width: "100%"
  };
});

const GridCardWrapper = styled("div")(({ theme }) => {
  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: theme.transitions.create(["transform"]),
    "&:hover": {
      transform: "scale(1.019)"
    }
  };
});

const MemberType = styled(Chip)(({ theme }) => {
  return {
    position: "absolute",
    top: "-14px",
    minWidth: "120px",
    height: "28px"
  };
});

const MemberCard = memo(
  ({ member, isFetching }: { member: DAOMember; isFetching: boolean }) => {
    return (
      <>
        <GridCardWrapper>
          <MemberType
            label={member.properties?.isAdmin ? "Admin" : "Member"}
            color="primary"
          />
          <GridCard
            sx={{
              bgcolor: "nightBlack.main",
              borderColor: "divider",
              borderRadius: "16px",
              boxShadow: 3
            }}
            variant="outlined"
          >
            <CardHeader
              sx={{
                m: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                ".MuiCardHeader-avatar": {
                  m: 0,
                  mt: 2
                },
                ".MuiCardHeader-content": {
                  display: "none"
                }
              }}
              avatar={
                <Avatar
                  variant="square"
                  sx={{
                    borderColor: "divider",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    width: "140px",
                    height: "140px"
                  }}
                  srcSet={ipfsCIDToHttpUrl(member.image as string)}
                />
              }
            />
            <CardContent>
              <Stack direction="column">
                <Typography
                  fontFamily="FractulAltBold"
                  color="primary"
                  variant="subtitle2"
                >
                  {member.name}
                </Typography>
                <Typography variant="caption" className="text-secondary">
                  Āut name
                </Typography>
              </Stack>
              <Stack direction="column">
                <Typography
                  fontFamily="FractulAltBold"
                  color="primary"
                  variant="subtitle2"
                >
                  {member?.properties.role?.roleName}
                </Typography>
                <Typography variant="caption" className="text-secondary">
                  DAO Role
                </Typography>
              </Stack>
              <Stack direction="column">
                <Typography
                  fontFamily="FractulAltBold"
                  color="primary"
                  variant="subtitle2"
                >
                  {member?.properties?.commitmentDescription}
                </Typography>
                <Typography variant="caption" className="text-secondary">
                  Commitment
                </Typography>
              </Stack>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: "center",
                borderTop: "1px solid",
                borderColor: "divider"
              }}
            >
              <Button
                target="_blank"
                href={`https://my.aut.id/${member.properties.address}`}
                color="offWhite"
              >
                View profile
              </Button>
            </CardActions>
          </GridCard>
        </GridCardWrapper>
      </>
    );
  }
);

function Members() {
  const dispatch = useAppDispatch();

  const { data, isLoading, isFetching } = useGetAllMembersQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: false
  });

  useEffect(() => {
    dispatch(setTitle(`DAO - Members & Roles in your Community.`));
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: "20px" }}>
      <LoadingProgressBar
        isLoading={isFetching}
        sx={{
          zIndex: 99
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative"
        }}
      >
        <Typography textAlign="center" color="white" variant="h3">
          DAO Members
        </Typography>
        <Box
          sx={{
            display: "flex",
            mt: 4,
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Button
            startIcon={<IosShareIcon />}
            variant="outlined"
            size="medium"
            color="offWhite"
          >
            Invite members
          </Button>
        </Box>
      </Box>

      {!isLoading && !data?.length && (
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            mt: 12,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography color="rgb(107, 114, 128)" variant="subtitle2">
            There are no members in this community yet...
          </Typography>
        </Box>
      )}

      {isLoading ? (
        <AutLoading width="130px" height="130px" />
      ) : (
        <GridBox sx={{ flexGrow: 1, mt: 6 }}>
          {data.map((member, index) => (
            <MemberCard
              key={`member-plugin-${index}`}
              member={member}
              isFetching={false}
            />
          ))}
        </GridBox>
      )}
    </Container>
  );
}

export default memo(Members);
