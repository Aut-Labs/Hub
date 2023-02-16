import AutLogo from "common/assets/image/logo.svg";

/* ------------------------------------ */
// Navbar data section
/* ------------------------------------ */

export const NavbarData = {
  logo: AutLogo,
  navButtons: [],
  menuItems: [],
};

/* ------------------------------------ */
// FOOTER data section
/* ------------------------------------ */
import footerDiscord from "common/assets/image/discord-social.svg";
import footerTwitter from "common/assets/image/twitter-social.svg";
import footerDocs from "common/assets/image/docs.svg";
import footerMirror from "common/assets/image/mirror-logo.svg";

export const FooterData = {
  menu: [],
  logo: AutLogo,
  mailchimpUrl:
    "https://aut.us20.list-manage.com/subscribe/post?u=d961a0504e2d77cc544c89c33&amp;id=0599e9c37b&amp;f_id=008810e7f0",
  copyright: `© Āut Labs ${new Date().getFullYear()}`,
  widgets: [
    {
      id: 2,
      title: "Quick Links",
      list: [
        {
          id: 3,
          title: "Github",
          target: "_blank",
          link: "https://github.com/Aut-Labs",
        },
        {
          id: 2,
          title: "Docs",
          target: "_blank",
          link: "https://docs.aut.id",
        },
      ],
    },
  ],
  social: [
    {
      link: "https://twitter.com/opt_aut",
      icon: footerTwitter,
      name: "Twitter",
    },
    {
      link: "https://aut.mirror.xyz",
      icon: footerMirror,
      name: "Mirror",
    },
    {
      link: "http://discord.gg/aXJFGgcvUk",
      icon: footerDiscord,
      name: "Discord",
    },
  ],
};

/* ------------------------------------ */
// TRY-AUT data section
/* ------------------------------------ */
import expand from "common/assets/image/expand.svg";
import invite from "common/assets/image/invite.svg";
import fingerprint from "common/assets/image/fingerprint.svg";

export const TryOutData = {
  title: "Try Āut",
  subtitle: "Join the Coordination Renaissance - and expand your DAO.",
  ownerItems: [
    {
      button: {
        text: "Try it",
        link: "https://playground.aut.id",
      },
      front: {
        title: "Expand",
        icon: expand.src,
        subtitle: (
          <>
            Do more with <br /> your DAO
          </>
        ),
      },
      back: {
        description:
          "Expand your community by importing an existing DAO Contract, adding 3 member Roles and verifying your Ownership.",
      },
      complete: false,
      validation: "CheckDAO",
    },
    {
      button: {
        text: "Try it",
        link: "https://playground.aut.id",
      },
      front: {
        title: "Invite",
        icon: invite.src,
        subtitle: (
          <>
            A native Bound between <br /> DAOs & Members
          </>
        ),
      },
      back: {
        description:
          "Integrate dĀut to any website or DApp and invite members to signup or login to your DAO - Just like Google-Auth, but decentralized.",
      },
      complete: false,
      validation: "CheckTwitter",
    },
    {
      button: {
        text: "Try it",
        link: "https://my.aut.id/",
      },
      front: {
        title: "Participate",
        icon: fingerprint.src,
        subtitle: (
          <>
            Own your <br /> own Identity
          </>
        ),
      },
      back: {
        description:
          "Customize your ĀutID - This is your Social Profile which keeps track of all your DAOs, tasks, Roles, and Commitments across the DAO eco-system.",
      },
      complete: false,
      validation: "CheckAut",
    },
  ],
  memberItems: [
    {
      button: {
        text: "Try it",
        link: "https://playground.aut.id",
      },
      front: {
        title: "Join",
        icon: expand.src,
        subtitle: (
          <>
            Join the invitation <br /> from your DAO{" "}
          </>
        ),
      },
      back: {
        description:
          "Expand your community by importing an existing DAO Contract, adding 3 member Roles and verifying your Ownership.",
      },
      complete: false,
      validation: "CheckDAO",
    },
    {
      button: {
        text: "Try it",
        link: "https://playground.aut.id",
      },
      front: {
        title: "Invite",
        icon: invite.src,
        subtitle: (
          <>
            Participate in 1 or various <br /> onboarding quests
          </>
        ),
      },
      back: {
        description:
          "Integrate dĀut to any website or DApp and invite members to signup or login to your DAO - Just like Google-Auth, but decentralized.",
      },
      complete: false,
      validation: "CheckDAO",
    },
    {
      button: {
        text: "Try it",
        link: "https://my.aut.id/",
      },
      front: {
        title: "Participate",
        icon: fingerprint.src,
        subtitle: (
          <>
            Claim your āutID, <br /> explore your dashboard
          </>
        ),
      },
      back: {
        description:
          "Customize your ĀutID - This is your Social Profile which keeps track of all your DAOs, tasks, Roles, and Commitments across the DAO eco-system.",
      },
      complete: false,
      validation: "CheckDAO",
    },
  ],
};
