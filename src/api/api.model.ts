export enum ActivityTypes {
  Polls = 1,
  Gatherings,
  Tasks
}

export enum HubEventTypes {
  Ongoing,
  Upcoming,
  Past
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
export interface HubContractError {
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
