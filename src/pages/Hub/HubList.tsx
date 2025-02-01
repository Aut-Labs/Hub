 
import AutLoading from "@components/AutLoading";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  styled,
  MenuItem,
  InputAdornment,
  Container
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PerfectScrollbar from "react-perfect-scrollbar";
import { memo, useMemo, useState } from "react";
import HubCard from "@components/HubCard";
import { useGetAllHubsQuery } from "@api/hub.api";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { AutSelectField } from "@theme/field-select-styles";
import Markets from "@assets/icons/markets.svg?react";
import Archetypes from "@assets/icons/archetype.svg?react";
import Filters from "@assets/icons/filters.svg?react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { HubOSHub, MarketTemplates } from "@api/hub.model";
import { filterActiveHubs } from "./utils";

const AutContainer = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%"
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

const MemoizedAutSelectField = memo(AutSelectField);

const HubList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [marketFilter, setMarketFilter] = useState("");
  const [hubFilter, setHubFilter] = useState("");
  const [archetypeFilter, setArchetypeFilter] = useState("");
  const { hubName } = useParams();
  const { address } = useAccount();

  const { data, isLoading, isFetching, refetch } = useGetAllHubsQuery(
    {
      connectedAddress: address
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  const filteredHubs: HubOSHub[] = useMemo(() => {
    let hubs: HubOSHub[] = data?.hubs || [];
    const userAddress = address?.toLowerCase();

    if (!hubs) {
      return [];
    }
    hubs = [...hubs];

    if (hubName) {
      hubs = hubs.sort((a, b) => {
        if (a.name?.toLowerCase() === hubName?.toLowerCase()) {
          return -1;
        } else if (b.name?.toLowerCase() === hubName?.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    if (userAddress) {
      hubs = hubs.sort((a, b) => {
        if (a.properties.deployer?.toLowerCase() === userAddress) {
          return -1;
        } else if (b.properties.deployer?.toLowerCase() === userAddress) {
          return 1;
        } else {
          return 0;
        }
      });
      if (hubFilter === "my-hubs") {
        hubs = hubs.filter(
          (hub) =>
            hub.properties.deployer?.toLowerCase() ===
              userAddress.toLowerCase() ||
            hub.properties.members.some(
              (autId) =>
                autId.properties.address.toLowerCase() ===
                userAddress.toLowerCase()
            )
        );
      }
    }

    hubs = filterActiveHubs(hubs, userAddress);

    if (archetypeFilter) {
      hubs = hubs.filter(
        (hub) => hub?.properties?.archetype?.default === Number(archetypeFilter)
      );
    }

    if (marketFilter) {
      const marketNum = MarketTemplates.find(
        (v) => v.title === marketFilter || v.market === +marketFilter
      );
      hubs = hubs.filter((hub) => hub?.properties?.market === marketNum?.title);
    }
    return hubs;
  }, [data, hubName, address, archetypeFilter, marketFilter, hubFilter]);

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-start",
            gap: "25px",
            mt: "48px",
            flexDirection: isMobile ? "column" : "row"
          }}
        >
          {address && (
            <MemoizedAutSelectField
              value={hubFilter}
              color="offWhite"
              defaultValue={""}
              placeholder="Onboarding Status"
              onChange={(e) => setHubFilter(e.target.value as string)}
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
              <MenuItem value="my-hubs">
                <em>My Hubs</em>
              </MenuItem>
            </MemoizedAutSelectField>
          )}

          <MemoizedAutSelectField
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
          </MemoizedAutSelectField>
          <MemoizedAutSelectField
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
          </MemoizedAutSelectField>
        </Box>

        {!isLoading && !filteredHubs?.length && (
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
              No Hubs were found...
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
          <AutLoading width="120px" height="120px" />
        ) : (
          <>
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {filteredHubs.map((hub, index) => (
                <HubCard
                  key={`hub-card-${index}`}
                  hubData={hub}
                  isHighlighted={hub.name === hubName}
                />
              ))}
            </GridBox>
          </>
        )}
      </AutContainer>
    </PerfectScrollbar>
  );
};

export default memo(HubList);
