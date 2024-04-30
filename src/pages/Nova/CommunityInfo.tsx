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
import { useSearchParams } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  BlockExplorerUrl,
  SelectedNetwork
} from "@store/WalletProvider/WalletProvider";
import { useSelector } from "react-redux";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { ReactComponent as WebsiteIcon } from "@assets/SocialIcons/WebsiteIcon.svg";

import { RequiredQueryParams } from "../../api/RequiredQueryParams";
import { useGetAllNovasQuery } from "@api/community.api";
import { autUrls } from "@api/environment";
import { useAccount } from "wagmi";
import { novaSocialUrls } from "@api/aut.model";
import theme from "@theme/theme";

const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};

const novaSocialIcons = {
  discord: DiscordIcon,
  website: WebsiteIcon
};

const CommunityInfo = () => {
  const [searchParams] = useSearchParams();
  const network = useSelector(SelectedNetwork);
  const explorerUrl = useSelector(BlockExplorerUrl);
  const { address: account } = useAccount();
  const urls = autUrls();

  const { data } = useGetAllNovasQuery(
    {
      connectedAddress: account
    },
    {
      selectFromResult: ({ data }) => ({
        data: (data?.daos || []).find(
          (d) =>
            d.daoAddress === searchParams.get(RequiredQueryParams.DaoAddress)
        )
      })
    }
  );

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
              {data?.name}
              <Tooltip title={data?.properties.description}>
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
              src={ipfsCIDToHttpUrl(data?.image as string)}
            />
            <Stack gap={2}>
              <Stack direction="row" alignItems="center">
                <CopyAddress
                  address={searchParams.get(RequiredQueryParams.DaoAddress)}
                />
                <Tooltip title={`Explore in ${network?.name}`}>
                  <IconButton
                    sx={{ color: "white", p: 0, ml: 1 }}
                    href={`${explorerUrl}/address/${searchParams.get(
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
                {data?.properties.socials.map((social, index) => {
                  const AutIcon =
                    novaSocialIcons[Object.keys(novaSocialIcons)[index]];

                  return (
                    <Link
                      key={`social-icon-${index}`}
                      {...(!!social.link && {
                        color: "#FFF",
                        component: "a",
                        href: social.link,
                        target: "_blank"
                      })}
                      {...((!social.link ||
                        social.link === novaSocialUrls[social.type]?.prefix ||
                        social.link ===
                          novaSocialUrls[social.type]?.placeholder) && {
                        sx: {
                          svg: {
                            color: theme.palette.divider
                          }
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
          href={`${urls.myAut}${data?.admin}`}
        >
          {data?.admin === account ? "View profile" : "View operator profile"}
        </Link>
      </Box>
    </Box>
  );
};

export default CommunityInfo;
