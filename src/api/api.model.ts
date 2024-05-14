import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";
import { CommunityMembershipDetails } from "@aut-labs/sdk/dist/models/holder";
import { Community } from "./community.model";
import { httpUrlToIpfsCID } from "./storage.api";

export const socialUrls = {
  discord: {
    hidePrefix: true,
    placeholder: "name#1234",
    prefix: "https://discord.com/users/"
  },
  github: {
    prefix: "https://github.com/",
    placeholder: ""
  },
  twitter: {
    prefix: "https://twitter.com/",
    placeholder: ""
  },
  telegram: {
    prefix: "https://t.me/",
    placeholder: ""
  },
  lensfrens: {
    prefix: "https://www.lensfrens.xyz/",
    placeholder: ""
  }
};

/* eslint-disable no-shadow */
export enum ActivityTypes {
  Polls = 1,
  Gatherings,
  Tasks
}

export enum CommunityEventTypes {
  Ongoing,
  Upcoming,
  Past
}

export interface HolderData {
  daos: CommunityMembershipDetails[];
  address: string;
  tokenId: string;
  metadataUri: string;
}

export interface AutSocial {
  type: string;
  link: string;
}

export interface ActivityTask {
  name: string;
  description: string;
  image: File;
  properties: {
    creator: string;
    creatorAutId: string;
    role: string;
    roleId: number;
    participants: number;
    allParticipants: boolean;
    description: string;
    title: string;
    isCoreTeamMembersOnly: boolean;
  };
}

export interface ActivityPoll {
  timestamp: number;
  pollData: ActivityPollData;
  results: string;
  isFinalized: boolean;
  role: number;
  dueDate: number;
}

export interface ActivityPollData {
  title: string;
  description: string;
  duration: string;
  options: {
    option: string;
    emoji: string;
  }[];
  role: string;
  roleName?: string;
  allRoles: boolean;
}
export interface CommunityContractError {
  code: number;
  message: string;
  data: {
    code: number;
    data: any;
    message: string;
  };
}

export interface AutTask {
  tokenId: string;
  nickname: string;
  imageUrl: string;
  timestamp: string;
}
export interface Role {
  roleName: string;
  id: number;
}
export interface RoleSet {
  roleSetName: string;
  roles: Role[];
}
