/* eslint-disable max-len */
import {
  Box,
  Avatar,
  Typography,
  Stack,
  useTheme,
  Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AutOsButton } from "./AutButton";
import {
  useCheckHasMintedForNovaQuery,
  useGetAllNovasQuery,
  useLazyCheckHasMintedForNovaQuery,
  useLazyCheckOnboardingAllowlistQuery
} from "@api/community.api";
import LoadingDialog from "./Dialog/LoadingPopup";
import SuccessDialog from "./Dialog/SuccessPopup";
import Community from "@assets/community.png";
import Creative from "@assets/creative.png";
import Tech from "@assets/tech.png";
import ErrorDialog from "./Dialog/ErrorPopup";
import { useWalletConnector } from "@aut-labs/connector";
import { useAccount } from "wagmi";
import { pulsate } from "./NovaCard";
import { setSelectedRoleId } from "@store/WalletProvider/WalletProvider";
import { useAppDispatch } from "@store/store.model";
import { add } from "date-fns";
import { useParams } from "react-router-dom";

const roleIcons = {
  Creative: Creative,
  Tech: Tech,
  Community: Community
};

const RoleCard = ({ role }) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { address, isConnected } = useAccount();
  const { open } = useWalletConnector();
  const dispatch = useAppDispatch();
  const { novaName } = useParams();

  // const [
  //   checkOnboardingAllowlist,
  //   { data: result, isLoading, isUninitialized }
  // ] = useLazyCheckOnboardingAllowlistQuery();

  const [checkHasMinted, { data: result, isLoading, isUninitialized }] =
    useLazyCheckHasMintedForNovaQuery();

  const { data: nova } = useGetAllNovasQuery(
    {
      connectedAddress: address
    },
    {
      selectFromResult: ({ data }) => ({
        data: (data?.daos || []).find((d) => {
          return d.name === novaName;
        })
      })
    }
  );

  const { isLoading: checkLoading, data: checkResult } =
    useCheckHasMintedForNovaQuery(
      { address, novaAddress: nova?.properties?.address },
      {
        skip: !address || !nova
      }
    );

  const handleClick = async () => {
    await dispatch(setSelectedRoleId(role?.id));
    if (result && !result?.hasMinted && isConnected) {
      handleMint();
    } else {
      let addressToVerify = address as string;
      if (!addressToVerify) {
        const state = await open();
        addressToVerify = state?.address;
      }

      await checkHasMinted({ address, novaAddress: nova?.properties?.address });
    }
  };

  // const handleDialogClose = () => {
  //   console.log("Verify task close");
  // };

  // useEffect(() => {
  //   // if (isUninitialized && address) {
  //   //   checkOnboardingAllowlist(address);
  //   // }
  // }, [isUninitialized, address]);

  useEffect(() => {
    if (result && result?.hasMinted) {
      // setOpenSuccess(true);
    } else if (result && !result?.hasMinted) {
      handleMint();
    }
  }, [isLoading, result]);

  const handleMint = async () => {
    setOpenSuccess(false);
    const event = new CustomEvent("aut-open", {
      composed: true,
      cancelable: true,
      bubbles: true
      // detail: payload
    });
    window.dispatchEvent(event);
  };

  const theme = useTheme();

  return (
    <>
      <LoadingDialog
        handleClose={openSuccess}
        open={isLoading}
        message="Checking requirements..."
      />
      <SuccessDialog
        titleVariant="h3"
        message="Congrats!"
        subtitle="You can now mint your ĀutID!"
        handleClose={() => setOpenSuccess(false)}
        open={openSuccess}
        action={() => handleMint()}
      ></SuccessDialog>
      <ErrorDialog
        handleClose={() => setOpenError(false)}
        open={openError}
        message={"You have already minted an ĀutID."}
      />
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "flex-start",
          backdropFilter: "blur(50px)",
          backgroundColor: "rgba(128, 128, 128, 0.05)",
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='rgb(96,96,96)' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          borderRadius: "6px",
          opacity: 1,
          WebkitBackdropFilter: "blur(6px)",
          padding: {
            xs: "36px 32px",
            md: "24px 24px",
            xxl: "36px 32px"
          },
          display: "flex",
          flexDirection: "column",
          animation: checkResult?.hasMinted ? "none" : `${pulsate} 2s infinite`
        }}
      >
        <Stack direction="row" justifyContent="center" display="flex">
          <div
            style={{
              flex: "2",
              display: "flex",
              alignItems: "center"
            }}
          >
            <Typography
              color="offWhite.main"
              textAlign="center"
              lineHeight={1}
              variant="subtitle2"
              marginLeft={1}
            >
              {role?.roleName}
            </Typography>
          </div>
        </Stack>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between"
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
              Claim your role in this community as {role?.roleName}
            </Typography>
          </Typography>
          {/* <AutOsButton
            disabled={result?.role == role?.id}
            sx={{
              background: "linear-gradient(#244AFF, #1BB8FF) !important",
              mt: "24px"
            }}
            onClick={() => handleClick()}
          >
            <Typography variant="body" fontWeight="normal" color="white">
              Join
            </Typography>
          </AutOsButton> */}
          <>
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
                  ...(checkResult?.hasMinted &&
                    checkResult?.hasMintedForNova &&
                    checkResult?.role == role?.id && {
                      background: (theme) => theme.palette.success.main,
                      "&:hover": {
                        background: (theme) => theme.palette.success.main
                      }
                    })
                }
              }}
              onClick={() => handleClick()}
              disabled={
                checkResult?.hasMinted ||
                checkLoading ||
                !checkResult?.hasMintedForNova
              }
            >
              <Typography variant="body" fontWeight="normal" color="white">
                {checkResult?.role == role?.id && checkResult?.hasMintedForNova
                  ? "Current Role"
                  : checkResult?.hasMinted
                    ? "Unavailable"
                    : "Join"}
              </Typography>
            </AutOsButton>
          </>
        </Stack>
      </Box>
    </>
  );
};

export default RoleCard;
