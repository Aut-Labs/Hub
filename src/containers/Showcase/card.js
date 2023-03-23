import Image from "common/components/Image";
import Flipcard from "common/components/FlipCard/FlipCard";
import FlipIcon from "common/assets/image/flip.svg";
import styled from "styled-components";
import { memo, useState } from "react";
import Typography from "common/components/Typography";
import BlackHoleImage from "common/assets/image/black-hole.svg";
import Button from "common/components/Button";
import themeGet from "@styled-system/theme-get";
import { display } from "styled-system";
import Box from "common/components/Box";
import { fetchMetadata } from "@aut-labs-private/sdk";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

export function ipfsCIDToHttpUrl(url, isJson = false) {
  if (!url) {
    return url;
  }
  if (!url.includes("https://"))
    return isJson
      ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${replaceAll(
          url,
          "ipfs://",
          ""
        )}/metadata.json`
      : `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${replaceAll(
          url,
          "ipfs://",
          ""
        )}`;
  return url;
}

const getRoleName = (daoData, quest) => {
  const role = daoData.properties.rolesSets[0].roles.find(
    (r) => r.id === quest.role
  );
  if (role) {
    return role.roleName;
  }
  return "N/A";
};

const AutCardFront = styled("div")({
  width: "100%",
  height: "100%",
  border: "1px",
});

const AutCardContainer = styled("div")`
  ${themeGet("mediaQueries.sm")} {
    width: 300px;
    height: 350px;
  }
  ${themeGet("mediaQueries.md")} {
    width: 300px;
    height: 350px;
  }
  ${themeGet("mediaQueries.xl")} {
    width: 330px;
    height: 380px;
  }
  ${themeGet("mediaQueries.xxl")} {
    width: 380px;
    height: 430px;
  }
  box-shadow: 10px 10px 10px black;
  &.highlighted {
    box-shadow: 20px 20px 20px #0063a2;
  }
  background-color: #262626;
  border-color: #3f3f40;
  border-style: solid;
  border-width: 3px;
  padding: 0px 5px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const AutCardBack = styled("div")({
  height: "100%",
  width: "100%",
});

const AutCard = ({
  daoData,
  highlightData = { highlighted: false, questId: null },
  index,
}) => {
  const [isFlipped, setFlipped] = useState(false);

  const questClicked = (e, quest) => {
    e.stopPropagation();
    console.log(quest);
  };

  const flipCard = () => {
    if (isFlipped) {
      setFlipped(false);
    } else {
      setFlipped(true);
    }
  };

  return (
    <div className="inner-content">
      <Flipcard
        isFlipped={isFlipped}
        onClick={flipCard}
        containerClassName={`${isFlipped ? "flipped" : ""}`}
      >
        <AutCardFront
          className={`aut-card-front ${isFlipped ? "flipped" : ""}`}
        >
          <AutCardContainer
            className={`aut-card-container front ${
              highlightData.highlighted && "highlighted"
            }`}
          >
            <Typography
              fontWeight="bold"
              fontFamlily="FractulAltBold"
              mt={{
                _: "25px",
                xxl: "25px",
              }}
              mb="0"
              color="white"
              as="subtitle1"
            >
              {daoData.name}
            </Typography>
            <Image
              src={ipfsCIDToHttpUrl(daoData?.image)}
              alt="Dao image"
              style={{
                marginTop: "15px",
                width: "100px",
                height: "100px",
              }}
            />
            <Typography
              fontWeight="normal"
              textAlign="center"
              fontFamlily="FractulRegular"
              mt="24px"
              mb="0"
              color="white"
              as="subtitle2"
            >
              {daoData.description}
            </Typography>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Image
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px",
                }}
                src={FlipIcon.src}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardFront>
        <AutCardBack className="aut-card-back">
          <AutCardContainer
            className={`aut-card-container back ${
              highlightData.highlighted && "highlighted"
            }`}
          >
            <Typography
              fontWeight="bold"
              fontFamlily="FractulAltBold"
              mt={{
                _: "25px",
                xxl: "25px",
              }}
              mb="0"
              color="white"
              as="subtitle1"
            >
              Pick your Role
            </Typography>
            <Typography
              fontWeight="normal"
              textAlign="center"
              fontFamlily="FractulRegular"
              mt={{
                _: "5px",
                xxl: "5px",
              }}
              mb="0"
              color="white"
              as="subtitle2"
            >
              {daoData.name}
            </Typography>
            <Box
              marginTop={{ _: "20px", md: "10px", lg: "13px", xl: "20px" }}
              width="100%"
            >
              {daoData.properties.quests.map((quest, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      marginTop: "22px",
                      padding: "0px 17px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      fontWeight="normal"
                      textAlign="center"
                      fontFamlily="FractulRegular"
                      mt={{
                        _: "5px",
                        xxl: "5px",
                      }}
                      mb="0"
                      color="white"
                      as="body"
                    >
                      {getRoleName(daoData, quest)}
                    </Typography>
                    <Button
                      style={{
                        padding: "0px",
                        fontSize: "12px",
                        height: "38px",
                        width: "94px",
                        borderWidth: "2px",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                      disabled={() => {
                        if (highlightData.highlighted) {
                          return highlightData.questId !== quest.questId;
                        }
                        return false;
                      }}
                      title="View Quest"
                      variant="outlined"
                      fontWeight="normal"
                      size="normal"
                      colors="primary"
                      onClick={(e) => questClicked(e, quest)}
                    />
                  </div>
                );
              })}
            </Box>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Image
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px",
                }}
                src={FlipIcon.src}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardBack>
      </Flipcard>
    </div>
  );
};

export default memo(AutCard);
