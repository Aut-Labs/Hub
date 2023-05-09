/* eslint-disable max-len */
export const MarketTemplates = [
  {
    title: "Infrastructure, & Web3 Tools",
    description:
      "For researchers & web3, open-source teams, that innovate in a liberal fashion - creating the tools and technology to power a more collaborative world.",
    market: 1
  },
  {
    title: "Art, Events & NFTs",
    description:
      "Art movements, writers & creative collectives of all kind - who use Art & provable ownership for purer, more disruptive forms of human interaction.",
    market: 2
  },
  {
    title: "Governance & Public Goods",
    description:
      "From support for people in need, to innovative local hubs - to get together & create something greater than oneself, to build a fairer & more meritocratic world.",
    market: 3
  }
];

export const CommitmentMessages = (value: number) => {
  switch (+value) {
    case 1:
      return `Just lurking 👀`;
    case 2:
    case 3:
    case 4:
      return "gm gm ☕";
    case 5:
    case 6:
    case 7:
      return "Trusted seed 🌱";
    case 8:
    case 9:
    case 10:
      return `Soulbound ⛓️`;
    default:
      return `Minimum Commitment Level for new Members.`;
  }
};
