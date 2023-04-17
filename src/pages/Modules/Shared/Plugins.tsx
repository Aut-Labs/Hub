import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
  styled
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import PluginCard, { EmptyPluginCard } from "./PluginCard";
import LoadingProgressBar from "@components/LoadingProgressBar";
import { BaseNFTModel } from "@aut-labs-private/sdk/dist/models/baseNFTModel";
import { PluginDefinitionProperties } from "@aut-labs-private/sdk/dist/models/plugin";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";
import { IsAdmin } from "@store/Community/community.reducer";
import { Link, useSearchParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutLoading from "@components/AutLoading";

const GridBox = styled(Box)(({ theme }) => {
  return {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridGap: "30px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))"
    },
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(3,minmax(0,1fr))"
    }
  };
});

interface StackParams {
  definition: BaseNFTModel<PluginDefinitionProperties>;
}

const Plugins = ({ definition }: StackParams) => {
  const isAdmin = useSelector(IsAdmin);
  const [searchParams] = useSearchParams();
  const [showInstalled, setToggleInstalled] = useState(false);

  const { plugins, isLoading, isFetching, refetch } =
    useGetAllPluginDefinitionsByDAOQuery(null, {
      // @ts-ignore
      selectFromResult: ({ data, isLoading, isFetching, refetch }) => ({
        isLoading,
        refetch,
        isFetching,
        plugins: (data || []).filter(
          (p) =>
            p.metadata?.properties?.module?.type ===
            definition?.properties?.module?.type
        )
      })
    });

  const filteredPlugins = useMemo(() => {
    if (!showInstalled) return plugins;
    return plugins.filter((p) => p.pluginAddress);
  }, [showInstalled, plugins]);

  return (
    <>
      <LoadingProgressBar isLoading={isFetching} />
      <Container maxWidth="lg" sx={{ py: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative"
          }}
        >
          <Stack alignItems="center" justifyContent="center">
            {searchParams.get("returnUrl") && (
              <Button
                startIcon={<ArrowBackIcon />}
                color="offWhite"
                sx={{
                  position: "absolute",
                  left: 0
                }}
                to={searchParams.get("returnUrl")}
                component={Link}
              >
                {searchParams.get("returnUrlLinkName") || "Back"}
              </Button>
            )}
            <Typography textAlign="center" color="white" variant="h3">
              {definition.properties.module.title}
              <Tooltip title="Refresh plugins">
                <IconButton
                  size="medium"
                  color="offWhite"
                  component="span"
                  sx={{
                    ml: 1
                  }}
                  disabled={isLoading || isFetching}
                  onClick={refetch}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Typography>
          </Stack>

          {!!plugins?.length && (
            <Box
              sx={{
                display: "flex",
                mt: 4,
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <FormControlLabel
                sx={{
                  color: "white"
                }}
                onChange={(_, checked) => setToggleInstalled(checked)}
                control={<Switch checked={showInstalled} color="primary" />}
                label="Show installed"
              />
            </Box>
          )}
        </Box>

        {isLoading ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <>
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {filteredPlugins.map((plugin, index) => (
                <PluginCard
                  isFetching={isFetching}
                  isAdmin={isAdmin}
                  key={`modules-plugin-${index}`}
                  plugin={plugin}
                />
              ))}
              <EmptyPluginCard />
            </GridBox>
          </>
        )}
      </Container>
    </>
  );
};

export default memo(Plugins);
