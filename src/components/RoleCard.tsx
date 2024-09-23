
import { Box, Typography, Stack, useTheme } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { AutOsButton } from "./AutButton";
import { useLazyCheckHasMintedForHubQuery } from "@api/hub.api";
import SuccessDialog from "./Dialog/SuccessPopup";
import ErrorDialog from "./Dialog/ErrorPopup";
import { useAccount } from "wagmi";
import { pulsate } from "./HubCard";
import { setSelectedRoleId } from "@store/WalletProvider/WalletProvider";
import { useAppDispatch } from "@store/store.model";
import { Role } from "@aut-labs/sdk/dist/models/role";
import { HubOSHub } from "@api/hub.model";

interface RoleCardProps {
  role: Role;
  hub: HubOSHub;
}

const RoleCard = ({ role, hub }: RoleCardProps) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [checkHasMinted, { data: checkResult, isLoading: checkLoading }] =
    useLazyCheckHasMintedForHubQuery();

  const handleClick = async () => {
    await dispatch(setSelectedRoleId(role?.id));
    handleMint();
  };

  const refetchData = async () => {
    await checkHasMinted(
      {
        address,
        hubAddress: hub?.properties?.address
      },
      false
    );
  };

  useEffect(() => {
    refetchData();
    window.addEventListener("aut-minted", refetchData);
    window.addEventListener("aut-joined", refetchData);
    return () => {
      window.removeEventListener("aut-minted", refetchData);
      window.removeEventListener("aut-joined", refetchData);
    };
  }, [address]);

  const handleMint = async () => {
    setOpenSuccess(false);
    const event = new CustomEvent("aut-open", {
      composed: true,
      cancelable: true,
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  return (
    <>
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
            component="div"
          >
            <Typography
              marginTop={3}
              color="offWhite.main"
              textAlign="center"
              fontFamily="FractulAltLight"
              lineHeight={1}
              variant="subtitle2"
            >
              Claim your role in this hub as {role?.roleName}
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
                    checkResult?.hasMintedForHub &&
                    +checkResult?.role == +role?.id && {
                      background: (theme) => theme.palette.success.main,
                      "&:hover": {
                        background: (theme) => theme.palette.success.main
                      }
                    })
                }
              }}
              onClick={() => handleClick()}
              disabled={
                (checkLoading || !!checkResult) &&
                (checkResult?.hasMinted || checkResult?.hasMintedForHub)
              }
            >
              <Typography variant="body" fontWeight="normal" color="white">
                {+checkResult?.role == +role?.id && checkResult?.hasMintedForHub
                  ? "Current Role"
                  : checkResult?.hasMinted
                    ? "Unavailable"
                    : "Join"}
                {/* {checkResult?.role == role?.id && checkResult?.hasMintedForHub
                  ? "Current Role"
                  : checkResult?.hasMinted
                    ? "Unavailable"
                    : "Join"} */}
              </Typography>
            </AutOsButton>
          </>
        </Stack>
      </Box>
    </>
  );
};

export default memo(RoleCard);
