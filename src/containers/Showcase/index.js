import Container from "common/components/Container";
import Typography from "common/components/Typography";
import Section from "common/components/Section";
import GenesisImage from "common/assets/image/genesis.svg";
import { memo, useEffect, useRef, useState } from "react";
import AutCard from "./card";
import { ShowcaseData } from "common/data";
import { Grid } from "./showcase.style";
import styled from "styled-components";
import ConcentricImage from "common/assets/image/ConcentricImage.svg";
import Text from "common/components/Text";
import Button from "common/components/Button";

const NovaShowcase = ({ front, back }) => {
  const { novaCards, title, subtitle } = ShowcaseData;

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
        <Grid>
          {novaCards.map((card, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <AutCard front={card.front} back={card.back}></AutCard>
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
      </Container>
    </Section>
  );
};

export default memo(NovaShowcase);
