/* eslint-disable max-len */
import Card from "@mui/material/Card";
import {
  CardActionArea,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
  useTheme
} from "@mui/material";
import { memo, useEffect } from "react";
import { ReactComponent as SwAuthIcon } from "@assets/sw-auth.svg";
import { ReactComponent as DiscordBotIcon } from "@assets/discord-bot.svg";
import { ReactComponent as ContractIcon } from "@assets/contract.svg";
import { pxToRem } from "@utils/text-size";
import { useAppDispatch } from "@store/store.model";
import { setTitle } from "@store/ui-reducer";
import { Link } from "react-router-dom";

const IntegrationCards = [
  {
    icon: SwAuthIcon,
    title: "dAut",
    description: `This is where your DAO lives.  Add the URL where you’ll be integrating our Decentralized Authentication System using  your Community Address.`,
    route: "/aut-dashboard/integrations-and-contracts/dao-integration",
    routeDesc: "Set your DAO URL"
  },
  {
    icon: DiscordBotIcon,
    title: "Discord Bot",
    description: `Track the Roles and IDs of  your Members, create tasks, and turn your community into a healthy, motivated  collaboration engine!`,
    route: "/aut-dashboard/integrations-and-contracts/discord-integration",
    routeDesc: "Integrate on Discord"
  },
  {
    icon: ContractIcon,
    title: "Your Contracts",
    description: `These are the Smart Contracts you’ll be tracking interactions
    with. Make sure you own them, as you will have to sign a
    transaction.`,
    route: "/aut-dashboard/integrations-and-contracts/contracts",
    routeDesc: "Track & Add Contracts",
    disabled: true
  }
];

const Integrations = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(
      setTitle(`Intergrations & Contracts - The Operating System for your DAO`)
    );
  }, [dispatch]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flex: 1
      }}
      maxWidth="lg"
      className="sw-integration-dashboard"
    >
      <Grid
        container
        flex="1"
        justifyContent="space-around"
        alignItems="center"
        spacing={5}
      >
        {IntegrationCards.map(
          ({ title, description, disabled, route, routeDesc }, n) => (
            <Grid item key={n}>
              <Card
                sx={{
                  height: pxToRem(480),
                  width: pxToRem(385),
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#000",
                  transition: `${theme.transitions.create(["background"])}`,
                  borderImage:
                    "linear-gradient(45deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1",
                  borderWidth: "5px",
                  ...(!disabled && {
                    "&:hover": {
                      background:
                        "linear-gradient(25deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%"
                    }
                  }),
                  ...(disabled && {
                    filter: "blur(8px)"
                  })
                }}
              >
                <CardActionArea
                  disabled={disabled}
                  sx={{
                    height: "100%"
                  }}
                  {...(!disabled && {
                    component: Link,
                    to: route
                  })}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      height: "100%",
                      p: 0,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:last-child": {
                        pb: 0
                      }
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        textAlign: "center",
                        paddingLeft: pxToRem(35),
                        paddingRight: pxToRem(35)
                      }}
                    >
                      <Typography
                        color="white"
                        fontSize={pxToRem(32)}
                        component="div"
                        marginBottom={pxToRem(45)}
                      >
                        {title}
                      </Typography>
                      <Typography
                        color="white"
                        fontSize={pxToRem(18)}
                        component="div"
                      >
                        {description}
                      </Typography>
                    </div>

                    <Divider
                      sx={{
                        borderColor: "primary.main"
                      }}
                    />
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: pxToRem(65)
                      }}
                      color="white"
                      textTransform="uppercase"
                      fontSize={pxToRem(21)}
                    >
                      {routeDesc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
};

export default memo(Integrations);
