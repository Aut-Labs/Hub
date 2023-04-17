import { styled, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { ReactComponent as ShareIcon } from "@assets/ShareIcon.svg";
import { pxToRem } from "@utils/text-size";
import { AutID } from "@api/aut.model";
import { ipfsCIDToHttpUrl } from "@api/storage.api";

const CardTilt = styled("div")(({ theme }) => ({
  borderRadius: 0,
  border: "1px solid white",
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: "relative",
  width: "calc(100% - 45px)",
  height: "calc(100% - 45px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "22.5px",
  marginTop: "22.5px",
  backgroundColor: "black",
  "@keyframes sw-card-tilt": {
    "0%": {
      transform: " perspective(1200px) rotate3d(0, -0.5, 0, 0deg)",
      transformstyle: "preserve-3d"
    },
    "25%": {
      transform: "perspective(1200px) rotate3d(0, -1, 0, 15deg)",
      transformstyle: "preserve-3d"
    },
    "50%": {
      transform: "perspective(1200px) rotate3d(0, -0.5, 0, 0deg)",
      transformstyle: "preserve-3d"
    },
    "75%": {
      transform: "perspective(1200px) rotate3d(0, -1, 0, 15deg)",
      transformstyle: "preserve-3d"
    },
    "100%": {
      transform: "perspective(1200px) rotate3d(0, -1, 0, 0deg)",
      transformstyle: "preserve-3d"
    }
  },
  animation: `sw-card-tilt 3s linear infinite`,
  animationDirection: "normal"
}));

const AutRightContainer = styled("div")(({ theme }) => ({
  width: "100%"
}));
const AutRightMobileContainer = styled("div")(({ theme }) => ({
  width: "100%"
}));

const personCard = {
  name: "Eulalie",
  description: "#1 | 18:02:36 | 28/01/22 "
};

const AutIdCard = ({ avatar }) => {
  return (
    <CardTilt style={{ position: "relative" }}>
      <img
        alt="id"
        style={{
          width: "100%",
          height: "100%"
        }}
        src={ipfsCIDToHttpUrl(avatar)}
      />
      <div style={{ position: "fixed", bottom: "15px", right: "15px" }}>
        <Typography
          fontSize={pxToRem(50)}
          color="background.paper"
          textAlign="left"
        >
          {personCard.name}
        </Typography>
        <Typography variant="subtitle2" color="primary.main" textAlign="left">
          {personCard.description}
        </Typography>
      </div>
    </CardTilt>
  );
};

const RightProfile = ({ member }: { member: AutID }) => {
  const desktop = useMediaQuery("(min-width:769px)");

  return (
    <>
      {desktop ? (
        <AutRightContainer>
          <>
            <SvgIcon
              sx={{
                height: pxToRem(100),
                width: pxToRem(100),
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: pxToRem(20),
                fill: "white",
                cursor: "pointer"
              }}
              component={ShareIcon}
            />
          </>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            // height={window.innerHeight}
            width="100%"
            viewBox="0 0 960 1075"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x2="1"
                y1="0.5"
                y2="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#009fe3" />
                <stop offset="0.08" stopColor="#0399de" />
                <stop offset="0.19" stopColor="#0e8bd3" />
                <stop offset="0.3" stopColor="#2072bf" />
                <stop offset="0.41" stopColor="#3a50a4" />
                <stop offset="0.53" stopColor="#5a2583" />
                <stop offset="0.71" stopColor="#453f94" />
                <stop offset="0.88" stopColor="#38519f" />
                <stop offset="1" stopColor="#3458a4" />
              </linearGradient>
              <clipPath id="clip-path">
                <path
                  fill="#fff"
                  stroke="#707070"
                  strokeWidth="1"
                  d="M0 0H440V694H0z"
                  data-name="Rectangle 2934"
                  transform="translate(.292 -.372)"
                />
              </clipPath>
              <filter
                id="Rectangle_2301"
                width="458"
                height="712"
                x="257"
                y="287"
                filterUnits="userSpaceOnUse"
              >
                <feOffset dx="6" dy="6" />
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feFlood floodOpacity="0.545" />
                <feComposite in2="blur" operator="in" />
                <feComposite in="SourceGraphic" />
              </filter>
              <linearGradient
                id="linear-gradient-9"
                x1="0.061"
                x2="1.127"
                y1="0.343"
                y2="0.658"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-10"
                x1="0.063"
                x2="1.133"
                y1="0.343"
                y2="0.658"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-11"
                x1="-0.128"
                x2="1.167"
                y1="0.299"
                y2="0.619"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-12"
                x1="-0.137"
                x2="1.178"
                y1="0.298"
                y2="0.617"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-13"
                x1="-0.142"
                x2="0.952"
                y1="0.416"
                y2="0.559"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-14"
                x1="-0.156"
                x2="0.951"
                y1="0.418"
                y2="0.556"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-15"
                x1="0"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-16"
                x1="0"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-17"
                x2="1"
                y1="0.5"
                y2="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#0059a6" />
                <stop offset="0.1" stopColor="#0556a1" />
                <stop offset="0.22" stopColor="#134f93" />
                <stop offset="0.35" stopColor="#2c427d" />
                <stop offset="0.49" stopColor="#4e315e" />
                <stop offset="0.53" stopColor="#5a2c54" />
                <stop offset="0.67" stopColor="#353e75" />
                <stop offset="0.8" stopColor="#184c90" />
                <stop offset="0.92" stopColor="#0655a0" />
                <stop offset="1" stopColor="#0059a6" />
              </linearGradient>
              <linearGradient
                id="linear-gradient-19"
                x1="0"
                x2="1"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient-17"
              />
              <linearGradient
                id="linear-gradient-20"
                x1="0"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-21"
                x1="0"
                x2="1"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient-17"
              />
              <linearGradient
                id="linear-gradient-22"
                x1="0"
                x2="1"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient-17"
              />
              <linearGradient
                id="linear-gradient-23"
                x1="0"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-24"
                x1="0"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-25"
                x1="0"
                x2="1"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient-17"
              />
              <linearGradient
                id="linear-gradient-26"
                x1="0"
                x2="1.001"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-28"
                x1="0"
                x2="1.001"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-29"
                x1="-2.59"
                x2="-2.575"
                y1="-1.483"
                y2="-1.483"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-35"
                x1="0"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-39"
                x1="0"
                y1="0.501"
                y2="0.501"
                xlinkHref="#linear-gradient"
              />
              <linearGradient
                id="linear-gradient-40"
                x1="0"
                x2="0.999"
                y1="0.5"
                y2="0.5"
                xlinkHref="#linear-gradient-17"
              />
              <linearGradient
                id="linear-gradient-43"
                x1="0"
                y1="0.501"
                y2="0.501"
                xlinkHref="#linear-gradient"
              />
              <clipPath id="clip-Tunnel_Card">
                <path d="M0 0H960V1075H0z" />
              </clipPath>
            </defs>
            <g clipPath="url(#clip-Tunnel_Card)" data-name="Tunnel &amp; Card">
              <path fill="#fff" d="M0 0H960V1075H0z" />
              <path d="M0 0H963V1081H0z" data-name="Rectangle 3389" />
              <g data-name="Group 12377" transform="translate(-956.615)">
                <g data-name="Group 12376">
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 865L0 0"
                    data-name="Line 4"
                    transform="translate(1098.5 71.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 865L0 0"
                    data-name="Line 5"
                    transform="translate(1782.5 71.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 680L0 0"
                    data-name="Line 6"
                    transform="translate(1182.5 175.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 680L0 0"
                    data-name="Line 7"
                    transform="translate(1696.5 175.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 444L414 0"
                    data-name="Line 8"
                    transform="translate(969.5 636.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M106 0L0 0"
                    data-name="Line 9"
                    transform="translate(1383.5 636.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M435 441L0 0"
                    data-name="Line 10"
                    transform="translate(1485.5 639.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 0L514 0"
                    data-name="Line 11"
                    transform="translate(1182.5 175.5)"
                  />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M0 0L684 0"
                    data-name="Line 12"
                    transform="translate(1098.5 71.5)"
                  />
                  <g
                    data-name="Layer 1"
                    transform="rotate(-180 552.192 470.147)"
                  >
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 256.518 3.53 309.789-3.53 302.487z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 184.373v120.052L10 460.39v408.4L1.77 570.266V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g
                    data-name="Layer 1"
                    transform="rotate(-180 484.193 535.739)"
                  >
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 316.361 3.53 382.06-3.53 373.057z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 227.385v148.06L10 567.8v503.682L1.77 703.3V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 552.192 468.5)">
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 255.545 3.53 308.614L8.24 865.5z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 183.673v119.6L10 458.644V865.5L1.77 568.1V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g
                    data-name="Layer 1"
                    transform="rotate(-180 591.192 427.75)"
                  >
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 200.775 3.53 242.47L8.24 680z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 144.307v93.965L10 360.344V680L1.77 446.343V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 894.192 468.5)">
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 255.545 3.53 308.614L8.24 865.5z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 183.673v119.6L10 458.644V865.5L1.77 568.1V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g
                    data-name="Layer 1"
                    transform="rotate(-180 851.192 427.75)"
                  >
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 200.775 3.53 242.47L8.24 680z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 144.307v93.965L10 360.344V680L1.77 446.343V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g
                    data-name="Layer 1"
                    transform="rotate(-90 577.213 -497.829)"
                  >
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 215.2 3.53 259.885-3.53 253.757z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 154.672v100.714L10 386.227v342.615L1.77 478.4V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g
                    data-name="Layer 1"
                    transform="rotate(-90 666.737 -484.353)"
                  >
                    <g data-name="Group 4">
                      <path
                        fill="#bfbfbf"
                        d="M0 0l8.24 162.774 3.53 196.577L8.24 551.3z"
                        data-name="Path 10"
                      />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 116.994v76.18L10 292.141V551.3L1.77 361.863V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                </g>
              </g>
              <g
                clipPath="url(#clip-path)"
                data-name="Mask Group 2"
                transform="translate(259.708 290.372)"
              >
                <g
                  filter="url(#Rectangle_2301)"
                  transform="translate(-259.71 -290.37)"
                >
                  <g
                    style={{ position: "relative", cursor: "pointer" }}
                    data-name="Rectangle 2301"
                    transform="translate(260 290)"
                  >
                    <foreignObject height="695" width="440">
                      <AutIdCard avatar={member?.image as string} />
                    </foreignObject>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </AutRightContainer>
      ) : (
        <AutRightMobileContainer>
          <>
            <SvgIcon
              sx={{
                height: pxToRem(50),
                width: pxToRem(50),
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: pxToRem(20),
                fill: "white",
                cursor: "pointer"
              }}
              component={ShareIcon}
            />
          </>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            height={window.innerWidth}
            viewBox="0 0 445.5 474.073"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                y1="0.5"
                x2="1"
                y2="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#009fe3" />
                <stop offset="0.08" stopColor="#0399de" />
                <stop offset="0.19" stopColor="#0e8bd3" />
                <stop offset="0.3" stopColor="#2072bf" />
                <stop offset="0.41" stopColor="#3a50a4" />
                <stop offset="0.53" stopColor="#5a2583" />
                <stop offset="0.71" stopColor="#453f94" />
                <stop offset="0.88" stopColor="#38519f" />
                <stop offset="1" stopColor="#3458a4" />
              </linearGradient>
            </defs>
            <g
              id="Group_12379"
              data-name="Group 12379"
              transform="translate(32.242 -112.45)"
            >
              <path
                id="Line_32"
                data-name="Line 32"
                d="M.5,318.033h-1V0h1Z"
                transform="translate(308.139 162.908)"
                fill="#fff"
              />
              <path
                id="Line_33"
                data-name="Line 33"
                d="M.366,208l-.731-.682L193.26-.341l.731.682Z"
                transform="translate(-31.876 378.516)"
                fill="#fff"
              />
              <path
                id="Line_34"
                data-name="Line 34"
                d="M49.576.5H0v-1H49.576Z"
                transform="translate(161.75 378.516)"
                fill="#fff"
              />
              <path
                id="Line_35"
                data-name="Line 35"
                d="M203.092,206.605-.356.351l.712-.7L203.8,205.9Z"
                transform="translate(209.455 379.918)"
                fill="#fff"
              />
              <g
                id="Layer_1"
                data-name="Layer 1"
                transform="translate(310.891 480.941) rotate(-180)"
              >
                <g id="Group_4" data-name="Group 4">
                  <path
                    id="Path_10"
                    data-name="Path 10"
                    d="M0,0,3.854,93.9,5.5,207.3,3.854,318.033Z"
                    fill="#bfbfbf"
                  />
                  <path
                    id="Path_11"
                    data-name="Path 11"
                    d="M0,0,2.371,67.492v43.947l1.478,57.093v149.5L0,208.753V0Z"
                    transform="translate(0.828 0)"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <path
                id="Line_29"
                data-name="Line 29"
                d="M.5,404.557h-1V0h1Z"
                transform="translate(28.456 114.268)"
                fill="#fff"
              />
              <path
                id="Line_31"
                data-name="Line 31"
                d="M.5,318.033h-1V0h1Z"
                transform="translate(67.743 162.908)"
                fill="#fff"
              />
              <path
                id="Line_36"
                data-name="Line 36"
                d="M240.4.5H0v-1H240.4Z"
                transform="translate(67.743 162.908)"
                fill="#fff"
              />
              <path
                id="Line_37"
                data-name="Line 37"
                d="M319.9.5H0v-1H319.9Z"
                transform="translate(28.456 114.268)"
                fill="#fff"
              />
              <g
                id="Layer_1-2"
                data-name="Layer 1"
                transform="translate(31.209 520.6) rotate(-180)"
              >
                <g id="Group_4-2" data-name="Group 4">
                  <path
                    id="Path_10-2"
                    data-name="Path 10"
                    d="M0,0,3.854,119.972,5.5,264.859,3.854,406.332Z"
                    fill="#bfbfbf"
                  />
                  <path
                    id="Path_11-2"
                    data-name="Path 11"
                    d="M0,0,2.371,86.23v56.148l1.478,72.944V406.332L0,266.711V0Z"
                    transform="translate(0.828 0)"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g
                id="Layer_1-3"
                data-name="Layer 1"
                transform="translate(31.209 519.059) rotate(-180)"
              >
                <g id="Group_4-3" data-name="Group 4">
                  <path
                    id="Path_10-3"
                    data-name="Path 10"
                    d="M0,0,3.854,119.517,5.5,263.855,3.854,404.791Z"
                    fill="#bfbfbf"
                  />
                  <path
                    id="Path_11-3"
                    data-name="Path 11"
                    d="M0,0,2.371,85.9v55.935l1.478,72.667V404.791L0,265.7V0Z"
                    transform="translate(0.828 0)"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g
                id="Layer_1-4"
                data-name="Layer 1"
                transform="translate(67.688 480.941) rotate(-180)"
              >
                <g id="Group_4-4" data-name="Group 4">
                  <path
                    id="Path_10-4"
                    data-name="Path 10"
                    d="M0,0,3.854,93.9,5.5,207.3,3.854,318.033Z"
                    fill="#bfbfbf"
                  />
                  <path
                    id="Path_11-4"
                    data-name="Path 11"
                    d="M0,0,2.371,67.492v43.947l1.478,57.093v149.5L0,208.753V0Z"
                    transform="translate(0.828 0)"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g
                id="Layer_1-5"
                data-name="Layer 1"
                transform="translate(17.485 117.955) rotate(-90)"
              >
                <g
                  id="Group_4-5"
                  data-name="Group 4"
                  transform="translate(0 0)"
                >
                  <path
                    id="Path_10-5"
                    data-name="Path 10"
                    d="M0,0,3.854,100.646,5.5,222.193,3.854,340.876Z"
                    transform="translate(0 0)"
                    fill="#bfbfbf"
                  />
                  <path
                    id="Path_11-5"
                    data-name="Path 11"
                    d="M0,0,2.371,72.34v47.1l1.478,61.194v160.24L0,223.747V0Z"
                    transform="translate(0.828 0)"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g
                id="Layer_1-6"
                data-name="Layer 1"
                transform="translate(53.053 166.129) rotate(-90)"
              >
                <g
                  id="Group_4-6"
                  data-name="Group 4"
                  transform="translate(0 0)"
                >
                  <path
                    id="Path_10-6"
                    data-name="Path 10"
                    d="M0,0,3.854,76.129,5.5,168.067,3.854,257.838Z"
                    transform="translate(0 0)"
                    fill="#bfbfbf"
                  />
                  <path
                    id="Path_11-6"
                    data-name="Path 11"
                    d="M0,0,2.371,54.718V90.347l1.478,46.287V257.838L0,169.242V0Z"
                    transform="translate(0.828 0)"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
            </g>
            <g
              clipPath="url(#clip-path)"
              data-name="Mask Group 2"
              transform="translate(259.708 290.372)"
            >
              <g
                filter="url(#Rectangle_2301)"
                transform="translate(-259.71 -290.37)"
              >
                <g
                  style={{ position: "relative", cursor: "pointer" }}
                  data-name="Rectangle 2301"
                  transform="translate(260 290)"
                >
                  <foreignObject height="695" width="440">
                    <AutIdCard avatar={member?.image as string} />
                  </foreignObject>
                </g>
              </g>
            </g>
          </svg>
        </AutRightMobileContainer>
      )}
    </>
  );
};

export default RightProfile;
