import { Box, Avatar, Typography, Stack, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AutOsButton } from "./AutButton";
import {
  communityApi,
  useLazyCheckOnboardingAllowlistQuery
} from "@api/community.api";
import LoadingDialog from "./Dialog/LoadingPopup";
import SuccessDialog from "./Dialog/SuccessPopup";
import Community from "@assets/community.png";
import Creative from "@assets/creative.png";
import Tech from "@assets/tech.png";
import { useAccount } from "wagmi";
import { updateWalletProviderState } from "@store/WalletProvider/WalletProvider";
import { useAppDispatch } from "@store/store.model";
import ErrorDialog from "./Dialog/ErrorPopup";

const roleIcons = {
  Creative: Creative,
  Tech: Tech,
  Community: Community
};

const TaskCard = (data: any) => {
  const { row } = data;
  const theme = useTheme();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { connector, isReconnecting, isConnecting, isConnected } = useAccount();
  const dispatch = useAppDispatch();

  const [checkOnboardingAllowlist, { data: result, isLoading, isError }] =
    useLazyCheckOnboardingAllowlistQuery();

  const handleClick = async () => {
    if (!isConnected) {
      await dispatch(
        updateWalletProviderState({
          isOpen: true
        })
      );
    } else {
      // await dispatch(communityApi.util.resetApiState());
      checkOnboardingAllowlist(null);
    }
  };

  const handleDialogClose = () => {
    console.log("Verify task close");
  };

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
          // backgroundImage: `url(${TaskBackground})`,
          backdropFilter: "blur(50px)",
          backgroundColor: "rgba(128, 128, 128, 0.05)",
          // boxShadow: "0px 3px 6px #707070",
          // borderRadius: "10px",
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='rgb(96,96,96)' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          borderRadius: "6px",
          margin: "40px",
          opacity: 1,
          WebkitBackdropFilter: "blur(6px)",
          height: "365px",
          width: "270px",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Stack direction="row" justifyContent="center" display="flex">
          <Avatar
            sx={{
              flex: "1",
              height: {
                xs: "60px",
                md: "70px",
                xxl: "70px"
              },
              borderRadius: "6px",
              width: {
                xs: "60px",
                md: "70px",
                xxl: "70px"
              },
              background: "transparent"
              // bgcolor: "purple",
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
              variant="subtitle1"
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
            color="offWhite.main"
            textAlign="left"
            lineHeight={1}
            variant="subtitle1"
          >
            <Typography
              marginTop={4}
              color="offWhite.main"
              textAlign="center"
              fontFamily="FractulAltLight"
              lineHeight={1}
              variant="subtitle2"
            >
              {row?.description}
            </Typography>
          </Typography>
          <AutOsButton
            sx={{
              background: "linear-gradient(#244AFF, #1BB8FF) !important",
              mt: "26px"
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
