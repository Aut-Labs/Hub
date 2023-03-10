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

export const ShowcaseData = {
  title: "Nova Showcase",
  subtitle:
    "Pick a Nova, complete their onboarding quest and join their \n community to help them rise up the Nova leaderboard",
  novaCards: [
    {
      front: {
        title: "Nova Title",
        description:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore",
      },
      back: {
        communityName: "RabitWhole",
        quests: [
          {
            role: "Designer",
            questLink: "https://www.google.com/",
          },
          {
            role: "Copywriter",
            questLink: "https://www.google.com/",
          },
          {
            role: "Project Manager",
            questLink: "https://www.google.com/",
          },
        ],
      },
    },
    {
      front: {
        title: "Nova Title",
        description:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore",
      },
      back: {
        communityName: "RabitWhole",
        quests: [
          {
            role: "Designer",
            questLink: "https://www.google.com/",
          },
          {
            role: "Copywriter",
            questLink: "https://www.google.com/",
          },
          {
            role: "Project Manager",
            questLink: "https://www.google.com/",
          },
        ],
      },
    },
    {
      front: {
        title: "Nova Title",
        description:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore",
      },
      back: {
        communityName: "RabitWhole",
        quests: [
          {
            role: "Designer",
            questLink: "https://www.google.com/",
          },
          {
            role: "Copywriter",
            questLink: "https://www.google.com/",
          },
          {
            role: "Project Manager",
            questLink: "https://www.google.com/",
          },
        ],
      },
    },
    {
      front: {
        title: "Nova Title",
        description:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore",
      },
      back: {
        communityName: "RabitWhole",
        quests: [
          {
            role: "Designer",
            questLink: "https://www.google.com/",
          },
          {
            role: "Copywriter",
            questLink: "https://www.google.com/",
          },
          {
            role: "Project Manager",
            questLink: "https://www.google.com/",
          },
        ],
      },
    },
    {
      front: {
        title: "Nova Title",
        description:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore",
      },
      back: {
        communityName: "RabitWhole",
        quests: [
          {
            role: "Designer",
            questLink: "https://www.google.com/",
          },
          {
            role: "Copywriter",
            questLink: "https://www.google.com/",
          },
          {
            role: "Project Manager",
            questLink: "https://www.google.com/",
          },
        ],
      },
    },
  ],
};
