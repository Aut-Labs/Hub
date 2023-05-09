/* eslint-disable max-len */
import { Avatar, styled, Typography } from "@mui/material";
import {
  Communities,
  communityUpdateState
} from "@store/Community/community.reducer";
import { pxToRem } from "@utils/text-size";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/store.model";
import { Community } from "@api/community.model";
import CopyAddress from "@components/CopyAddress";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import DialogWrapper from "./DialogWrapper";

const CommunityItem = styled("div")({
  width: "100%",
  borderStyle: "solid",
  borderWidth: "1px",
  borderTopColor: "white",
  display: "flex",
  alignItems: "center",
  padding: `0 ${pxToRem(40)}`,
  cursor: "pointer",
  margin: "0 auto",
  ":hover": {
    backgroundColor: "#6FA1C3"
  },
  "&.stat:last-child": {
    borderBottomColor: "white"
  }
});

const CommunityItemWrapper = styled("div")({
  width: "100%",
  flex: 1,
  marginTop: "20px"
});

const CommunitySwitcherPopup = ({ open, onClose }: any) => {
  const dispatch = useAppDispatch();
  const communities = useSelector(Communities);

  const selectCommunity = (community: Community) => {
    dispatch(
      communityUpdateState({
        selectedCommunityAddress: community.properties.address
      })
    );
    onClose();
  };

  return (
    <DialogWrapper open={open} onClose={onClose}>
      <div
        className="sw-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        <Typography color="white" variant="subtitle1">
          Community Swicher
        </Typography>
        <Typography color="white" mb="4" variant="body">
          Pick the Community you wish to work with.
        </Typography>
        <CommunityItemWrapper
          sx={{
            height: {
              md: "60px"
            }
          }}
        >
          {communities.map((community) => (
            <CommunityItem
              key={`community-select-item-${community.name}`}
              className="stat"
              onClick={() => selectCommunity(community)}
            >
              <Avatar
                variant="square"
                sx={{
                  width: pxToRem(50),
                  height: pxToRem(50),
                  border: "2px solid white",
                  backgroundColor: "white",
                  mr: pxToRem(50)
                }}
                src={ipfsCIDToHttpUrl(community.image as string)}
              />
              <div>
                <Typography
                  sx={{ color: "white", fontSize: pxToRem(21), mb: "3px" }}
                  component="div"
                >
                  {community.name}
                </Typography>
                <CopyAddress
                  address={community.properties.address}
                  variant="body1"
                />
              </div>
            </CommunityItem>
          ))}
        </CommunityItemWrapper>
      </div>
    </DialogWrapper>
  );
};

export default CommunitySwitcherPopup;
