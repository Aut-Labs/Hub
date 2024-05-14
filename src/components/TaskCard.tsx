/* eslint-disable max-len */
import { Box, Avatar, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AutOsButton } from "./AutButton";
import { useLazyCheckOnboardingAllowlistQuery } from "@api/community.api";
import LoadingDialog from "./Dialog/LoadingPopup";
import SuccessDialog from "./Dialog/SuccessPopup";
import Community from "@assets/community.png";
import Creative from "@assets/creative.png";
import Tech from "@assets/tech.png";
import ErrorDialog from "./Dialog/ErrorPopup";
import { useWalletConnector } from "@aut-labs/connector";
import { useAccount } from "wagmi";

const roleIcons = {
  Creative: Creative,
  Tech: Tech,
  Community: Community
};

const TaskCard = ({ row }) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { address } = useAccount();
  const { open } = useWalletConnector();

  const [
    checkOnboardingAllowlist,
    { data: result, isLoading, isUninitialized }
  ] = useLazyCheckOnboardingAllowlistQuery();

  const handleClick = async () => {
    let addressToVerify = address as string;
    if (!addressToVerify) {
      const state = await open();
      addressToVerify = state?.address;
    }

    if (!addressToVerify) {
      // show some error that it could not be verified unless user connects to a wallet
    } else {
      checkOnboardingAllowlist(addressToVerify);
    }
  };

  const handleDialogClose = () => {
    console.log("Verify task close");
  };

  useEffect(() => {
    // if (isUninitialized && address) {
    //   checkOnboardingAllowlist(address);
    // }
  }, [isUninitialized, address]);

  useEffect(() => {
    if (result && result?.isAllowed) {
      setOpenSuccess(true);
    } else if (result && !result?.isAllowed) {
      setOpenError(true);
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

  return (
    <>
      <LoadingDialog
        handleClose={openSuccess}
        open={isLoading}
        message="Verifying task..."
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
        message={
          "Looks like your task hasn't been verified yet. Try again later."
        }
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
            xxl: "24px 32px"
          },
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Stack direction="row" justifyContent="center" display="flex">
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
            <img
              src={roleIcons[row?.role]}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </Avatar>
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
              {row?.name}
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
            marginTop={3}
            color="offWhite.main"
            textAlign="center"
            fontFamily="FractulAltLight"
            lineHeight={1}
            fontWeight="bold"
            fontSize={{
              xs: "16px",
              md: "18px",
              xxl: "20px"
            }}
            letterSpacing="0.0025em"
          >
            {row?.description}
          </Typography>
          <AutOsButton
            sx={{
              background: "linear-gradient(#244AFF, #1BB8FF) !important",
              mt: "24px"
            }}
            onClick={() => handleClick()}
          >
            <Typography variant="body" fontWeight="normal" color="white">
              Verify
            </Typography>
          </AutOsButton>
        </Stack>
      </Box>
    </>
  );
};

export default TaskCard;
