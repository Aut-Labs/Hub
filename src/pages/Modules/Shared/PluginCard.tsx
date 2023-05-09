import { useAddPluginToDAOMutation } from "@api/plugin-registry.api";
import { PluginDefinition } from "@aut-labs-private/sdk";
import {
  Box,
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
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useSelector } from "react-redux";
import { SelectedNetworkConfig } from "@store/WalletProvider/WalletProvider";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import {
  ModuleDefinition,
  PluginDefinitionType
} from "@aut-labs-private/sdk/dist/models/plugin";
import LinkWithQuery from "@components/LinkWithQuery";
import { useEthers } from "@usedapp/core";
// import { useActivateModuleMutation } from "@api/module-registry.api";

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

  const actionName = useMemo(() => {
    if (!plugin?.pluginAddress) return "Install";

    if (
      plugin.pluginDefinitionId === PluginDefinitionType.QuestOnboardingPlugin
    ) {
      return "View Quests";
    }
    return "Add Task";
  }, [plugin]);

  return (
    <>
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <GridCard
        sx={{
          bgcolor: "nightBlack.main",
          borderColor: "divider",
          borderRadius: "16px",
          minHeight: "300px",
          boxShadow: 7
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
            color: "white"
          }}
          action={
            <>
              {!!plugin?.pluginAddress && <CheckCircleIcon color="success" />}
            </>
          }
          title={plugin?.metadata?.properties?.title}
          subheader={plugin?.metadata?.properties?.shortDescription}
        />
        <CardContent
          sx={{
            pt: 0
          }}
        >
          <Stack direction="row" alignItems="flex-end" justifyContent="center">
            <Typography
              sx={{
                letterSpacing: "-.04em",
                color: !!plugin.pluginAddress ? "primary.main" : "error.light"
              }}
              lineHeight={1}
              variant="h2"
            >
              {!!plugin.pluginAddress ? "Activated" : "Inactive"}
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

          <Box
            sx={{
              width: "100%",
              display: "flex"
            }}
          >
            <LoadingButton
              loading={isLoading}
              sx={{
                width: "80%",
                my: 6,
                mx: "auto"
              }}
              size="large"
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
              color="offWhite"
            >
              {actionName}
            </LoadingButton>
          </Box>

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

export const EmptyPluginCard = ({ type }) => {
  return (
    <GridCard
      sx={{
        bgcolor: "nightBlack.main",
        borderColor: "divider",
        borderStyle: "dashed",
        borderRadius: "16px",
        boxShadow: 7,
        minHeight: "300px"
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
          <Typography textAlign="center" color="white" variant="body">
            Request new <br /> {type} plugin
          </Typography>
          <AddIcon
            sx={{
              mt: 2,
              color: "white",
              fontSize: "80px"
            }}
          />
        </CardContent>
      </CardActionArea>
    </GridCard>
  );
};

// export const ModuleDefinitionCard = ({
//   module,
//   isFetching
// }: {
//   isFetching: boolean;
//   module: ModuleDefinition;
// }) => {
//   const [activateOnboarding, { isLoading }] = useActivateModuleMutation();

//   return (
//     <GridCard
//       sx={{
//         bgcolor: "nightBlack.main",
//         borderColor: "divider",
//         borderRadius: "16px",
//         minHeight: "300px",
//         boxShadow: 7,
//         display: "flex",
//         flexDirection: "column"
//       }}
//       variant="outlined"
//     >
//       <CardHeader
//         sx={{
//           alignItems: "center",
//           ".MuiCardHeader-action": {
//             mt: "3px"
//           },
//           display: "flex",
//           flexDirection: "column"
//         }}
//         titleTypographyProps={{
//           fontFamily: "FractulAltBold",
//           mb: 2,
//           fontWeight: 900,
//           color: "white",
//           variant: "subtitle1"
//         }}
//         title={`${module?.metadata?.properties?.title}`}
//       />
//       <CardContent
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column"
//         }}
//       >
//         <Stack flex={1} maxWidth="80%" mx="auto">
//           <Typography variant="body" textAlign="center" color="white">
//             {module?.metadata?.properties?.shortDescription}
//           </Typography>
//         </Stack>
//         <LoadingButton
//           loading={isLoading}
//           sx={{
//             width: "80%",
//             mx: "auto",
//             my: 6
//           }}
//           disabled={isLoading || isFetching}
//           variant="outlined"
//           size="large"
//           loadingIndicator={
//             <Stack direction="row" gap={1} alignItems="center">
//               <Typography className="text-secondary">Activating...</Typography>
//               <CircularProgress
//                 size="20px"
//                 color={module.isActivated ? "offWhite" : "primary"}
//               />
//             </Stack>
//           }
//           {...(module.isActivated && {
//             to: module?.metadata?.properties?.type,
//             preserveParams: true,
//             component: LinkWithQuery
//           })}
//           {...(!module.isActivated && {
//             onClick: () =>
//               activateOnboarding({
//                 moduleId: 1
//               })
//           })}
//           color="offWhite"
//         >
//           {module.isActivated ? "Go to plugins" : "Actvate"}
//         </LoadingButton>

//         {/* <Stack direction="row" justifyContent="flex-end">
//           <Typography
//             className="text-secondary"
//             sx={{
//               mr: "2px",
//               fontWeight: "bold",
//               fontFamily: "FractulAltBold",
//               fontSize: "12px"
//             }}
//           >
//             {plugin?.metadata?.name}
//           </Typography>
//         </Stack> */}
//       </CardContent>
//     </GridCard>
//   );
// };

export default memo(PluginCard);
