import { CommitmentMessages } from "@utils/misc";
import { httpUrlToIpfsCID } from "./storage.api";
import { BaseNFTModel } from "@aut-labs-private/sdk/dist/models/baseNFTModel";
import {
  DAOProperties,
  Role,
  RoleSet
} from "@aut-labs-private/sdk/dist/models/dao";
import { AutSocial } from "./api.model";
import { socialUrls } from "./aut.model";

export const MarketTemplates = [
  {
    title: "Open-Source & DeFi",
    market: 1
  },
  {
    title: "Art, Events & NFTs",
    market: 2
  },
  {
    title: "Local Projects & DAOs",
    market: 3
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

export class CommunityProperties extends DAOProperties {
  address?: string;

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

  constructor(data: CommunityProperties) {
    super(data);
    if (!data) {
      this.rolesSets = [];
    } else {
      this.market = MarketTemplates[data.market]?.title;
      this.commitment = data.commitment;
      this.rolesSets = data.rolesSets;
      this.address = data.address;
      this.socials = data.socials;
      this.additionalProps = data.additionalProps;
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
      // @TODO - Tao to fix
      this.userData.isAdmin = (data as any).isAdmin;
    }
  }
}

export class Community extends BaseNFTModel<CommunityProperties> {
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
        commitment: community.properties.commitment,
        rolesSets: community.properties.rolesSets,
        socials: community.properties.socials.map((social) => {
          social.link = `${socialUrls[social.type].prefix}${social.link}`;
          return social;
        })
      }
    } as Partial<Community>;
  }

  constructor(data: Community = {} as Community) {
    super(data);
    this.properties = new CommunityProperties(data.properties);
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
