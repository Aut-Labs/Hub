import Container from "common/components/Container";
import Typography from "common/components/Typography";
import Section from "common/components/Section";
import { memo, useEffect, useState } from "react";
import AutCard from "./card";
import { ShowcaseData } from "common/data";
import { Grid } from "./showcase.style";
import ConcentricImage from "common/assets/image/ConcentricImage.svg";
import Button from "common/components/Button";
import { fetchMetadata } from "@aut-labs-private/sdk";
import axios from "axios";

const NovaShowcase = () => {
  const { novaCards, title, subtitle } = ShowcaseData;

  const [daoList, setDaoList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:4005/api/autID/user/daos`
      );

      const daos = response.data;

      const daoData = [];

      for (let i = 0; i < daos.length; i++) {
        const dao = daos[i];
        // prettier-ignore
        const metadata =
          await fetchMetadata(dao.daoMetadataUri, "https://cloudflare-ipfs.com/ipfs");
        const daoModel = metadata;

        daoModel.properties.quests = [];

        for (let j = 0; j < dao.quests.length; j++) {
          const quest = dao.quests[j];
          const questMetadata = await fetchMetadata(
            quest.metadataUri,
            "https://cloudflare-ipfs.com/ipfs"
          );
          quest.metadata = questMetadata;
          daoModel.properties.quests.push(quest);
        }
        daoData.push(daoModel);
      }
      debugger;
      setDaoList(daoData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(ConcentricImage);
  }, []);

  return (
    <Section className="main-section">
      <Container
        noGutter
        maxWidth={{
          lg: "1180px",
          xl: "1300px",
          xxl: "1900px",
        }}
      >
        <div className="top-part">
          <Typography
            textAlign="center"
            mb="10px"
            zIndex="1"
            mt={{
              _: "140px",
            }}
            as="h1"
          >
            {title}
          </Typography>
          <Typography
            textAlign="center"
            zIndex="1"
            mt="0"
            px={{
              _: "12px",
              sm: "0",
            }}
            mb={{
              _: "60px",
            }}
            as="subtitle1"
          >
            {subtitle}
          </Typography>
        </div>
        {daoList && (
          <Grid>
            {daoList.map((dao, i) => {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <AutCard daoData={dao}></AutCard>
                  <Button
                    style={{
                      marginTop: "56px",
                      padding: "0px",
                      fontSize: "18px",
                      height: "60px",
                      borderWidth: "2px",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                    width={{
                      _: "270px",
                      sm: "270px",
                      md: "270px",
                      xl: "300px",
                      xxl: "350px",
                    }}
                    title="CLAIM in 5d 2h 30m"
                    variant="roundOutlined"
                    fontWeight="normal"
                    size="normal"
                    colors="primary"
                  />
                </div>
              );
            })}
          </Grid>
        )}
      </Container>
    </Section>
  );
};

export default memo(NovaShowcase);
