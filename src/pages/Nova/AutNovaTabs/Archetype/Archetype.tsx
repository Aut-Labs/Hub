import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import ArchetypePieChart from "./ArchetypePieChart";
import { AutOsButton } from "@components/AutButton";
import { useAutConnector, useWalletConnector } from "@aut-labs/connector";
import { ArchetypeDialog } from "./ArchetypeDialog";
import AutSDK, { Nova } from "@aut-labs/sdk";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { ResponsiveContainer } from "recharts";

const Archetypes = ({ nova }) => {
  const [isArchetypeOpen, setIsArchetypeOpen] = React.useState(false);
  const [notAdminOpen, setNotAdminOpen] = React.useState(false);
  const handleClose = () => {
    setIsArchetypeOpen(false);
  };

  const { address } = useAutConnector();
  const { open } = useWalletConnector();

  const isArchetypeSet = React.useMemo(() => {
    return !!nova?.properties?.archetype;
  }, [nova]);

  const canSetArchetype = React.useMemo(() => {
    if (!address && !isArchetypeSet) return true;
    if (
      nova.properties?.userData?.isAdmin ||
      address === nova?.properties?.deployer
    ) {
      return true;
    }
  }, [nova, address, isArchetypeSet]);

  const setArchtype = async () => {
    let addressToVerify = address as string;
    if (!addressToVerify) {
      const state = await open();
      addressToVerify = state?.address;
    }
    const sdk = await AutSDK.getInstance();
    const novaContract = sdk.initService(Nova, nova.properties?.address);

    const isAdmin =
      await novaContract.contract.functions.isAdmin(addressToVerify);

    if (!isAdmin) {
      setNotAdminOpen(true);
    } else {
      setIsArchetypeOpen(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: "20px", height: "100%" }}>
      <>
        <ErrorDialog
          handleClose={() => setNotAdminOpen(false)}
          open={notAdminOpen}
          message="You didn't verify your project yet. Verify it now to make your project public and set up the Archetype"
        />
        <ArchetypeDialog
          open={isArchetypeOpen}
          archetype={nova?.properties?.archetype}
          title="Archetype"
          onClose={handleClose}
          nova={nova}
        />
        {!isArchetypeSet && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gridGap: "12px",
              textAlign: "center",
              position: "absolute",
              top: "60px",
              left: "60px",
              right: "60px",
              bottom: "60px",
              zIndex: 99,
              backdropFilter: "blur(12px)",
              background: "rgba(128, 128, 128, 0.06)",
              borderRadius: "42px"
            }}
          >
            <Typography mb={4} color="white" variant="subtitle2">
              this project didn’t set an archetype yet.
              <br />
              is this your project?
            </Typography>
            <AutOsButton
              onClick={setArchtype}
              type="button"
              color="primary"
              size="small"
              variant="outlined"
              disabled={!canSetArchetype}
            >
              <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                Set Archetype
              </Typography>
            </AutOsButton>
          </Box>
        )}
        <Box
          className="map-wrapper"
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            height: "100%",
            "& > DIV": {
              width: "100%"
            },
            ...(!isArchetypeSet && {
              mixBlendMode: "plus-lighter",
              opacity: 0.6,
              filter: "blur(20px)"
            })
          }}
        >
          {isArchetypeSet && canSetArchetype ? (
            <Box
              sx={{
                position: "relative"
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ArchetypePieChart archetype={nova?.properties?.archetype} />
              </ResponsiveContainer>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  position: "absolute",
                  borderRadius: "8px",
                  maxWidth: "220px",
                  boxShadow: 2,
                  background: "rgba(240, 245, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  padding: 2,
                  top: "0",
                  right: "0",
                  flexDirection: "column"
                }}
              >
                <Typography mb={2} variant="caption" color="white">
                  wanna try out another archetype? switch to a new one below
                </Typography>

                <AutOsButton
                  onClick={() => setIsArchetypeOpen(true)}
                  type="button"
                  color="primary"
                  size="small"
                  variant="outlined"
                >
                  <Typography
                    fontWeight="700"
                    fontSize="16px"
                    lineHeight="26px"
                  >
                    switch archetype
                  </Typography>
                </AutOsButton>
              </Box>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ArchetypePieChart archetype={nova?.properties?.archetype} />
            </ResponsiveContainer>
          )}
        </Box>
      </>
    </Container>
  );
};

export default Archetypes;
