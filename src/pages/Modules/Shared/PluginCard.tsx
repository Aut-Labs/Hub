import { useAddPluginToDAOMutation } from "@api/plugin-registry.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled
} from "@mui/material";
import { memo, useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useSelector } from "react-redux";
import { SelectedNetworkConfig } from "@store/WalletProvider/WalletProvider";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { PluginDefinitionType } from "@aut-labs-private/sdk/dist/models/plugin";
import LinkWithQuery from "@components/LinkWithQuery";

const GridCard = styled(Card)(({ theme }) => {
  return {
    minHeight: "365px",
    width: "100%",
    transition: theme.transitions.create(["transform"]),
    "&:hover": {
      transform: "scale(1.019)"
    }
  };
});

const PluginCard = ({
  plugin,
  isFetching,
  isAdmin
}: {
  isAdmin: boolean;
  plugin: PluginDefinition;
  isFetching: boolean;
}) => {
  const selectedNetworkConfig = useSelector(SelectedNetworkConfig);
  const [addPlugin, { error, isLoading, isError, reset }] =
    useAddPluginToDAOMutation();

  const exploreAddressUrl = useMemo(() => {
    if (!selectedNetworkConfig) return;
    const [exploreUrl] = selectedNetworkConfig.explorerUrls;
    return `${exploreUrl}address/${plugin?.pluginAddress}`;
  }, [selectedNetworkConfig?.explorerUrls, plugin?.pluginAddress]);

  const path = useMemo(() => {
    return `${PluginDefinitionType[plugin.pluginDefinitionId]}`;
  }, []);

  return (
    <>
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <GridCard
        sx={{
          bgcolor: "nightBlack.main",
          borderColor: "divider",
          borderRadius: "16px",
          boxShadow: 3
        }}
        variant="outlined"
      >
        <CardHeader
          sx={{
            alignItems: "flex-start",
            minHeight: "140px",
            ".MuiCardHeader-action": {
              mt: "3px"
            }
          }}
          titleTypographyProps={{
            fontFamily: "FractulAltBold",
            mb: 2,
            fontWeight: 900,
            color: "white",
            variant: "subtitle1"
          }}
          subheaderTypographyProps={{
            className: "text-secondary"
          }}
          action={
            <>
              {!!plugin?.pluginAddress && <CheckCircleIcon color="success" />}
            </>
          }
          title={plugin?.metadata?.properties?.title}
          subheader={plugin?.metadata?.properties?.module?.shortDescription}
        />
        <CardContent
          sx={{
            pt: 0
          }}
        >
          <Stack direction="row" alignItems="flex-end">
            {!plugin.pluginAddress && (
              <Typography
                className="text-secondary"
                variant="body"
                lineHeight={1.7}
              >
                Price
              </Typography>
            )}

            <Typography
              sx={{
                letterSpacing: "-.04em",
                color: !!plugin.pluginAddress ? "primary.main" : "success.main"
              }}
              lineHeight={1}
              variant="h2"
            >
              {!!plugin.pluginAddress ? "Installed" : "Free"}
            </Typography>

            {!!plugin.pluginAddress && (
              <Tooltip title={`Explore in ${selectedNetworkConfig?.name}`}>
                <IconButton
                  href={exploreAddressUrl}
                  target="_blank"
                  color="offWhite"
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <LoadingButton
            loading={isLoading}
            sx={{
              width: "100%",
              my: 6
            }}
            disabled={
              isFetching || !path || (!plugin.pluginAddress && !isAdmin)
            }
            variant="outlined"
            loadingIndicator={
              <Stack direction="row" gap={1} alignItems="center">
                <Typography className="text-secondary">
                  Activating...
                </Typography>
                <CircularProgress
                  size="20px"
                  color={plugin.pluginAddress ? "offWhite" : "primary"}
                />
              </Stack>
            }
            {...(!!plugin.pluginAddress && {
              to: path,
              preserveParams: true,
              component: LinkWithQuery
            })}
            {...(!plugin.pluginAddress && {
              onClick: () => addPlugin(plugin)
            })}
            color={plugin.pluginAddress ? "offWhite" : "primary"}
          >
            {plugin.pluginAddress ? "Go to plugin" : "Install"}
          </LoadingButton>

          {/* <Stack direction="row" justifyContent="flex-end">
            <Typography
              className="text-secondary"
              sx={{
                mr: "2px",
                fontWeight: "bold",
                fontFamily: "FractulAltBold",
                fontSize: "12px"
              }}
            >
              {plugin?.metadata?.name}
            </Typography>
          </Stack> */}
        </CardContent>
      </GridCard>
    </>
  );
};

export const EmptyPluginCard = () => {
  return (
    <GridCard
      sx={{
        bgcolor: "nightBlack.main",
        borderColor: "divider",
        borderStyle: "dashed",
        borderRadius: "16px",
        boxShadow: 3
      }}
      variant="outlined"
    >
      <CardActionArea
        sx={{
          height: "100%"
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            cursor: "pointer"
          }}
        >
          <Typography
            className="text-secondary"
            variant="body"
            lineHeight={1.7}
          >
            Request a plugin type
          </Typography>
          <AddIcon
            className="text-secondary"
            sx={{
              fontSize: "80px"
            }}
          />
        </CardContent>
      </CardActionArea>
    </GridCard>
  );
};

export const PluginDefinitionCard = ({
  plugin
}: {
  plugin: PluginDefinition;
}) => {
  return (
    <GridCard
      sx={{
        bgcolor: "nightBlack.main",
        borderColor: "divider",
        borderRadius: "16px",
        minHeight: "300px",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column"
      }}
      variant="outlined"
    >
      <CardHeader
        sx={{
          alignItems: "center",
          ".MuiCardHeader-action": {
            mt: "3px"
          },
          display: "flex",
          flexDirection: "column"
        }}
        titleTypographyProps={{
          fontFamily: "FractulAltBold",
          mb: 2,
          fontWeight: 900,
          color: "white",
          variant: "subtitle1"
        }}
        title={plugin?.metadata?.properties?.module?.title}
      />
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Stack flex={1}>
          <Typography className="text-secondary" variant="body">
            {plugin?.metadata?.properties?.module?.shortDescription}
          </Typography>
        </Stack>

        <Button
          sx={{
            width: "100%",
            my: 6
          }}
          variant="outlined"
          color="offWhite"
          to={plugin?.metadata?.properties?.module?.type}
          component={Link}
        >
          View module
        </Button>
        {/* <Stack direction="row" justifyContent="flex-end">
          <Typography
            className="text-secondary"
            sx={{
              mr: "2px",
              fontWeight: "bold",
              fontFamily: "FractulAltBold",
              fontSize: "12px"
            }}
          >
            {plugin?.metadata?.name}
          </Typography>
        </Stack> */}
      </CardContent>
    </GridCard>
  );
};

export default memo(PluginCard);
