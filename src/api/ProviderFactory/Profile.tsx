import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useConnect, useDisconnect, useAccount, useNetwork } from "wagmi";
import CopyAddress from "@components/CopyAddress";
import DialogWrapper from "@components/Dialog/DialogWrapper";

const Profile: React.FC<{ isOpen: boolean; closeModal?: () => void }> = ({
  closeModal,
  isOpen = false
}) => {
  const { reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { address, isConnected, connector } = useAccount();
  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  useEffect(() => {
    if (!shouldDisconnect) return;

    if (closeModal) {
      closeModal();
    } else {
      //   context.setOpen(false);
    }

    return () => {
      disconnect();
      reset();
    };
  }, [shouldDisconnect, disconnect, reset]);

  return (
    <DialogWrapper open={isOpen} onClose={closeModal}>
      <Box my={2} display="flex" flexDirection="column" alignItems="center">
        <Avatar>{address ? address[0] : "A"}</Avatar>
        <Typography variant="h1">
          <CopyAddress address={address} />
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShouldDisconnect(true)}
      >
        Disconnect
      </Button>
    </DialogWrapper>
  );
};

export default Profile;
