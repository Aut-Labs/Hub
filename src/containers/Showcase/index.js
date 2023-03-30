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
import AutLoading from "common/components/AutLoading";
import styled from "styled-components";
import { useRouter } from "next/router";
import { getCache } from "api/cache.api";

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  height: "300px",
  transform: `translate(0%, 20%)`,
});

export function ipfsCIDToHttpUrl(url) {
  if (!url) {
    return url;
  }
  if (!url.includes("https://")) {
    return `${process.env.NEXT_PUBLIC_IPFS_URL}/${replaceAll(
      url,
      "ipfs://",
      ""
    )}`;
  }
  return url;
}

const NovaShowcase = ({ connectedState }) => {
  const router = useRouter();

  const [daoList, setDaoList] = useState(null);
  const [highlightedDaoCache, setHighlightedDaoCache] = useState(null);

  useEffect(() => {
    const fetchCache = async () => {
      const cache = await getCache("UserPhases");
      if (cache) {
        setHighlightedDaoCache({
          daoAddress: cache.daoAddress,
          questId: cache.questId,
        });
      }
    };
    if (connectedState) fetchCache();
  }, [connectedState]);

  useEffect(() => {
    console.log("queryDao", router.query.dao);
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/autID/user/daos`
      );

      const daos = response.data;

      const daoData = [];

      for (let i = 0; i < daos.length; i++) {
        const dao = daos[i];
        // prettier-ignore
        const metadata =
          await fetchMetadata(dao.daoMetadataUri, process.env.NEXT_PUBLIC_IPFS_URL);
        const daoModel = metadata;
        daoModel.daoAddress = dao.daoAddress;
        daoModel.onboardingQuestAddress = dao.onboardingQuestAddress;
        daoModel.properties.quests = [];

        for (let j = 0; j < dao.quests.length; j++) {
          const quest = dao.quests[j];
          const questMetadata = await fetchMetadata(
            quest.metadataUri,
            process.env.NEXT_PUBLIC_IPFS_URL
          );
          quest.metadata = questMetadata;
          daoModel.properties.quests.push(quest);
        }
        daoData.push(daoModel);
      }
      setDaoList(daoData);
      console.log(daoData);
    };
    fetchData();
  }, []);

  const checkIsHighlighted = (daoAddress) => {
    if (highlightedDaoCache?.daoAddress) {
      return {
        highlighted: highlightedDaoCache?.daoAddress === daoAddress,
        questId: highlightedDaoCache.questId,
      };
    }
    return {
      highlighted: router.query.dao === daoAddress,
      questId: null,
    };
  };

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
        {daoList ? (
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
                  <AutCard
                    daoData={dao}
                    highlightData={checkIsHighlighted(dao.daoAddress)}
                  ></AutCard>
                  {/* <Button
                    style={{
                      marginTop: "24px",
                      marginBottom: "24px",
                      padding: "0px",
                      fontSize: "18px",
                      height: "60px",
                      borderWidth: "2px",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                    width={{
                      _: "300px",
                      sm: "300px",
                      md: "300px",
                      xl: "330px",
                      xxl: "380px",
                    }}
                    title="View"
                    variant="roundOutlined"
                    fontWeight="normal"
                    size="normal"
                    colors="primary"
                    onClick={() => viewDao(dao.daoAddress)}
                  /> */}
                </div>
              );
            })}
          </Grid>
        ) : (
          <LoadingContainer>
            <AutLoading />
          </LoadingContainer>
        )}
      </Container>
    </Section>
  );
};

export default memo(NovaShowcase);
