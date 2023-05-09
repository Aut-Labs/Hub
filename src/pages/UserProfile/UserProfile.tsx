import { fetchMember } from "@api/community.api";
import AutLoading from "@components/AutLoading";
import SwGrid from "@components/SwGrid";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftProfile from "./Left";
import RightProfile from "./Right";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const params = useParams<{ memberAddress: string }>();
  const member = {};

  // useEffect(() => {
  //   const promises = [];
  //   if (!member && params.memberAddress) {
  //     promises.push(dispatch(fetchMember(params.memberAddress)));
  //   }
  //   return () => promises.forEach((p) => p.abort());
  // }, [dispatch, member, params]);

  return (
    <>
      {/* {status === ResultState.Loading ? (
        <div className="sw-loading-spinner">
          <AutLoading />
        </div>
      ) : (
        <SwGrid
          left={
            <>
              <div
                className="sw-user-info"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <LeftProfile member={member} />
              </div>
            </>
          }
          right={
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <RightProfile member={member} />
            </div>
          }
        />
      )} */}
    </>
  );
};

export default UserProfile;
