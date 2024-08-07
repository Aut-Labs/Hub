/* eslint-disable max-len */
import AutLoading from "@components/AutLoading";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  styled,
  MenuItem,
  InputAdornment
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useMemo, useState } from "react";
import NovaCard from "@components/NovaCard";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { useGetAllNovasQuery } from "@api/community.api";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { AutSelectField } from "@theme/field-select-styles";
import { ReactComponent as Markets } from "@assets/icons/markets.svg";
import { ReactComponent as Archetypes } from "@assets/icons/archetype.svg";
import { ReactComponent as Filters } from "@assets/icons/filters.svg";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { Community, MarketTemplates } from "@api/community.model";
import { filterActiveNovas } from "./utils";

const AutContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingLeft: "60px",
  paddingRight: "60px"
  // backgroundImage: `url(${backgroundImage})`,
  // backgroundBlendMode: "hard-light",
  // backgroundSize: "cover"
}));

export const GridBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gridGap: "20px",
  marginTop: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  },
  [theme.breakpoints.up("md")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr"
  }
}));

export const NovaList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [marketFilter, setMarketFilter] = useState("");
  const [novaFilter, setNovaFilter] = useState("");
  const [archetypeFilter, setArchetypeFilter] = useState("");
  const { novaName } = useParams();
  const { address } = useAccount();

  const { data, isLoading, isFetching, refetch } = useGetAllNovasQuery(
    {
      connectedAddress: address
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  const filteredNovas: Community[] = useMemo(() => {
    let novas: Community[] = data?.daos || [];
    const userAddress = address?.toLowerCase();

    if (!novas) {
      return [];
    }
    novas = [...novas];

    if (novaName) {
      novas = novas.sort((a, b) => {
        if (a.name?.toLowerCase() === novaName?.toLowerCase()) {
          return -1;
        } else if (b.name?.toLowerCase() === novaName?.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    if (userAddress) {
      novas = novas.sort((a, b) => {
        if (a.properties.deployer?.toLowerCase() === userAddress) {
          return -1;
        } else if (b.properties.deployer?.toLowerCase() === userAddress) {
          return 1;
        } else {
          return 0;
        }
      });
      if (novaFilter === "My Hub") {
        novas = novas.filter(
          (nova) =>
            nova.properties.deployer?.toLowerCase() ===
              userAddress.toLowerCase() ||
            nova.properties.membersList.some(
              (autId) => autId.id.toLowerCase() === userAddress.toLowerCase()
            )
        );
      }
    }

    novas = filterActiveNovas(novas, userAddress);

    if (archetypeFilter) {
      novas = novas.filter(
        (nova) =>
          nova?.properties?.archetype?.default === Number(archetypeFilter)
      );
    }

    if (marketFilter) {
      const marketNum = MarketTemplates.find(
        (v) => v.title === marketFilter || v.market === +marketFilter
      );
      novas = novas.filter(
        (nova) => nova?.properties?.market === marketNum?.title
      );
    }
    return novas;
  }, [data, novaName, address, archetypeFilter, marketFilter, novaFilter]);

  return (
    <PerfectScrollbar
      style={{
        ...(isMobile && {
          marginTop: `${TOOLBAR_HEIGHT}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
        }),
        ...(!isMobile && {
          marginTop: `${TOOLBAR_HEIGHT}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
        }),
        display: "flex",
        flexDirection: "column"
      }}
    >
      <AutContainer>
        <ErrorDialog handleClose={() => null} open={null} message={null} />
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            width: "100%"
          }}
        >
          <Box
            sx={{
              borderRadius: "8px",
              borderStyle: "solid",
              padding: "10px",
              mt: "20px",
              color: theme.palette.primary.contrastText,
              maxWidth: "350px"
            }}
          >
            <Typography variant="caption">
              Disclaimer: ⚠️ Hubs are currently invitation-only, and you can
              join only the Hub you created or you've been invited to. Choose
              wisely - or wait till June '24.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-start",
            gap: "25px",
            mt: "24px",
            flexDirection: isMobile ? "column" : "row"
          }}
        >
          {address && (
            <AutSelectField
              value={novaFilter}
              color="offWhite"
              defaultValue={""}
              placeholder="Onboarding Status"
              onChange={(e) => setNovaFilter(e.target.value as string)}
              startAdornment={
                <InputAdornment
                  position="start"
                  sx={{ width: "30px", height: "30px" }}
                >
                  <Filters />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>All Hubs</em>
              </MenuItem>
              <MenuItem value="My Hub">
                <em>My Hub</em>
              </MenuItem>
            </AutSelectField>
          )}

          <AutSelectField
            value={marketFilter}
            color="offWhite"
            onChange={(e) => {
              setMarketFilter(e.target.value as string);
            }}
            startAdornment={
              <InputAdornment
                position="start"
                sx={{ width: "30px", height: "30px" }}
              >
                <Markets />
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>All Markets</em>
            </MenuItem>
            {MarketTemplates.map((market) => {
              return (
                <MenuItem key={market.title} value={market.market}>
                  <em>{market.title}</em>
                </MenuItem>
              );
            })}
          </AutSelectField>
          <AutSelectField
            value={archetypeFilter}
            color="offWhite"
            onChange={(e) => {
              setArchetypeFilter(e.target.value as string);
            }}
            startAdornment={
              <InputAdornment
                position="start"
                sx={{ width: "30px", height: "30px" }}
              >
                <Archetypes />
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>All Archetypes</em>
            </MenuItem>
            <MenuItem value="1">
              <em>Size</em>
            </MenuItem>
            <MenuItem value="2">
              <em>Reputation</em>
            </MenuItem>
            <MenuItem value="3">
              <em>Conviction</em>
            </MenuItem>
            <MenuItem value="4">
              <em>Performance</em>
            </MenuItem>
            <MenuItem value="5">
              <em>Growth</em>
            </MenuItem>
          </AutSelectField>
        </Box>

        {!isLoading && !filteredNovas?.length && (
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              mt: 12,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography color="rgb(107, 114, 128)" variant="subtitle2">
              No Novas were found...
            </Typography>
            {/* @ts-ignore */}
            <Button
              size="medium"
              component="span"
              color="offWhite"
              startIcon={<RefreshIcon />}
              sx={{
                ml: 1
              }}
              disabled={isLoading || isFetching}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </Box>
        )}

        {isLoading || isFetching ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <>
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {filteredNovas.map((dao, index) => (
                <NovaCard
                  key={`nova-card-${index}`}
                  daoData={dao}
                  isHighlighted={dao.name === novaName}
                />
              ))}
            </GridBox>
          </>
        )}
      </AutContainer>
    </PerfectScrollbar>
  );
};
