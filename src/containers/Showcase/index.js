import Container from "common/components/Container";
import Typography from "common/components/Typography";
import Section from "common/components/Section";
import GenesisImage from "common/assets/image/genesis.svg";
import { memo, useEffect, useRef, useState } from "react";
import Button from "common/components/Button";

const NovaShowcase = () => {
  return (
    <Section
      style={{
        position: "unset",
      }}
    >
      <Container
        noGutter
        maxWidth={{
          lg: "1180px",
          xl: "1300px",
          xxl: "1900px",
        }}
      ></Container>
    </Section>
  );
};

export default memo(NovaShowcase);
