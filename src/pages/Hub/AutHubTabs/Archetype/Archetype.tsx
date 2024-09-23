import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/material";
import ArchetypePieChart from "./ArchetypePieChart";
import { AutOsButton } from "@components/AutButton";
import { useWalletConnector } from "@aut-labs/connector";
import { ArchetypeDialog } from "./ArchetypeDialog";
import AutSDK, { Hub } from "@aut-labs/sdk";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { ResponsiveContainer } from "recharts";
import { HubOSHub } from "@api/hub.model";
import { memo, useMemo, useState } from "react";

interface ArchetypesProps {
  hub: HubOSHub;
}

const Archetypes = ({ hub }: ArchetypesProps) => {
  const [isArchetypeOpen, setIsArchetypeOpen] = useState(false);
  const [notAdminOpen, setNotAdminOpen] = useState(false);
  const handleClose = () => {
    setIsArchetypeOpen(false);
  };

  const { open, state } = useWalletConnector();

  const isArchetypeSet = useMemo(() => {
    return !!hub?.properties?.archetype;
  }, [hub]);

  const isAdmin = useMemo(() => {
    const autId = hub.properties.members?.find(
      (m) =>
        m.properties.address?.toLowerCase() === state?.address?.toLowerCase()
    );
    if (!autId) return false;
    const joinedHub = autId.properties.joinedHubs.find(
      (h) =>
        h.hubAddress.toLowerCase() === hub?.properties.address.toLowerCase()
    );
    return joinedHub?.isAdmin;
  }, [hub, state]);

  const canSetArchetype = useMemo(() => {
    if (!state.address && !isArchetypeSet) return true;
    return isAdmin;
  }, [isAdmin, state.address, isArchetypeSet]);

  const setArchtype = async () => {
    let addressToVerify = state.address as string;
    if (!addressToVerify) {
      const state = await open();
      addressToVerify = state?.address;
    }
    const sdk = await AutSDK.getInstance();
    const hubContract = sdk.initService(Hub, hub.properties?.address);

    const isAdmin =
      await hubContract.contract.functions.isAdmin(addressToVerify);

    if (!isAdmin) {
      setNotAdminOpen(true);
    } else {
      setIsArchetypeOpen(true);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: "20px", height: "100%", minHeight: "300px" }}
    >
      <>
        <ErrorDialog
          handleClose={() => setNotAdminOpen(false)}
          open={notAdminOpen}
          message="You didn't verify your project yet. Verify it now to make your project public and set up the Archetype"
        />
        <ArchetypeDialog
          open={isArchetypeOpen}
          archetype={hub?.properties?.archetype}
          title="Archetype"
          onClose={handleClose}
          hub={hub}
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
              padding: "30px 20px",
              position: "relative",
              width: "100%",
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
                <ArchetypePieChart archetype={hub?.properties?.archetype} />
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
              <ArchetypePieChart archetype={hub?.properties?.archetype} />
            </ResponsiveContainer>
          )}
        </Box>
      </>
    </Container>
  );
};

export default memo(Archetypes);
