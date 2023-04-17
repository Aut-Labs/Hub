import { ipfsCIDToHttpUrl } from "@api/storage.api";
import CopyAddress from "@components/CopyAddress";
import {
  Box,
  Stack,
  Typography,
  Tooltip,
  Avatar,
  IconButton,
  SvgIcon,
  Link
} from "@mui/material";
import { memo, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionIcon from "@mui/icons-material/Description";
import { useGetCommunityQuery } from "@api/community.api";
import { NetworksConfig } from "@store/WalletProvider/WalletProvider";
import { useEthers } from "@usedapp/core";
import { useSelector } from "react-redux";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { RequiredQueryParams } from "../../api/RequiredQueryParams";

const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};

const CommunityInfo = () => {
  const [searchParams] = useSearchParams();
  const networks = useSelector(NetworksConfig);
  const { account, chainId } = useEthers();

  const selectedNetworkConfig = useMemo(() => {
    const config = networks.find(
      (n) => n.chainId?.toString() === chainId?.toString()
    );
    return config;
  }, []);
  const blockExplorer = useMemo(() => {
    if (selectedNetworkConfig) {
      return selectedNetworkConfig.explorerUrls[0];
    }
  }, [selectedNetworkConfig]);

  const { data } = useGetCommunityQuery(null, {
    selectFromResult: ({ data }) => ({
      data
    })
  });

  return (
    <Box
      sx={{
        flex: 1,
        boxShadow: 1,
        border: "2px solid",
        borderColor: "divider",
        height: "100%",
        borderRadius: "16px",
        p: 3,
        width: "100%",
        backgroundColor: "nightBlack.main"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between"
        }}
      >
        <Stack direction="column">
          <Typography color="white" variant="subtitle1">
            <Stack direction="row" alignItems="center">
              {data?.community?.name}
              <Tooltip title={data?.community?.description}>
                <DescriptionIcon
                  sx={{
                    color: "offWhite.main",
                    ml: 1
                  }}
                />
              </Tooltip>
            </Stack>
          </Typography>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              gridGap: 2
            }}
          >
            <Avatar
              sx={{
                bgcolor: "background.default",
                width: {
                  xs: "64px",
                  xxl: "87px"
                },
                height: {
                  xs: "64px",
                  xxl: "87px"
                },
                borderRadius: 0,
                mr: {
                  xs: "15px"
                },
                border: "1px solid white"
              }}
              aria-label="community-avatar"
              src={ipfsCIDToHttpUrl(data?.community?.image as string)}
            />
            <Stack gap={2}>
              <Stack direction="row" alignItems="center">
                <CopyAddress
                  address={searchParams.get(RequiredQueryParams.DaoAddress)}
                />
                <Tooltip title={`Explore in ${selectedNetworkConfig?.name}`}>
                  <IconButton
                    sx={{ color: "white", p: 0, ml: 1 }}
                    href={`${blockExplorer}/address/${searchParams.get(
                      RequiredQueryParams.DaoAddress
                    )}`}
                    target="_blank"
                    color="offWhite"
                  >
                    <OpenInNewIcon sx={{ cursor: "pointer", width: "20px" }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row">
                {data?.community?.properties.socials.map((social, index) => {
                  const AutIcon = socialIcons[Object.keys(socialIcons)[index]];

                  return (
                    <Link
                      key={`social-icon-${index}`}
                      {...(!!social.link && {
                        color: "offwhite.main",
                        component: "a",
                        href: social.link,
                        target: "_blank"
                      })}
                      {...(!social.link && {
                        sx: {
                          color: "divider"
                        },
                        component: "button",
                        disabled: true
                      })}
                    >
                      <SvgIcon
                        sx={{
                          height: {
                            xs: "25px",
                            xxl: "30px"
                          },
                          width: {
                            xs: "25px",
                            xxl: "30px"
                          },
                          mr: {
                            xs: "10px",
                            xxl: "15px"
                          }
                        }}
                        key={`socials.${index}.icon`}
                        component={AutIcon}
                      />
                    </Link>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Link
          color="primary.light"
          sx={{
            mt: 1
          }}
          variant="body"
          target="_blank"
          href={`https://my.aut.id/${data?.admin}`}
        >
          {data?.admin === account ? "View profile" : "View owner"}
        </Link>
      </Box>
    </Box>
  );
};

export default memo(CommunityInfo);
