import { CommitmentMessages } from "@utils/misc";
import { httpUrlToIpfsCID } from "./storage.api";
import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";
import {
  NovaArchetypeParameters,
  NovaProperties,
  RoleSet
} from "@aut-labs/sdk/dist/models/nova";
import { AutSocial } from "./api.model";
import { Quest } from "@aut-labs/sdk";
import { ReactComponent as OpenSource } from "@assets/icons/opensource.svg";
import { ReactComponent as Defi } from "@assets/icons/defi.svg";
import { ReactComponent as Social } from "@assets/icons/social.svg";
import { ReactComponent as Refi } from "@assets/icons/refi.svg";
import { ReactComponent as Identity } from "@assets/icons/identity.svg";

export const MarketTemplates = [
  {
    title: "Open-Source & Infra",
    market: 1,
    icon: OpenSource
  },
  {
    title: "DeFi & Payments",
    market: 2,
    icon: Defi
  },
  {
    title: "ReFi & Governance",
    market: 3,
    icon: Refi
  },
  {
    title: "Social, Art & Gaming",
    market: 4,
    icon: Social
  },
  {
    title: "Identity & Reputation",
    market: 5,
    icon: Identity
  }
];

export const findRoleName = (roleId: string, rolesSets: RoleSet[]) => {
  const roleSet = (rolesSets || []).find((s) =>
    s.roles.some((r) => r.id.toString() === roleId)
  );
  if (roleSet) {
    const role = roleSet?.roles.find((r) => r.id.toString() === roleId);
    return role?.roleName;
  }
};

interface Role {
  id: number;
  roleName: string;
}

export interface CommunityDomains {
  note: string;
  domain: string;
}

export class CommunityProperties extends NovaProperties {
  address?: string;
  deployer: string;
  prestige?: number;
  market: string;
  members?: number;
  membersList?: any[];
  absoluteValue?: number;
  roles: Role[];
  socials: AutSocial[];

  userData?: {
    role: string;
    roleName?: string;
    commitment: string;
    isAdmin: boolean;
    commitmentDescription?: string;
    isActive?: boolean;
  };

  additionalProps?: any;

  domains: CommunityDomains[];

  domain: string;

  archetype: {
    default: number;
    parameters: NovaArchetypeParameters;
  };

  constructor(data: CommunityProperties) {
    super(data);
    if (!data) {
      this.rolesSets = [];
    } else {
      this.deployer = data.deployer;
      this.market = MarketTemplates[data.market]?.title;
      this.commitment = data.commitment;
      this.rolesSets = data.rolesSets;
      this.roles = data.roles;
      this.address = data.address;
      this.socials = data.socials;
      this.domain = data.domain;
      this.archetype = data.archetype;
      this.prestige = data.prestige;
      this.members = data.members;
      this.membersList = data.membersList;
      this.absoluteValue = data.absoluteValue;
      this.additionalProps = data.additionalProps;
      this.archetype = data.archetype;
      this.userData =
        JSON.parse(JSON.stringify(data?.userData || {})) ||
        ({} as typeof this.userData);

      if (this.userData?.role) {
        this.userData.roleName = findRoleName(
          this.userData.role,
          this.rolesSets
        );
      }

      if (this.userData?.commitment) {
        this.userData.commitmentDescription = CommitmentMessages(
          +this.userData.commitment
        );
      }
      this.userData.isAdmin = (data as any).isAdmin;
    }
  }
}

export class Community extends BaseNFTModel<CommunityProperties> {
  id: string;
  static updateCommunity(updatedCommunity: Community): Partial<Community> {
    const community = new Community(updatedCommunity);
    const market = MarketTemplates.find(
      (v) => v.title === community.properties.market
    );
    return {
      name: community.name,
      description: community.description,
      image: httpUrlToIpfsCID(community.image as string),
      properties: {
        market: market?.title || 0,
        deployer: community.properties.deployer,
        commitment: community.properties.commitment,
        archetype: community.properties.archetype,
        rolesSets: community.properties.rolesSets,
        timestamp: community.properties.timestamp,
        socials: community.properties.socials.map((social) => {
          return social;
        })
      }
    } as Partial<Community>;
  }

  constructor(data: Community = {} as Community) {
    super(data);
    this.id = data.id;
    this.properties = new CommunityProperties(data.properties);
  }
}

export class HubProperties extends NovaProperties {
  address?: string;

  socials: AutSocial[];

  quests: Quest[];

  constructor(data: HubProperties) {
    super(data);
    if (!data) {
      this.rolesSets = [];
    } else {
      this.market = MarketTemplates[data.market]?.title;
      this.commitment = data.commitment;
      this.rolesSets = data.rolesSets;
      this.timestamp = data.timestamp;
      this.socials = data.socials;
      this.quests = data.quests;
    }
  }
}
export class Hub extends BaseNFTModel<HubProperties> {
  daoAddress: string;
  admin: string;
  onboardingQuestAddress: string;
  daoMetadataUri: string;
  constructor(data: Hub = {} as Hub) {
    super(data);
    this.daoAddress = data.daoAddress;
    this.admin = data.admin;
    this.onboardingQuestAddress = data.onboardingQuestAddress;
    this.properties = new HubProperties(data.properties);
  }
}

export const DefaultRoles: Role[] = [
  {
    id: 4,
    roleName: "Core Team"
  },
  {
    id: 5,
    roleName: "Advisor"
  },
  {
    id: 6,
    roleName: "Investor"
  }
];
