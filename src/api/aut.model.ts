import {
  DAutAutID,
  AutIDProperties as BaseAutIDProperties
} from "@aut-labs/d-aut";

export class AutIDProperties extends BaseAutIDProperties {
  constructor(data: AutIDProperties) {
    super(data);
  }
}

export class HubOSAutID extends DAutAutID<AutIDProperties> {
  constructor(data: HubOSAutID = {} as HubOSAutID) {
    super(data);
    this.properties = new AutIDProperties(data.properties);
  }
}
