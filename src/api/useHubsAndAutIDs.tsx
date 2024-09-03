import { HubOSHub } from "./hub.model";
import { HubOSAutID } from "./aut.model";
import AutSDK, { fetchMetadata, Hub, HubNFT } from "@aut-labs/sdk";
import { environment } from "./environment";
import { gql, QueryResult, useQuery } from "@apollo/client";
import { AutIDNFT } from "@aut-labs/sdk/dist/models/aut.model";
import { AutIdJoinedHubState } from "@aut-labs/d-aut";
import { useEffect, useState } from "react";

const GET_HUBS_AND_AUTIDS = gql`
  query GetHubsAndAutIDs {
    hubs(skip: 0, first: 10000) {
      address
      domain
      deployer
      minCommitment
      metadataUri
    }
    autIDs(skip: 0, first: 10000) {
      id
      metadataUri
      joinedHubs {
        id
        hubAddress
        commitment
        role
      }
    }
  }
`;

const useHubsAndAutIDs = () => {
  const { data, loading, ...rest } = useQuery(GET_HUBS_AND_AUTIDS, {
    fetchPolicy: "cache-first"
  });
  const [hubs, setHubs] = useState<HubOSHub[]>([]);
  const [autIDs, setAutIDs] = useState<HubOSAutID[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  useEffect(() => {
    if (data) {
      const fetchHubsMetadata = async () => {
        return Promise.all(
          data.hubs.map(
            async ({
              address,
              domain,
              metadataUri,
              deployer,
              minCommitment
            }) => {
              const metadata = await fetchMetadata<HubNFT>(
                metadataUri,
                environment.ipfsGatewayUrl
              );
              return new HubOSHub({
                ...metadata,
                properties: {
                  ...metadata.properties,
                  minCommitment,
                  metadataUri,
                  deployer,
                  members: [],
                  address,
                  domain
                }
              } as HubOSHub);
            }
          )
        );
      };

      const fetchAutIDsMetadata = async () => {
        return Promise.all(
          data.autIDs.map(async ({ id, metadataUri, joinedHubs }) => {
            const metadata = await fetchMetadata<AutIDNFT>(
              metadataUri,
              environment.ipfsGatewayUrl
            );
            return new HubOSAutID({
              ...metadata,
              properties: {
                ...metadata.properties,
                address: id,
                hubs: [],
                joinedHubs: joinedHubs.map(
                  (hub: AutIdJoinedHubState & { id: string }) => ({
                    id: hub.id,
                    role: hub.role,
                    commitment: hub.commitment,
                    hubAddress: hub.hubAddress.toLowerCase(),
                    isAdmin: false
                  })
                ),
                network: null
              }
            });
          })
        );
      };

      const fetchAllMetadata = async () => {
        setLoadingMetadata(true);
        const [fetchedHubs, fetchedAutIDs] = await Promise.all([
          fetchHubsMetadata(),
          fetchAutIDsMetadata()
        ]);
        const hubsWithMembers = fetchedHubs.reduce(
          (acc, hub) => ({ ...acc, [hub.properties.address]: hub }),
          {}
        );
        for (const autID of fetchedAutIDs) {
          for (const joinedHub of autID.properties.joinedHubs) {
            const hub = hubsWithMembers[joinedHub.hubAddress];
            if (hub) {
              hub.properties.members.push(autID);
              autID.properties.hubs.push(hub);
              if (
                hub.properties.deployer.toLowerCase() ===
                autID.properties.address
              ) {
                joinedHub.isAdmin = true;
              } else {
                const sdk = await AutSDK.getInstance(true);
                const isAdmin = await sdk
                  .initService<Hub>(Hub, hub.properties.address)
                  .contract.functions.isAdmin(autID.properties.address);
                joinedHub.isAdmin = isAdmin;
              }
            }
          }
        }
        setHubs(Object.values(hubsWithMembers));
        setAutIDs(fetchedAutIDs);
        setLoadingMetadata(false);
      };
      fetchAllMetadata();
    }
  }, [data]);

  return {
    data: { hubs, autIDs },
    ...rest,
    loading: loadingMetadata || loading
  } as QueryResult<{
    hubs: HubOSHub[];
    autIDs: HubOSAutID[];
  }>;
};

export default useHubsAndAutIDs;
