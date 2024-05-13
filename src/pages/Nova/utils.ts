import { Community } from "@api/community.model";

export const filterActiveNovas = (novas: Community[], address: string) => {
  if (!novas) {
    return [];
  }
  return novas.filter((nova) => {
    return (
      nova.properties.members >= 1 ||
      nova.properties.deployer?.toLowerCase() === address?.toLowerCase()
    );
  });
};
