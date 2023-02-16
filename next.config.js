module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/ipfs/:cid",
        destination: "https://infura-ipfs.io/ipfs/:cid",
      }
    ];
  };
  return {
    rewrites,
  };
};