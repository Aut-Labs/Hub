/* eslint-disable max-len */
import {
  NovaArchetype,
  NovaArchetypeParameters
} from "@aut-labs/sdk/dist/models/nova";
import { AutOsButton } from "@components/AutButton";
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  SvgIcon,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React from "react";
import { archetypeChartValues } from "./ArchetypePieChart";
import { useSetArchetypeMutation } from "@api/archetype.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";

export interface InteractionsDialogProps {
  title: string;
  description?: JSX.Element;
  open?: boolean;
  onClose?: () => void;
  archetype: any;
  nova: any;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "80%",
    height: "80%",
    border: "none",
    backgroundColor: "#1E2430",
    borderRadius: "30px",
    padding: "30px 0px",
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  },
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      height: "100%",
      width: "100%",
      border: "none",
      borderRadius: "0",
      boxShadow: "none"
    }
  }
}));

const ArchetypeCard = ({
  title,
  description,
  logo,
  type,
  onSelect,
  activeArchetype,
  isLoading
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "flex-start",
        backdropFilter: "blur(6px)",
        background: `transparent url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='rgb(96,96,96)' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e") 0% 0% no-repeat padding-box`,
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // width: "100%",
        // minWidth: "170px",
        minHeight: "190px",
        boxShadow: 3,
        borderRadius: "8.5px",
        padding: theme.spacing(3),
        width: {
          xs: "100%",
          md: "280px",
          lg: "320px",
          xxl: "350px"
        }
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        display="flex"
        sx={{
          width: "100%",
          justifyContent: "space-between"
        }}
      >
        <Box
          sx={{
            background: "#000000",
            borderRadius: "6px"
          }}
        >
          <Avatar
            sx={{
              flex: "1",
              height: {
                xs: "50px",
                md: "60px",
                xxl: "70px"
              },
              borderRadius: "6px",
              width: {
                xs: "50px",
                md: "60px",
                xxl: "70px"
              },
              background: "transparent"
            }}
            aria-label="avatar"
          >
            <SvgIcon component={logo} inheritViewBox />
          </Avatar>
        </Box>

        <div
          style={{
            flex: "2",
            display: "flex",
            alignItems: "center"
            // justifyContent: "center"
          }}
        >
          <Typography
            color="offWhite.main"
            textAlign="center"
            lineHeight={1}
            variant="subtitle1"
            marginLeft={1}
          >
            {title}
          </Typography>
        </div>
      </Stack>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <Box
          sx={{
            background: "#000000",
            borderRadius: "6px",
            p: 3,
            mt: 2,
            flex: 1
          }}
        >
          <Typography
            marginTop={3}
            color="offWhite.main"
            textAlign="center"
            lineHeight={1}
            variant="body"
          >
            {description}
          </Typography>
        </Box>
        <AutOsButton
          sx={{
            mt: "24px",
            bgcolor: "transparent",
            "&.MuiButton-root": {
              background: "linear-gradient(#244AFF, #1BB8FF)",
              transition: theme.transitions.create([
                "border-color",
                "background",
                "color"
              ]),
              "&:hover": {
                background: "linear-gradient(#2037e0, #17a1e0)"
              },
              ...(activeArchetype && {
                background: (theme) => theme.palette.success.main,
                "&:hover": {
                  background: (theme) => theme.palette.success.main
                }
              })
            }
          }}
          disabled={!!activeArchetype || isLoading}
          onClick={() =>
            onSelect({
              title,
              description,
              logo,
              type
            })
          }
        >
          <Typography variant="body" fontWeight="normal" color="white">
            {activeArchetype ? "Current Archetype" : "Choose archetype"}
          </Typography>
        </AutOsButton>
      </Stack>
    </Box>
  );
};

export function ArchetypeDialog(props: InteractionsDialogProps) {
  const [state, setState] = React.useState(
    archetypeChartValues(props.archetype)
  );

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const [setArchetype, { error, isError, isLoading, reset }] =
    useSetArchetypeMutation();

  const updateArchetype = async (selectedArchetype) => {
    const archetype = state[selectedArchetype.type];
    const updatedArchetype: Partial<NovaArchetypeParameters> = {
      size: archetype?.defaults[NovaArchetype.SIZE],
      growth: archetype?.defaults[NovaArchetype.GROWTH],
      conviction: archetype?.defaults[NovaArchetype.CONVICTION],
      performance: archetype?.defaults[NovaArchetype.PERFORMANCE],
      reputation: archetype?.defaults[NovaArchetype.REPUTATION]
    };
    debugger;
    try {
      setArchetype({
        nova: props.nova,
        archetype: {
          default: selectedArchetype.type,
          parameters: updatedArchetype as NovaArchetypeParameters
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={props.onClose}
      open={props.open}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Updating Archertype..." />
      <DialogContent
        sx={{
          border: 0,
          padding: "0px 30px",
          mb: theme.spacing(2),
          height: "100%"
        }}
      >
        <Typography
          sx={{
            color: (theme) => theme.palette.offWhite.main,
            textAlign: "center"
          }}
          width="100%"
          variant="subtitle2"
          my={4}
        >
          Your Nova is a combination of parameters with customizable weight,
          representing its KPIs in different areas.
          <br /> By setting an <b>Archetype</b>, you select the type of your
          project, and the main driver behind it.
          <br /> The combination of its Archetype and overtime results will
          determine your Project’s{" "}
          <b
            style={{
              textDecoration: "underline"
            }}
          >
            Prestige
          </b>
          .
        </Typography>

        <Grid container spacing={3} sx={{ flexGrow: 1, margin: "0 auto" }}>
          {/* Row 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <ArchetypeCard
              isLoading={isLoading}
              activeArchetype={
                props?.nova?.properties?.archetype?.default ===
                NovaArchetype.SIZE
              }
              onSelect={updateArchetype}
              {...state[NovaArchetype.SIZE]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ArchetypeCard
              activeArchetype={
                props?.nova?.properties?.archetype?.default ===
                NovaArchetype.REPUTATION
              }
              isLoading={isLoading}
              onSelect={updateArchetype}
              {...state[NovaArchetype.REPUTATION]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ArchetypeCard
              isLoading={isLoading}
              activeArchetype={
                props?.nova?.properties?.archetype?.default ===
                NovaArchetype.CONVICTION
              }
              onSelect={updateArchetype}
              {...state[NovaArchetype.CONVICTION]}
            />
          </Grid>

          {/* Row 2 */}
          <Grid
            display={{
              xs: "none",
              md: "inherit"
            }}
            item
            xs={false}
            sm={false}
            md={2}
          />
          <Grid item xs={12} sm={6} md={4}>
            <ArchetypeCard
              isLoading={isLoading}
              activeArchetype={
                props?.nova?.properties?.archetype?.default ===
                NovaArchetype.PERFORMANCE
              }
              onSelect={updateArchetype}
              {...state[NovaArchetype.PERFORMANCE]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ArchetypeCard
              isLoading={isLoading}
              activeArchetype={
                props?.nova?.properties?.archetype?.default ===
                NovaArchetype.GROWTH
              }
              onSelect={updateArchetype}
              {...state[NovaArchetype.GROWTH]}
            />
          </Grid>
          <Grid
            display={{
              xs: "none",
              md: "inherit"
            }}
            item
            xs={false}
            sm={false}
            md={2}
          />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          width: "100%",
          padding: "0px 30px"
        }}
      >
        <AutOsButton
          onClick={props.onClose}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            width: "100px",
            "&.MuiButton-root": {
              background: "#2F3746"
            }
          }}
        >
          <Typography fontWeight="normal" fontSize="16px" lineHeight="26px">
            Close
          </Typography>
        </AutOsButton>
      </DialogActions>
    </AutStyledDialog>
  );
}
