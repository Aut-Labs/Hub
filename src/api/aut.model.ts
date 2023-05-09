import { AutSocial, HolderData } from "./api.model";
import { Community } from "./community.model";
import { BaseNFTModel } from "@aut-labs-private/sdk/dist/models/baseNFTModel";
import { httpUrlToIpfsCID } from "./storage.api";
import { Role } from "@aut-labs-private/sdk/dist/models/dao";
import { CommitmentMessages } from "@utils/misc";

export const socialUrls = {
  discord: {
    hidePrefix: true,
    placeholder: "inviteLInk",
    prefix: ""
  },
  github: {
    prefix: "https://github.com/",
    placeholder: ""
  },
  telegram: {
    prefix: "https://t.me/",
    placeholder: ""
  },
  twitter: {
    prefix: "https://twitter.com/",
    placeholder: ""
  },
  lensfrens: {
    prefix: "https://www.lensfrens.xyz/",
    placeholder: ""
  }
};

export const DefaultSocials: AutSocial[] = [
  {
    type: "discord",
    link: ""
  },
  {
    type: "github",
    link: ""
  },
  {
    type: "twitter",
    link: ""
  },
  {
    type: "telegram",
    link: ""
  },
  {
    type: "lensfrens",
    link: ""
  }
];

export class AutIDProperties {
  avatar: string;

  communities: Community[];

  timestamp: string;

  address: string;

  tokenId: string;

  socials: AutSocial[];

  ethDomain?: string;

  network?: string;

  holderData?: HolderData;

  isAdmin?: boolean;

  constructor(data: AutIDProperties) {
    if (!data) {
      this.communities = [];
      this.socials = [];
    } else {
      this.timestamp = data.timestamp;
      this.avatar = data.avatar;
      this.address = data.address;
      this.tokenId = data.tokenId;
      this.communities = (data.communities || []).map(
        (community) => new Community(community)
      );
      this.ethDomain = data.ethDomain;
      this.socials = data.socials || DefaultSocials;
      this.socials = this.socials.filter((s) => s.type !== "eth");
      this.network = data.network;
      this.holderData = data.holderData;
      this.isAdmin = data.isAdmin;
    }
  }
}

export class AutID extends BaseNFTModel<AutIDProperties> {
  static updateAutID(updatedUser: AutID): Partial<AutID> {
    const autID = new AutID(updatedUser);
    return {
      name: autID.name,
      description: autID.description,
      image: httpUrlToIpfsCID(autID.image as string),
      properties: {
        avatar: httpUrlToIpfsCID(autID.properties.avatar as string),
        timestamp: autID.properties.timestamp,
        socials: autID.properties.socials.map((social) => {
          social.link = `${socialUrls[social.type].prefix}${social.link}`;
          return social;
        })
      }
    } as Partial<AutID>;
  }

  constructor(data: AutID = {} as AutID) {
    super(data);
    this.properties = new AutIDProperties(data.properties);
  }
}

export interface DAOMemberProperties extends AutIDProperties {
  role: Role;
  commitmentDescription: string;
  commitment: string;
}

export class DAOMember extends BaseNFTModel<Partial<DAOMemberProperties>> {
  constructor(data: DAOMember = {} as DAOMember) {
    super(data);
    this.properties.commitmentDescription = CommitmentMessages(
      Number(data.properties.commitment)
    );
    this.properties.role = data.properties.role;
    this.properties.commitment = data.properties.commitment;
  }
}
