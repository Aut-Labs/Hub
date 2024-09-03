import { ReactComponent as OpenSource } from "@assets/icons/opensource.svg";
import { ReactComponent as Defi } from "@assets/icons/defi.svg";
import { ReactComponent as Social } from "@assets/icons/social.svg";
import { ReactComponent as Refi } from "@assets/icons/refi.svg";
import { ReactComponent as Identity } from "@assets/icons/identity.svg";
import { Role } from "@aut-labs/sdk/dist/models/role";
import { HubOSAutID } from "./aut.model";
import { DAutHub, HubProperties as BaseHubProperties } from "@aut-labs/d-aut";

interface MarketTemplate {
  title: string;
  market: number;
  icon: any;
}

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

export class HubProperties extends BaseHubProperties {
  members: HubOSAutID[];
  metadataUri: string;

  constructor(data: HubProperties) {
    super(data);
    this.members = data.members;
    this.metadataUri = data.metadataUri;
  }
}

export class HubOSHub<T = HubProperties> extends DAutHub<T> {
  constructor(data: HubOSHub<T> = {} as HubOSHub<T>) {
    super(data);
    this.properties = new HubProperties(data.properties as HubProperties) as T;
  }

  get roles(): Role[] {
    return (this.properties as HubProperties).rolesSets[0].roles;
  }

  get marketTemplate(): MarketTemplate {
    const markeId = +(this.properties as HubProperties).market;
    return MarketTemplates.find((template) => template.market === markeId);
  }

  get prestige(): number {
    return 100;
  }

  get absoluteValue(): number {
    return Math.floor(Math.random() * 100) + 1;
  }
}