/* eslint-disable max-len */
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/store.model";
import { CommunityData } from "@store/Community/community.reducer";
import AutShare from "@components/Share";
import { getPAUrl } from "@api/community.api";
import { Avatar, Container } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { setTitle } from "@store/ui-reducer";
import { PaUrl } from "@store/AutDashboard/aut-dashboard.reducer";
import { ipfsCIDToHttpUrl } from "@api/storage.api";

const AutCommunityShare = () => {
  const dispatch = useAppDispatch();
  const community = useSelector(CommunityData);
  const paUrl = useSelector(PaUrl);

  useEffect(() => {
    const promise = dispatch(getPAUrl(null));
    return () => promise.abort();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setTitle(`Share with your friends`));
  }, [dispatch]);

  const shareMessage = `Hey there! We've just deployed ${community?.name} on Aut - choose your Role in our Community, pick your Skills, and let's build something great together!`;

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          display: "flex"
        }}
      >
        <AutShare
          url={paUrl || "https://Aut.id/"}
          title="Title for Tweet Here"
          description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. "
          twitterProps={{
            title: shareMessage,
            hashtags: ["Aut", "DAO", "Blockchain"]
          }}
          hideCloseBtn
          rightSide={
            <Avatar
              sx={{
                height: pxToRem(165),
                width: pxToRem(165)
              }}
              variant="square"
              src={ipfsCIDToHttpUrl(community.image as string)}
            />
          }
        />
      </Container>
    </>
  );
};

export default memo(AutCommunityShare);
