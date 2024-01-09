import axios from "axios";
import { CommitmentMessages } from "@utils/misc";
import { Community, NovaDAO, findRoleName } from "./community.model";
import { Web3ThunkProviderFactory } from "./ProviderFactory/web3-thunk.provider";
import { ipfsCIDToHttpUrl, isValidUrl } from "./storage.api";
import { AutID, DAOMember } from "./aut.model";
import AutSDK, { Nova, fetchMetadata } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { base64toFile } from "@utils/to-base-64";
import { environment } from "./environment";
import { createAsyncThunk } from "@reduxjs/toolkit";

const communityExtensionThunkProvider = Web3ThunkProviderFactory(
  "CommunityExtension",
  {
    provider: null
  }
);

export const fetchCommunity = communityExtensionThunkProvider(
  {
    type: "community/get"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, _) => {
    const [, , uri] = await contract.getComData();
    const metadata: Community = (await axios.get(ipfsCIDToHttpUrl(uri))).data;
    const community = new Community(metadata);
    return community;
  }
);

// export const fetchCommunity = createAsyncThunk(
//   "community/get",
//   async (_, { rejectWithValue, getState }) => {
//     const sdk = AutSDK.getInstance();
//     const state = getState() as any;
//     const { selectedCommunityAddress } = state.community;
//     const response = await sdk..getComData(
//       requestBody.daoAddr,
//       requestBody.daoType
//     );
//     if (response?.isSuccess) {
//       return response.data;
//     }
//     return rejectWithValue(response?.errorMessage);
//   }
// );

export const getWhitelistedAddresses = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/addresses/get"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, _, { getState }) => {
    const { auth } = getState();
    const memberAddresses = await contract.getAllMembers();
    // const names = await getCoreTeamMemberNames(auth.userInfo.community);
    // return memberAddresses.map((a) => ({
    //   address: a,
    //   name:
    //     names.coreTeamMembers.find((c) => c.memberAddress === a)?.memberName ||
    //     "N/A",
    // }));
  }
);

export const addNewWhitelistedAddresses = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/addresses/add"
    // event: AutIDCommunityContractEventType.CoreTeamMemberAdded,
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, newMembers, { dispatch, getState }) => {
    const { auth } = getState();
    // for (const newMember of newMembers) {
    //   await contract.addNewCoreTeamMembers(newMember.address);
    //   await addCoreTeamName(
    //     auth?.userInfo?.community,
    //     newMember.address,
    //     newMember.name
    //   );
    // }
    return dispatch(getWhitelistedAddresses(auth.userInfo.community));
  }
);

export const whitelistAddress = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/addresses/add"
    // event: CommunityExtensionContractEventType.MemberAdded,
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, newMembers, { dispatch, getState }) => {
    const { auth } = getState();
    // await contract.addNewCoreTeamMembers(newMember.address);
    return dispatch(getWhitelistedAddresses(auth.userInfo.community));
  }
);

export const setAsCoreTeam = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/core-team/add"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, memberAddress) => {
    const result = await contract.addToCoreTeam(memberAddress);
    return memberAddress;
  }
);

export const removeAsCoreTeam = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/core-team/remove"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, memberAddress) => {
    const result = await contract.removeFromCoreTeam(memberAddress);
    return memberAddress;
  }
);

interface UpdateDiscordData {
  community: Community;
  inviteLink: string;
}

export const updateDiscordSocials = createAsyncThunk(
  "community/update",
  async (args: UpdateDiscordData, { rejectWithValue }) => {
    const sdk = AutSDK.getInstance();
    const updatedCommunity = Community.updateCommunity(args.community);
    const uri = await sdk.client.storeAsBlob(updatedCommunity);

    console.log("New metadata: ->", ipfsCIDToHttpUrl(uri));
    const response = await sdk.autID.contract.setMetadataUri(uri);

    if (response.isSuccess) {
      const autIdData = JSON.parse(window.sessionStorage.getItem("aut-data"));
      let foundSocial = false;
      for (let i = 0; i < autIdData.properties.communities.length; i++) {
        if (foundSocial) {
          break;
        }
        const community = autIdData.properties.communities[i];
        if (community.name === args.community.name)
          for (let i = 0; i < community.properties.socials.length; i++) {
            const social = community.properties.socials[i];
            if (social.type === "discord") {
              social.link = args.inviteLink;
              foundSocial = true;
              break;
            }
          }
      }
      window.sessionStorage.setItem("aut-data", JSON.stringify(autIdData));
      return args.community;
    }
    return rejectWithValue(response?.errorMessage);
  }
);

export const updateCommunity = communityExtensionThunkProvider(
  {
    type: "community/update"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, community) => {
    if (community.image && !isValidUrl(community.image as string)) {
      const file = base64toFile(community.image as string, "image");
      // community.image = await storeImageAsBlob(file as File);
    }

    // const uri = await storeAsBlob(Community.updateCommunity(community));
    // await contract.setMetadataUri(uri);
    return community;
  }
);

export const fetchMember = communityExtensionThunkProvider(
  {
    type: "community/member/get"
  },
  async (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, memberAddress, thunkAPI) => {
    const state = thunkAPI.getState();
    const AutIDsResponse: { [role: string]: AutID[] } = {};
    const communities = state.community.communities as Community[];
    const communityAddress = state.community.selectedCommunityAddress as string;
    const community = communities.find(
      (c) => c.properties.address === communityAddress
    );

    const filteredRoles = community.properties.rolesSets[0].roles;

    for (let i = 0; i < filteredRoles.length; i += 1) {
      AutIDsResponse[filteredRoles[i].roleName] = [];
    }

    AutIDsResponse.Admins = [];

    // const autContract = await Web3AutIDProvider(environment.autIDAddress);
    // const tokenId = await autContract.getAutIDByOwner(memberAddress);
    // const metadataCID = await autContract.tokenURI(Number(tokenId.toString()));
    // const [, role, commitment] = await autContract.getCommunityData(
    //   memberAddress,
    //   community.properties.address
    // );
    // const jsonUri = ipfsCIDToHttpUrl(metadataCID);
    // const jsonMetadata: AutID = (await axios.get(jsonUri)).data;
    // const roleName = findRoleName(
    //   role.toString(),
    //   community.properties.rolesSets
    // );

    const isCoreTeam = await contract.isCoreTeam(memberAddress);
    // const member = new AutID({
    //   ...jsonMetadata,
    //   properties: {
    //     ...jsonMetadata.properties,
    //     address: memberAddress,
    //     role: role.toString(),
    //     roleName,
    //     tokenId: tokenId.toString(),
    //     commitmentDescription: CommitmentMessages(commitment),
    //     commitment: commitment.toString(),
    //     isCoreTeam
    //   } as any
    // });
    // if (isCoreTeam) {
    //   AutIDsResponse.Admins.push(member);
    // }
    // AutIDsResponse[roleName].push(member);
    return AutIDsResponse;
  }
);

export const getPAUrl = communityExtensionThunkProvider(
  {
    type: "community/url/get"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract) => {
    const urls = await contract.getURLs();
    return urls?.length > 0 ? urls[urls.length - 1] : undefined;
  }
);

export const getPAContracts = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/contracts/get"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract) => {
    // const contracts = await contract.getImportedAddresses();
    // return contracts;
  }
);

export const addPAContracts = communityExtensionThunkProvider(
  {
    type: "aut-dashboard/contracts/add"
    // event: CommunityExtensionContractEventType.ActivitiesAddressAdded,
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, payload, { dispatch }) => {
    const { newItems } = payload;
    for (const item of newItems) {
      // await contract.addNewContractAddressToAgreement(item.address);
    }
    return dispatch(getPAContracts(null));
  }
);

export const addDiscordToCommunity = communityExtensionThunkProvider(
  {
    type: "community/integrate/discord"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, discordId) => {
    const result = await contract.setDiscordServer(discordId);
    return result;
  }
);

export const addPAUrl = communityExtensionThunkProvider(
  {
    type: "community/url/add"
  },
  (thunkAPI) => {
    const state = thunkAPI.getState();
    const { selectedCommunityAddress } = state.community;
    return Promise.resolve(selectedCommunityAddress);
  },
  async (contract, daoUrl, { dispatch }) => {
    await contract.addURL(daoUrl);
    return dispatch(getPAUrl(null));
  }
);

const getMembers = async (body, api: BaseQueryApi) => {
  const state: any = api.getState();
  const { selectedCommunityAddress, communities } = state.community;
  const community: Community = communities.find(
    (c) => c.properties.address === selectedCommunityAddress
  );

  const sdk = AutSDK.getInstance();

  sdk.nova = sdk.initService<Nova>(Nova, selectedCommunityAddress);

  const members: DAOMember[] = [];
  const membersResponse = await sdk.nova.contract.members.getAllMembers();

  for (let i = 0; i < membersResponse.data.length; i += 1) {
    try {
      const memberAddress = membersResponse.data[i];
      const autIdResponse = await sdk.autID.findAutID(memberAddress);
      const { tokenId, metadataUri } = autIdResponse.data;
      const metadata = await fetchMetadata<DAOMember>(
        metadataUri,
        environment.nftStorageUrl
      );
      const comDataResponse = await sdk.autID.contract.getCommunityMemberData(
        memberAddress,
        selectedCommunityAddress
      );
      const { role, commitment } = comDataResponse.data;
      const roleName = findRoleName(role, community.properties.rolesSets);
      const isAdminResponse = await sdk.nova.contract.admins.isAdmin(
        memberAddress
      );
      const member = new DAOMember({
        ...metadata,
        properties: {
          ...metadata.properties,
          address: memberAddress,
          role: {
            id: Number(role),
            roleName
          },
          tokenId: tokenId,
          commitmentDescription: CommitmentMessages(Number(commitment)),
          commitment: commitment,
          isAdmin: isAdminResponse.data
        }
      });
      members.push(member);
    } catch (error) {
      // handle error
    }
  }
  return {
    data: members
  };
};

const getCommunity = async (daoAddress: string, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  sdk.nova = sdk.initService<Nova>(Nova, daoAddress);

  const response = await sdk.nova.contract.metadata.getMetadataUri();

  if (!response.isSuccess) {
    return {
      error: response.errorMessage
    };
  }

  const metadata = await fetchMetadata<Community>(
    response.data,
    environment.nftStorageUrl
  );

  const adminResponse = await sdk.nova.contract.admins.getAdmins();
  return {
    data: {
      community: new Community(metadata),
      admin: adminResponse.data[0]
    }
  };
};

const getAllNovas = async (body: any, api: BaseQueryApi) => {
  // const response = await axios.get(`${environment.apiUrl}/autID/user/daos`);

  // const daos: any[] = response.data;

  // const daoData: NovaDAO[] = [];

  // for (let i = 0; i < daos.length; i++) {
  //   const {
  //     daoAddress,
  //     admin,
  //     onboardingQuestAddress,
  //     daoMetadataUri,
  //     quests
  //   } = daos[i];

  //   const metadata = await fetchMetadata<NovaDAO>(
  //     daoMetadataUri,
  //     environment.nftStorageUrl
  //   );

  //   metadata.properties.quests = [];
  //   for (let j = 0; j < quests.length; j++) {
  //     const quest = quests[j];
  //     const questMetadata = await fetchMetadata(
  //       quest.metadataUri,
  //       environment.nftStorageUrl
  //     );
  //     quest.metadata = questMetadata;
  //     metadata.properties.quests.push(quest);
  //   }

  //   const novaDAO = new NovaDAO({
  //     ...metadata,
  //     daoAddress,
  //     admin,
  //     onboardingQuestAddress
  //   });
  //   daoData.push(novaDAO);
  // }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const mockDaos = [
    {
      address: "0x123",
      name: "DAO1",
      onboardingQuestAddress: "0x456",
      properties: {
        market: 1,
        archetype: 1,
        absoluteValue: "18",
        prestige: 66,
        members: 14,
        description: "Description for DAO1",
        image:
          "ipfs://bafkreihrhccb2qvrnb2zcgyjnl4z6asv7qtgzshzuj6hk7tpm4lywxb7fi",
        roles: [
          { name: "Role1", id: "1" },
          { name: "Role2", id: "2" }
        ],
        socials: [
          { type: "discord", link: "", metadata: {} },
          { type: "ens", link: "", metadata: {} },
          { type: "twitter", link: "", metadata: {} },
          { type: "github", link: "", metadata: {} }
        ]
      }
    },
    {
      address: "0x789",
      name: "DAO2",
      onboardingQuestAddress: "0xabc",
      properties: {
        market: 2,
        archetype: 2,
        absoluteValue: "44",
        prestige: 76,
        members: 45,
        description: "Description for DAO2",
        image:
          "https://ipfs.nftstorage.link/ipfs/bafkreiddqyd46fvb5ffpbi3lgv7lea2s3mtpyjoh2ti4mj7r56nu4zydwe",
        roles: [
          { name: "Role3", id: "3" },
          { name: "Role4", id: "4" }
        ],
        socials: [
          { type: "discord", link: "", metadata: {} },
          { type: "ens", link: "", metadata: {} },
          { type: "twitter", link: "", metadata: {} },
          { type: "github", link: "", metadata: {} }
        ]
      }
    }
    // Add more DAOs as needed
  ];

  return {
    data: { daos: mockDaos }
  };
};

const getNovaTasks = async (body: any, api: BaseQueryApi) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const tasks = [
    {
      name: "Write a Blog Post",
      description:
        "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-01-05"),
      role: "Role 1"
    },
    {
      name: "Code Review Session",
      description:
        "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
      startDate: new Date("2022-02-01"),
      endDate: new Date("2022-02-10"),
      role: "Role 1"
    },
    {
      name: "Task 3",
      description: "Description for task 3",
      startDate: new Date("2022-03-01"),
      endDate: new Date("2022-03-10"),
      role: "Role 1"
    },
    {
      name: "Write a Blog Post",
      description:
        "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-01-05"),
      role: "Role 2"
    },
    {
      name: "Code Review Session",
      description:
        "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
      startDate: new Date("2022-02-01"),
      endDate: new Date("2022-02-10"),
      role: "Role 2"
    },
    {
      name: "Task 3",
      description: "Description for task 3",
      startDate: new Date("2022-03-01"),
      endDate: new Date("2022-03-10"),
      role: "Role 2"
    },
    {
      name: "Task 4",
      description: "Description for task 4",
      startDate: new Date("2022-04-01"),
      endDate: new Date("2022-04-10"),
      role: "Role 2"
    },
    {
      name: "Write a Blog Post",
      description:
        "Contribute to our blog by sharing your insights on the latest crypto trends and developments.",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-01-05"),
      role: "Role 3"
    },
    {
      name: "Code Review Session",
      description:
        "Help review and optimize a fellow developer's smart contract. Your expertise is valuable to the community.",
      startDate: new Date("2022-02-01"),
      endDate: new Date("2022-02-10"),
      role: "Role 3"
    },
    {
      name: "Task 3",
      description: "Description for task 3",
      startDate: new Date("2022-03-01"),
      endDate: new Date("2022-03-10"),
      role: "Role 2"
    }
  ];

  return {
    data: { tasks }
  };
};

interface DaoModel {
  daoAddress: string;
  onboardingQuestAddress: string;
  properties: any;
}

const KEEP_DATA_UNUSED = 10 * 60;

export const communityApi = createApi({
  reducerPath: "communityApi",
  keepUnusedDataFor: KEEP_DATA_UNUSED,
  baseQuery: async (args, api, extraOptions) => {
    const { url, body } = args;
    if (url === "getAllMembers") {
      return getMembers(body, api);
    }

    if (url === "getCommunity") {
      return getCommunity(body, api);
    }

    if (url === "getAllNovas") {
      return getAllNovas(body, api);
    }

    if (url === "getNovaTasks") {
      return getNovaTasks(body, api);
    }
    return {
      data: "Test"
    };
  },
  endpoints: (builder) => ({
    getAllMembers: builder.query<DAOMember[], void>({
      query: (body) => {
        return {
          body,
          url: "getAllMembers"
        };
      }
    }),
    getCommunity: builder.query<
      {
        community: Community;
        admin: string;
      },
      string
    >({
      query: (body) => {
        return {
          body,
          url: "getCommunity"
        };
      }
    }),
    getAllNovas: builder.query<
      // {
      //   daos: NovaDAO[];
      // },
      {
        daos: any[];
      },
      void
    >({
      query: (body) => {
        return {
          body,
          url: "getAllNovas"
        };
      }
    }),
    getNovaTasks: builder.query<
      {
        tasks: any[];
      },
      string
    >({
      query: (body) => {
        return {
          body,
          url: "getNovaTasks"
        };
      }
    })
  })
});

export const {
  useGetAllMembersQuery,
  useGetCommunityQuery,
  useGetAllNovasQuery,
  useGetNovaTasksQuery
} = communityApi;
