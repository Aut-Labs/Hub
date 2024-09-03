import { HubOSHub } from "@api/hub.model";

export const filterActiveHubs = (hubs: HubOSHub[], address: string) => {
  if (!hubs) {
    return [];
  }
  return hubs.filter((hub) => {
    return (
      hub.properties.members?.length >= 1 ||
      hub.properties.deployer?.toLowerCase() === address?.toLowerCase()
    );
  });
};
