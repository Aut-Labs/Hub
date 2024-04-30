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
  InputAdornment,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useState } from "react";
import NovaCard from "@components/NovaCard";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { useGetAllNovasQuery } from "@api/community.api";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { AutSelectField } from "@theme/field-select-styles";
import { ReactComponent as Filters } from "@assets/icons/filters.svg";
import { ReactComponent as Markets } from "@assets/icons/markets.svg";
import { ReactComponent as Archetypes } from "@assets/icons/archetype.svg";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { MarketTemplates } from "@api/community.model";

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
  // should only see novas with more than 0 members
  // if connected can see their nova that has 0 members so they can join it
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeOnboardingFilter, setActiveOnboardingFilter] = useState("");
  const [marketFilter, setMarketFilter] = useState("");
  const [archetypeFilter, setArchetypeFilter] = useState("");
  const { novaName } = useParams();
  const { address } = useAccount();

  const { data, isLoading, isFetching } = useGetAllNovasQuery(
    {
      marketFilter,
      archetypeFilter,
      connectedAddress: address,
      novaName: novaName
    },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );
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
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-start",
            gap: "25px",
            mt: isMobile ? "24px" : "100px",
            flexDirection: isMobile ? "column" : "row"
          }}
        >
          <AutSelectField
            value={activeOnboardingFilter}
            color="offWhite"
            defaultValue={""}
            placeholder="Onboarding Status"
            onChange={(e) =>
              setActiveOnboardingFilter(e.target.value as string)
            }
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
              <em>All Novae</em>
            </MenuItem>
            <MenuItem value="Active">
              <em>Active</em>
            </MenuItem>
            <MenuItem value="Inactive">
              <em>Inactive</em>
            </MenuItem>
          </AutSelectField>
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
              <em>Archetype</em>
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

        {!isLoading && !(data?.daos || [])?.length && (
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
            <Button
              size="medium"
              component="span"
              color="offWhite"
              startIcon={<RefreshIcon />}
              sx={{
                ml: 1
              }}
              disabled={isLoading || isFetching}
              // onClick={refetch}
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
              {(data?.daos || []).map((dao, index) => (
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
