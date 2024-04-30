/* eslint-disable max-len */
import { NovaArchetype } from "@aut-labs/sdk/dist/models/nova";
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
import { useAppDispatch } from "@store/store.model";
import React from "react";
import { useState } from "react";
import { archetypeChartValues } from "./ArchetypePieChart";

export interface InteractionsDialogProps {
  title: string;
  description?: JSX.Element;
  open?: boolean;
  onClose?: () => void;
  archetype: any;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "85%",
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
  activeArchetype
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
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
        width: "100%",
        minWidth: "170px",
        boxShadow: 3,
        borderRadius: "8.5px",
        padding: theme.spacing(3)
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
            alignItems: "center",
            justifyContent: "center"
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
        <Typography
          color="offWhite.main"
          textAlign="left"
          lineHeight={1}
          variant="body1"
        >
          <Typography
            marginTop={3}
            color="offWhite.main"
            textAlign="center"
            fontFamily="FractulAltLight"
            lineHeight={1}
            variant="subtitle2"
          >
            {description}
          </Typography>
        </Typography>
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
              }
            }
          }}
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
            Choose archetype
          </Typography>
        </AutOsButton>
      </Stack>
    </Box>
  );
};

export function ArchetypeDialog(props: InteractionsDialogProps) {
  const dispatch = useAppDispatch();
  const [editInitiated, setEditInitiated] = useState(false);
  const [state, setState] = React.useState(
    archetypeChartValues(props.archetype)
  );

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const setSelected = (selected) => {
    // pass
  };
  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={props.onClose}
      open={props.open}
    >
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

        <Box
          sx={{
            minWidth: {
              sm: "100%"
            },
            width: {
              xs: "100%",
              sm: "unset"
            },
            backgroundColor: "transparent",
            border: "none",
            my: theme.spacing(3)
          }}
        >
          <Box
            className="swiper-no-swiping"
            sx={{
              minWidth: {
                xs: "unset",
                md: "800px"
              },
              padding: "10px",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr 1fr",
                md: "1fr 1fr 1fr",
                xl: "1fr 1fr 1fr 1fr 1fr"
              },
              gap: theme.spacing(2)
            }}
          >
            <ArchetypeCard
              activeArchetype={
                props.archetype?.archetype === NovaArchetype.SIZE
              }
              onSelect={setSelected}
              {...state[NovaArchetype.SIZE]}
            />
            <ArchetypeCard
              activeArchetype={
                props.archetype?.archetype === NovaArchetype.REPUTATION
              }
              onSelect={setSelected}
              {...state[NovaArchetype.REPUTATION]}
            />
            <ArchetypeCard
              activeArchetype={
                props.archetype?.archetype === NovaArchetype.CONVICTION
              }
              onSelect={setSelected}
              {...state[NovaArchetype.CONVICTION]}
            />
            <ArchetypeCard
              activeArchetype={
                props.archetype?.archetype === NovaArchetype.PERFORMANCE
              }
              onSelect={setSelected}
              {...state[NovaArchetype.PERFORMANCE]}
            />
            <ArchetypeCard
              activeArchetype={
                props.archetype?.archetype === NovaArchetype.GROWTH
              }
              onSelect={setSelected}
              {...state[NovaArchetype.GROWTH]}
            />
          </Box>
        </Box>
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
