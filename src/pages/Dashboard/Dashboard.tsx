/* eslint-disable max-len */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import { allRoles, CommunityData } from "@store/Community/community.reducer";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "@store/ui-reducer";
import { memo, useEffect } from "react";
import { UserInfo } from "@auth/auth.reducer";
import CopyAddress from "@components/CopyAddress";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { Link } from "react-router-dom";
import { useGetAllMembersQuery } from "@api/community.api";
import LoadingProgressBar from "@components/LoadingProgressBar";
import { CommitmentMessages } from "@utils/misc";

const StyledTableTitle = styled("div")(({ theme }) => ({
  alignItems: "flex-start",
  display: "flex",
  marginBottom: "10px"
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  width: "100%",
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover
  // },
  "&:first-child td, &:first-child th": {
    borderTop: `2px solid ${theme.palette.divider}`
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const StyledMembersTableRow = styled(TableRow)(({ theme }) => ({
  width: "100%",
  "&:last-of-type": {
    backgroundColor: theme.palette.nightBlack.light
  },
  border: 0,
  "&:first-child td, &:first-child th": {
    borderTop: `2px solid ${theme.palette.divider}`
  },

  "&:last-child td, &:last-child th": {
    borderBottom: `2px solid ${theme.palette.divider}`
  }
}));

const TaskStyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: theme.palette.divider
  }
}));

const MembersStyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    border: 0,
    lineHeight: "20px"
  }
}));

const getGreeting = () => {
  const hour = new Date().getHours();
  const welcomeTypes = ["Good morning", "Good afternoon", "Good evening"];
  let welcomeText = "";
  if (hour < 12) welcomeText = welcomeTypes[0];
  else if (hour < 18) welcomeText = welcomeTypes[1];
  else welcomeText = welcomeTypes[2];
  return welcomeText;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(UserInfo);
  const community = useSelector(CommunityData);
  const roles = useSelector(allRoles);

  const { data, isLoading, isFetching } = useGetAllMembersQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: false
  });

  const membersTableData = {
    totalMembers: 0
  };

  let averageCommitment = 0;

  if (data && roles && data?.length) {
    membersTableData.totalMembers = data.length;
    roles.forEach((role) => {
      const membersByRole = data.reduce(function (n, member) {
        return n + +(member?.properties?.role.id == role.id);
      }, 0);

      console.log(membersByRole);

      membersTableData[role.id] = membersByRole;
    });

    const commitmentSum = data.reduce(
      (prev, curr) => prev + +curr.properties.commitment,
      0
    );

    averageCommitment = Math.round(commitmentSum / data.length);
  }

  useEffect(() => {
    dispatch(
      setTitle(
        userInfo?.name
          ? `${getGreeting()}, ${userInfo?.name}`
          : `${getGreeting()}`
      )
    );
  }, [dispatch, userInfo]);

  return (
    <Container
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        maxWidth: {
          xs: "sm",
          sm: "100%"
        }
      }}
    >
      <LoadingProgressBar
        isLoading={isFetching}
        sx={{
          zIndex: 99
        }}
      />
      <Card
        sx={{
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          border: "none",
          boxShadow: "none"
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                width: {
                  xs: "120px",
                  xxl: "300px"
                },
                height: "100%"
              }}
              variant="square"
              srcSet={ipfsCIDToHttpUrl(community?.image as string)}
            />
          }
          sx={{
            alignItems: "flex-start",
            flexDirection: {
              xs: "column",
              md: "row"
            },
            maxWidth: {
              xs: "100%",
              sm: "400px",
              md: "600px",
              xxl: "800px"
            },

            ".MuiCardContent-root": {
              padding: "0px 16px"
            },

            width: "100%",
            ".MuiAvatar-root": {
              backgroundColor: "transparent"
            }
          }}
          title={
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gridGap: "4px"
                }}
              >
                <Typography variant="h3" color="white">
                  {community.name}
                </Typography>
                {/* <IconButton
                      component={Link}
                      to={`${match.url}/edit-community`}
                    >
                      <SvgIcon component={EditPencil} />
                    </IconButton> */}
              </Box>
              <CopyAddress address={community.properties.address} />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography color="white" variant="body" sx={{ mb: "20px" }}>
                  {community.properties.market}
                </Typography>
                <Typography color="white" variant="body">
                  {community.description}
                </Typography>
              </Box>
            </>
          }
        />
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: {
              xs: "90%"
            }
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr"
              },
              gridGap: {
                xs: "30px",
                lg: "50px"
              },
              maxWidth: {
                xs: "600px",
                md: "90%"
              }
            }}
          >
            <Stack
              sx={{
                marginBottom: {
                  xs: "30px",
                  md: "40px",
                  xxl: "50px"
                }
              }}
            >
              <StyledTableTitle>
                <Typography color="white" variant="subtitle1">
                  Roles in your Nova
                </Typography>
              </StyledTableTitle>

              <TableBody
                sx={{
                  display: "table",
                  ".MuiTableBody-root > .MuiTableRow-root:hover": {
                    backgroundColor: "#ffffff0a"
                  },
                  position: "relative"
                }}
              >
                {roles.map((role) => (
                  <StyledMembersTableRow>
                    <MembersStyledTableCell>
                      <Typography
                        variant="subtitle2"
                        fontWeight="normal"
                        color="white"
                      >
                        {role?.roleName}
                      </Typography>
                    </MembersStyledTableCell>
                    <MembersStyledTableCell align="right">
                      {!isLoading && membersTableData?.[role.id]}
                    </MembersStyledTableCell>
                  </StyledMembersTableRow>
                ))}
                {isLoading && (
                  <CircularProgress
                    className="spinner-center"
                    size="60px"
                    style={{ top: "calc(50% - 30px)" }}
                  />
                )}

                <StyledMembersTableRow>
                  <MembersStyledTableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                    >
                      Total Members
                    </Typography>
                  </MembersStyledTableCell>
                  <MembersStyledTableCell align="right">
                    {!isLoading && membersTableData?.totalMembers}
                  </MembersStyledTableCell>
                </StyledMembersTableRow>
              </TableBody>
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "center",
                    md: "flex-start"
                  },
                  alignItems: {
                    xs: "center",
                    md: "flex-start"
                  },
                  marginTop: {
                    xs: "20px",
                    md: "20px",
                    xxl: "30px"
                  }
                }}
              >
                <Button
                  sx={{
                    height: "50px"
                  }}
                  type="button"
                  color="offWhite"
                  variant="outlined"
                  size="medium"
                  component={Link}
                  // to="https://leaderboard.aut.id"
                  to="http://176.34.149.248:4001/"
                  target="_blank"
                >
                  See your Nova Ranking
                </Button>
              </Stack>
            </Stack>

            <Stack>
              <StyledTableTitle>
                <Typography color="white" variant="subtitle1">
                  Your Community Data
                </Typography>
              </StyledTableTitle>
              <TableBody
                sx={{
                  display: "table",
                  ".MuiTableBody-root > .MuiTableRow-root:hover": {
                    backgroundColor: "#ffffff0a"
                  }
                }}
              >
                <StyledTableRow>
                  <TaskStyledTableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                    >
                      Average Commitment
                    </Typography>
                  </TaskStyledTableCell>
                  <TaskStyledTableCell
                    align="right"
                    style={{ position: "relative" }}
                  >
                    {isLoading ? (
                      <CircularProgress
                        className="spinner-center"
                        size="20px"
                        style={{
                          top: "calc(50% - 10px)",
                          left: "calc(50% + 10px)"
                        }}
                      />
                    ) : (
                      `${averageCommitment} - ${CommitmentMessages(
                        averageCommitment
                      )}`
                    )}
                  </TaskStyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TaskStyledTableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                    >
                      Minimum Commitment
                    </Typography>
                  </TaskStyledTableCell>
                  <TaskStyledTableCell align="right">
                    {`${
                      community?.properties?.commitment
                    } - ${CommitmentMessages(
                      community?.properties?.commitment
                    )}`}
                  </TaskStyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TaskStyledTableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                    >
                      Nova Address
                    </Typography>
                  </TaskStyledTableCell>
                  <TaskStyledTableCell align="right">
                    <CopyAddress address={community?.properties?.address} />
                  </TaskStyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <TaskStyledTableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="white"
                    >
                      Legacy DAO
                    </Typography>
                  </TaskStyledTableCell>
                  <TaskStyledTableCell align="right">
                    {community?.properties?.additionalProps
                      ?.legacyDaoAddress ? (
                      // TODO: Replace with correct property reflecting the Legacy Dao Address
                      <CopyAddress
                        address={
                          community?.properties?.additionalProps
                            ?.legacyDaoAddress
                        }
                      />
                    ) : (
                      "N/A"
                    )}
                  </TaskStyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default memo(Dashboard);
