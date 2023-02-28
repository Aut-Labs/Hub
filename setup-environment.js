const fs = require("fs");
const os = require("os");
const axios = require("axios").default;

const setEnvValue = async () => {
  const envVars = fs.readFileSync("./.env", "utf8").split(os.EOL);

  let rpcUrls = [];
  let autIdAddresses = [];
  let daoRegistryAddresses = [];

  const networks = envVars.find((item) =>
    item.startsWith("NEXT_PUBLIC_NETWORKS")
  );

  if (networks) {
    const [, value] = networks.split("=");
    const networkNames = value.split(",");

    for (let i = 0; i < networkNames.length; i++) {
      const name = networkNames[i].toLowerCase();
      try {
        const response = await axios.get(
          `https://api.skillwallet.id/api/autid/config/${name}`
        );
        const data = response.data;
        rpcUrls.push(data.rpc);
        autIdAddresses.push(data.autIDAddress);
        daoRegistryAddresses.push(data.daoExpanderRegistryAddress);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const envsToUpdate = {
    NEXT_PUBLIC_RPC_URLS: rpcUrls.join(","),
    NEXT_PUBLIC_AUT_ID_ADDRESSES: autIdAddresses.join(","),
    NEXT_PUBLIC_DAO_REGISTRY_ADDRESSES: daoRegistryAddresses.join(","),
  };

  Object.keys(envsToUpdate).forEach((key) => {
    const target = envVars.indexOf(
      envVars.find((line) => {
        return line.match(new RegExp(key));
      })
    );
    if (target === -1) {
      envVars.splice(envVars.length, 1, `${key}=${envsToUpdate[key]}`);
    } else {
      envVars.splice(target, 1, `${key}=${envsToUpdate[key]}`);
    }
  });
  fs.writeFileSync("./.env", envVars.join(os.EOL));
};

// setEnvValue();
