import { FindTextCenter } from "@utils/text-size";

/* eslint-disable max-len */
const SVG_WIDTH = 284.5;
const TEXT_OFFSET = 17;

const textSize = FindTextCenter(SVG_WIDTH, TEXT_OFFSET, "width");

function UserTaskDetail({ username, date, url }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="284.5"
      height="453.5"
      viewBox="0 0 284.5 453.5"
    >
      <defs>
        <filter
          id="Rectangle_2202"
          width="284.5"
          height="453.5"
          x="0"
          y="0"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dx="6" dy="6" />
          <feGaussianBlur result="blur" stdDeviation="0.5" />
          <feFlood floodColor="#fff" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <linearGradient
          id="linear-gradient"
          x1="0.281"
          x2="0.538"
          y1="0.79"
          y2="0.325"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.512" stopColor="#d1d1d1" stopOpacity="0.137" />
          <stop offset="0.917" stopColor="#434342" stopOpacity="0.569" />
          <stop offset="1" stopColor="#171716" stopOpacity="0.698" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="0.281"
          x2="0.538"
          y1="-20.711"
          y2="-21.177"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.546" stopColor="#cacac9" stopOpacity="0.137" />
          <stop offset="0.977" stopColor="#232322" stopOpacity="0.569" />
          <stop offset="1" stopColor="#171716" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-3"
          x1="0.951"
          x2="0.377"
          y1="0.714"
          y2="0.436"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.721" stopColor="#9f9f9e" stopOpacity="0.125" />
          <stop offset="1" stopColor="#171716" stopOpacity="0.302" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-4"
          x1="0.141"
          x2="0.557"
          y1="0.653"
          y2="0.499"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.819" stopColor="#525251" stopOpacity="0.298" />
          <stop offset="1" stopColor="#171716" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-5"
          x1="0.599"
          x2="0.332"
          y1="0.4"
          y2="0.666"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.672" stopColor="#c4c4c3" stopOpacity="0.102" />
          <stop offset="1" stopColor="#171716" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-6"
          x1="1.117"
          x2="-0.11"
          y1="0.807"
          y2="0.171"
          xlinkHref="#linear-gradient-5"
        />
        <linearGradient
          id="linear-gradient-7"
          x1="0.25"
          x2="1.009"
          y1="-0.483"
          y2="0.983"
          xlinkHref="#linear-gradient-5"
        />
        <pattern
          id="pattern"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 128 128"
        >
          <image width="128" height="128" xlinkHref={url} />
        </pattern>
      </defs>

      <g data-name="Group 10730" transform="translate(-658 -241)">
        <path
          d="M0 0H275V444H0z"
          data-name="Rectangle 2205"
          transform="translate(660 243)"
        />
        <path
          d="M0 0H276V445H0z"
          data-name="Rectangle 2206"
          transform="translate(663 246)"
        />
        <path
          d="M32.7 103h107.175l62.865 445.029H33.1z"
          data-name="Path 1527"
          transform="translate(626.595 139.523)"
        />
        <text
          fill="#fff"
          fontFamily="JosefinSans-Regular, Josefin Sans"
          fontSize="28"
          transform="translate(674 438)"
        >
          <tspan x={textSize(username, "28px")} y="21">
            {username}
          </tspan>
        </text>

        <text
          fill="#fff"
          fontFamily="JosefinSans-Regular, Josefin Sans"
          fontSize="14"
          transform="translate(674 474)"
        >
          <tspan x={textSize(date, "14px")} y="11">
            {date}
          </tspan>
        </text>
        <g filter="url(#Rectangle_2202)" transform="translate(658 241)">
          <g
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            data-name="Rectangle 2202"
          >
            <path stroke="none" d="M0 0H277V446H0z" />
            <path d="M0.5 0.5H276.5V445.5H0.5z" />
          </g>
        </g>
        <g data-name="Group 1922" transform="translate(860.97 657.639)">
          <g data-name="Group 2" transform="translate(24.44 .252)">
            <g fill="#fff" data-name="Group 1">
              <path
                d="M441.513 602.182a5.245 5.245 0 00-.8-.327 2.8 2.8 0 00-.851-.138 1.445 1.445 0 00-.915.267.859.859 0 00-.341.713.792.792 0 00.223.569 1.944 1.944 0 00.574.4q.351.168.747.317a6.161 6.161 0 01.653.282 2.6 2.6 0 01.589.4 1.711 1.711 0 01.416.584 2.1 2.1 0 01.153.851 1.931 1.931 0 01-1.089 1.771 2.742 2.742 0 01-1.257.267 3.8 3.8 0 01-.9-.1 3.9 3.9 0 01-.8-.282 5.894 5.894 0 01-.653-.366l.425-.752a4.124 4.124 0 00.544.322 3.344 3.344 0 00.643.242 2.541 2.541 0 00.653.089 1.956 1.956 0 00.673-.119 1.265 1.265 0 00.544-.376 1.021 1.021 0 00.218-.683.952.952 0 00-.193-.6 1.639 1.639 0 00-.5-.421 5.166 5.166 0 00-.678-.312 7.139 7.139 0 01-.688-.277 3.388 3.388 0 01-.633-.381 1.769 1.769 0 01-.475-.549 1.594 1.594 0 01-.183-.792 1.771 1.771 0 01.272-.985 1.9 1.9 0 01.747-.663 2.549 2.549 0 011.088-.262 4.038 4.038 0 011.222.168 4.617 4.617 0 01.935.406z"
                data-name="Path 1"
                transform="translate(-437.179 -600.866)"
              />
              <path
                d="M500.324 604.144l-.02.356.119-.178 2.929-3.058h1.237l-2.959 3.068 3.127 4.087h-1.217l-2.613-3.474-.6.584v2.89h-.97v-7.155h.97z"
                data-name="Path 2"
                transform="translate(-493.07 -601.224)"
              />
              <path
                d="M565.6 601.264h.96v7.155h-.96z"
                data-name="Path 3"
                transform="translate(-552.71 -601.224)"
              />
              <path
                d="M594.762 601.264h.96v6.236h3.632v.92h-4.592z"
                data-name="Path 4"
                transform="translate(-578.959 -601.224)"
              />
              <path
                d="M655.36 601.264h.96v6.236h3.632v.92h-4.592z"
                data-name="Path 5"
                transform="translate(-633.51 -601.224)"
              />
              <path
                d="M436.375 706.51h1.125l1.93 5.463-.168-.06 1.415-3.671.445 1.3-1.9 4.433zm3.454 0h.95l2.108 5.393-.208-.039 1.841-5.354h1.029l-2.81 7.442z"
                data-name="Path 6"
                transform="translate(-436.375 -695.969)"
              />
              <path
                d="M525.439 710.689l3.117-7.452h.059l3.127 7.452h-1.1l-2.335-5.947.683-.445-2.6 6.393zm1.831-2.712h2.662l.317.831h-3.256z"
                data-name="Path 7"
                transform="translate(-516.552 -693.023)"
              />
              <path
                d="M601.014 706.213h.96v6.234h3.632v.92h-4.592z"
                data-name="Path 8"
                transform="translate(-584.587 -695.702)"
              />
              <path
                d="M661.611 706.213h.96v6.234h3.629v.92h-4.592z"
                data-name="Path 9"
                transform="translate(-639.138 -695.702)"
              />
              <path
                d="M722.21 706.213h4.651v.92h-3.691v2.177h3.3v.93h-3.3v2.207H727v.92h-4.79z"
                data-name="Path 10"
                transform="translate(-693.69 -695.702)"
              />
              <path
                d="M780.429 706.213h4.76v.92h-1.92v6.234h-.96v-6.234h-1.88z"
                data-name="Path 11"
                transform="translate(-746.1 -695.702)"
              />
            </g>
          </g>
          <g data-name="Group 1866">
            <path
              fill="url(#linear-gradient)"
              d="M195.544 663.389l-4.118-3.108v2.446s3 1.545 2.932 1.5a8.945 8.945 0 011.186-.838z"
              data-name="Path 12"
              opacity="0.28"
              transform="translate(-191.426 -654.101)"
            />
            <path
              fill="url(#linear-gradient-2)"
              d="M195.544 683.828l-4.118 3.108v-2.446s3-1.545 2.932-1.5a8.939 8.939 0 001.186.838z"
              data-name="Path 13"
              opacity="0.28"
              transform="translate(-191.426 -674.545)"
            />
            <path
              fill="url(#linear-gradient-3)"
              d="M255.471 745.795l-2.105 3.684 2.472.032.806-3.916z"
              data-name="Path 14"
              opacity="0.5"
              transform="translate(-247.185 -730.902)"
            />
            <path
              fill="url(#linear-gradient-4)"
              d="M284.751 737.222l-3.02-5.269-.366 1.78 1.533 3.489z"
              data-name="Path 15"
              opacity="0.5"
              transform="translate(-272.39 -718.622)"
            />
            <path
              fill="url(#linear-gradient-5)"
              d="M253.366 598.644l3.7 7.866 8.659 4.555.015-2.487-7.174-3.29-2.73-6.583z"
              data-name="Path 16"
              opacity="0.28"
              transform="translate(-247.185 -598.614)"
            />
            <path
              fill="#fff"
              d="M0 0H6.18V6.18H0z"
              data-name="Rectangle 2"
              transform="rotate(-180 3.09 9.3)"
            />
            <path
              fill="#161615"
              d="M0 0H3.708V3.708H0z"
              data-name="Rectangle 3"
              transform="rotate(-180 2.472 8.682)"
            />
            <circle
              cx="0.618"
              cy="0.618"
              r="0.618"
              fill="#fff"
              data-name="Ellipse 1"
              transform="translate(2.472 14.893)"
            />
            <path
              fill="#fff"
              d="M0 0H6.18V6.18H0z"
              data-name="Rectangle 4"
              transform="rotate(-180 9.27 9.3)"
            />
            <path
              fill="#161615"
              d="M0 0H3.708V3.708H0z"
              data-name="Rectangle 5"
              transform="rotate(-180 8.652 8.682)"
            />
            <circle
              cx="0.618"
              cy="0.618"
              r="0.618"
              fill="#fff"
              data-name="Ellipse 2"
              transform="translate(14.832 14.893)"
            />
            <path
              fill="#fff"
              d="M0 0H6.18V6.18H0z"
              data-name="Rectangle 6"
              transform="rotate(180 3.09 3.09)"
            />
            <path
              fill="#161615"
              d="M0 0H3.708V3.708H0z"
              data-name="Rectangle 7"
              transform="rotate(180 2.472 2.472)"
            />
            <circle
              cx="0.618"
              cy="0.618"
              r="0.618"
              fill="#fff"
              data-name="Ellipse 3"
              transform="translate(2.472 2.472)"
            />
            <path
              fill="#fff"
              d="M0 0H7.416V1.236H0z"
              data-name="Rectangle 8"
              transform="translate(2.472 8.682)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 9"
              transform="translate(6.18 7.446)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 10"
              transform="translate(3.708 7.446)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V2.472H0z"
              data-name="Rectangle 11"
              transform="translate(7.416 6.21)"
            />
            <path
              fill="#fff"
              d="M0 0H8.652V1.236H0z"
              data-name="Rectangle 12"
              transform="translate(9.888 2.532)"
            />
            <path
              fill="#fff"
              d="M0 0H3.708V1.236H0z"
              data-name="Rectangle 13"
              transform="translate(14.832 3.768)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 14"
              transform="translate(17.304 .06)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 15"
              transform="translate(17.304 5.004)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 16"
              transform="translate(14.832 .06)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 17"
              transform="translate(16.125 1.353)"
            />
            <path
              fill="#fff"
              d="M0 0H3.708V1.236H0z"
              data-name="Rectangle 18"
              transform="translate(11.124 6.24)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 19"
              transform="translate(16.068 6.24)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 20"
              transform="translate(14.832 7.446)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 21"
              transform="translate(17.32 9.933)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 22"
              transform="translate(17.304 7.446)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 23"
              transform="translate(14.832 5.004)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 24"
              transform="translate(12.36 5.004)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 25"
              transform="translate(11.124 3.768)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 26"
              transform="translate(12.36 .06)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 27"
              transform="translate(8.652 .06)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 28"
              transform="translate(12.36 1.296)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 29"
              transform="translate(11.124 1.296)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 30"
              transform="translate(13.596 1.296)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V2.502H0z"
              data-name="Rectangle 31"
              transform="translate(7.416 12.39)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V2.502H0z"
              data-name="Rectangle 32"
              transform="translate(9.888 12.39)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V3.738H0z"
              data-name="Rectangle 33"
              transform="translate(8.652 12.39)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.251H0z"
              data-name="Rectangle 34"
              transform="translate(8.652 11.147)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.251H0z"
              data-name="Rectangle 35"
              transform="translate(9.888 16.121)"
            />
            <path
              fill="#fff"
              d="M0 0H3.708V1.236H0z"
              data-name="Rectangle 36"
              transform="translate(4.944 9.918)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 37"
              transform="translate(2.472 9.918)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 38"
              transform="translate(6.18 11.154)"
            />
            <path
              fill="#fff"
              d="M0 0H1.236V1.236H0z"
              data-name="Rectangle 39"
              transform="translate(1.236 9.918)"
            />
            <path
              fill="#fff"
              d="M0 0H2.803V1.236H0z"
              data-name="Rectangle 40"
              transform="translate(1.236 7.446)"
            />
            <path
              fill="url(#linear-gradient-6)"
              d="M253.366 598.342l2.341 5 2.146-.06-2.015-4.884z"
              data-name="Path 22"
              opacity="0.28"
              transform="translate(-247.185 -598.342)"
            />
            <path
              fill="url(#linear-gradient-7)"
              d="M328.839 697.747h4.83v2.5z"
              data-name="Path 23"
              transform="translate(-315.128 -687.829)"
            />
          </g>
        </g>
        <g data-name="Group 10729" transform="translate(758.266 512.582)">
          <g
            fill="#fff"
            stroke="rgba(0,0,0,0)"
            strokeWidth="1"
            data-name="Group 1915"
          >
            <g data-name="Rectangle 1884">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1885" transform="translate(0 3.284)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1886" transform="translate(0 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1887" transform="translate(0 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1888" transform="translate(0 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1889" transform="translate(0 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1890" transform="translate(0 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1891" transform="translate(0 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1892" transform="translate(0 44.876)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1893" transform="translate(0 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1894" transform="translate(0 51.808)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1895" transform="translate(0 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1896" transform="translate(0 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1897" transform="translate(0 65.672)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1898" transform="translate(0 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1899" transform="translate(0 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1900" transform="translate(0 76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1901" transform="translate(0 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1902" transform="translate(0 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1903" transform="translate(3.284)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1904" transform="translate(3.284 20.796)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1905" transform="translate(3.284 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1906" transform="translate(3.284 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1907" transform="translate(3.284 51.808)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1908" transform="translate(3.284 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1909" transform="translate(3.284 62.389)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1910" transform="translate(3.284 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1911" transform="translate(6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1912" transform="translate(6.932 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1913" transform="translate(6.932 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1914" transform="translate(6.932 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1915" transform="translate(6.932 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1916" transform="translate(6.932 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1917" transform="translate(6.932 37.944)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1918" transform="translate(6.932 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1919" transform="translate(6.932 51.808)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1920" transform="translate(6.932 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1921" transform="translate(6.932 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1922" transform="translate(6.932 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1923" transform="translate(6.932 76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1924" transform="translate(6.932 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1925" transform="translate(10.216)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1926" transform="translate(10.216 6.932)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1927" transform="translate(10.216 10.216)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1928" transform="translate(10.216 13.864)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1929" transform="translate(10.216 20.796)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1930" transform="translate(10.216 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1931" transform="translate(10.216 41.593)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1932" transform="translate(10.216 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1933" transform="translate(10.216 62.389)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1934" transform="translate(10.216 69.321)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1935" transform="translate(10.216 72.605)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1936" transform="translate(10.216 76.253)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1937" transform="translate(10.216 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1938" transform="translate(13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1939" transform="translate(13.864 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1940" transform="translate(13.864 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1941" transform="translate(13.864 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1942" transform="translate(13.864 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1943" transform="translate(13.864 31.012)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1944" transform="translate(13.864 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1945" transform="translate(13.864 51.808)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1946" transform="translate(13.864 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1947" transform="translate(13.864 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1948" transform="translate(13.864 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1949" transform="translate(13.864 76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1950" transform="translate(13.864 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1951" transform="translate(17.148)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1952" transform="translate(17.148 20.796)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1953" transform="translate(17.148 34.66)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1954" transform="translate(17.148 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1955" transform="translate(17.148 41.593)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1956" transform="translate(17.148 44.876)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1957" transform="translate(17.148 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1958" transform="translate(17.148 51.808)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1959" transform="translate(17.148 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1960" transform="translate(17.148 62.389)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1961" transform="translate(17.148 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1962" transform="translate(20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1963" transform="translate(20.796 3.284)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1964" transform="translate(20.796 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1965" transform="translate(20.796 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1966" transform="translate(20.796 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1967" transform="translate(20.796 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1968" transform="translate(20.796 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1969" transform="translate(20.796 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1970" transform="translate(20.796 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1971" transform="translate(20.796 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1972" transform="translate(20.796 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1973" transform="translate(20.796 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1974" transform="translate(20.796 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1975" transform="translate(20.796 65.672)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1976" transform="translate(20.796 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1977" transform="translate(20.796 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1978" transform="translate(20.796 76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1979" transform="translate(20.796 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1980" transform="translate(20.796 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1981" transform="translate(24.08 27.728)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1982" transform="translate(24.08 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1983" transform="translate(24.08 44.876)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1984" transform="translate(24.08 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1985" transform="translate(27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1986" transform="translate(27.728 3.284)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1987" transform="translate(27.728 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1988" transform="translate(27.728 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1989" transform="translate(27.728 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1990" transform="translate(27.728 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1991" transform="translate(27.728 24.08)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1992" transform="translate(27.728 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1993" transform="translate(27.728 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1994" transform="translate(27.728 44.876)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1995" transform="translate(27.728 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1996" transform="translate(27.728 58.74)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 1997" transform="translate(27.728 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1998" transform="translate(27.728 76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 1999" transform="translate(31.012 6.932)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2000" transform="translate(31.012 10.216)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2001" transform="translate(31.012 13.864)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2002" transform="translate(31.012 17.148)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2003" transform="translate(31.012 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2004" transform="translate(31.012 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2005" transform="translate(31.012 41.593)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2006" transform="translate(31.012 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2007" transform="translate(31.012 62.389)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2008" transform="translate(31.012 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2009" transform="translate(34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2010" transform="translate(34.66 3.284)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2011" transform="translate(34.66 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2012" transform="translate(34.66 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2013" transform="translate(34.66 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2014" transform="translate(34.66 37.944)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2015" transform="translate(34.66 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2016" transform="translate(34.66 44.876)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2017" transform="translate(34.66 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2018" transform="translate(34.66 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2019" transform="translate(34.66 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2020" transform="translate(34.66 65.672)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2021" transform="translate(34.66 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2022" transform="translate(34.66 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2023" transform="translate(34.66 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2024" transform="translate(34.66 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2025" transform="translate(37.944)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2026" transform="translate(37.944 6.932)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2027" transform="translate(37.944 17.148)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2028" transform="translate(37.944 27.728)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2029" transform="translate(37.944 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2030" transform="translate(37.944 34.66)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2031" transform="translate(37.944 41.593)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2032" transform="translate(37.944 44.876)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2033" transform="translate(37.944 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2034" transform="translate(37.944 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2035" transform="translate(37.944 58.74)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2036" transform="translate(37.944 62.389)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2037" transform="translate(37.944 72.605)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2038" transform="translate(37.944 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2039" transform="translate(41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2040" transform="translate(41.593 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2041" transform="translate(41.593 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2042" transform="translate(41.593 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2043" transform="translate(41.593 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2044" transform="translate(41.593 37.944)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2045" transform="translate(41.593 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2046" transform="translate(41.593 51.808)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2047" transform="translate(41.593 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2048" transform="translate(41.593 58.74)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2049" transform="translate(41.593 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2050" transform="translate(41.593 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2051" transform="translate(41.593 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2052" transform="translate(44.876 6.932)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2053" transform="translate(44.876 17.148)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2054" transform="translate(44.876 24.08)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2055" transform="translate(44.876 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2056" transform="translate(44.876 34.66)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2057" transform="translate(44.876 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2058" transform="translate(44.876 58.74)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2059" transform="translate(44.876 62.389)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2060" transform="translate(44.876 76.253)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2061" transform="translate(44.876 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2062" transform="translate(48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2063" transform="translate(48.525 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2064" transform="translate(48.525 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2065" transform="translate(48.525 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2066" transform="translate(48.525 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2067" transform="translate(48.525 24.08)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2068" transform="translate(48.525 44.876)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2069" transform="translate(48.525 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2070" transform="translate(48.525 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2071" transform="translate(48.525 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2072" transform="translate(48.525 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2073" transform="translate(48.525 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2074" transform="translate(51.808 3.284)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2075" transform="translate(51.808 6.932)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2076" transform="translate(51.808 13.864)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2077" transform="translate(51.808 17.148)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2078" transform="translate(51.808 27.728)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2079" transform="translate(51.808 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2080" transform="translate(51.808 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2081" transform="translate(51.808 51.808)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2082" transform="translate(51.808 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2083" transform="translate(51.808 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2084" transform="translate(55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2085" transform="translate(55.457 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2086" transform="translate(55.457 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2087" transform="translate(55.457 24.08)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2088" transform="translate(55.457 31.012)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2089" transform="translate(55.457 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2090" transform="translate(55.457 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2091" transform="translate(55.457 58.74)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2092" transform="translate(55.457 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2093" transform="translate(55.457 65.672)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2094" transform="translate(55.457 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2095" transform="translate(55.457 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2096" transform="translate(55.457 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2097" transform="translate(55.457 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2098" transform="translate(58.74 27.728)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2099" transform="translate(58.74 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2100" transform="translate(58.74 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2101" transform="translate(58.74 41.593)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2102" transform="translate(58.74 44.876)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2103" transform="translate(58.74 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2104" transform="translate(58.74 69.321)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2105" transform="translate(58.74 83.185)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2106" transform="translate(62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2107" transform="translate(62.389 3.284)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2108" transform="translate(62.389 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2109" transform="translate(62.389 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2110" transform="translate(62.389 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2111" transform="translate(62.389 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2112" transform="translate(62.389 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2113" transform="translate(62.389 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2114" transform="translate(62.389 31.012)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2115" transform="translate(62.389 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2116" transform="translate(62.389 37.944)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2117" transform="translate(62.389 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2118" transform="translate(62.389 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2119" transform="translate(62.389 51.808)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2120" transform="translate(62.389 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2121" transform="translate(62.389 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2122" transform="translate(62.389 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2123" transform="translate(62.389 72.605)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2124" transform="translate(62.389 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2125" transform="translate(62.389 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2126" transform="translate(65.672)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2127" transform="translate(65.672 20.796)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2128" transform="translate(65.672 27.728)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2129" transform="translate(65.672 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2130" transform="translate(65.672 34.66)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2131" transform="translate(65.672 41.593)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2132" transform="translate(65.672 44.876)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2133" transform="translate(65.672 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2134" transform="translate(65.672 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2135" transform="translate(65.672 69.321)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2136" transform="translate(65.672 79.537)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2137" transform="translate(69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2138" transform="translate(69.321 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2139" transform="translate(69.321 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2140" transform="translate(69.321 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2141" transform="translate(69.321 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2142" transform="translate(69.321 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2143" transform="translate(69.321 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2144" transform="translate(69.321 37.944)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2145" transform="translate(69.321 48.525)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2146" transform="translate(69.321 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2147" transform="translate(69.321 58.74)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2148" transform="translate(69.321 62.389)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2149" transform="translate(69.321 65.672)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2150" transform="translate(69.321 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2151" transform="translate(69.321 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2152" transform="translate(69.321 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2153" transform="translate(72.605)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2154" transform="translate(72.605 6.932)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2155" transform="translate(72.605 10.216)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2156" transform="translate(72.605 13.864)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2157" transform="translate(72.605 20.796)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2158" transform="translate(72.605 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2159" transform="translate(72.605 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2160" transform="translate(72.605 48.525)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2161" transform="translate(72.605 69.321)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2162" transform="translate(72.605 72.605)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2163" transform="translate(72.605 76.253)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2164" transform="translate(76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2165" transform="translate(76.253 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2166" transform="translate(76.253 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2167" transform="translate(76.253 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2168" transform="translate(76.253 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2169" transform="translate(76.253 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2170" transform="translate(76.253 44.876)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2171" transform="translate(76.253 65.672)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2172" transform="translate(76.253 69.321)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2173" transform="translate(76.253 76.253)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2174" transform="translate(76.253 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2175" transform="translate(79.537)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2176" transform="translate(79.537 20.796)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2177" transform="translate(79.537 27.728)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2178" transform="translate(79.537 31.012)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2179" transform="translate(79.537 34.66)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2180" transform="translate(79.537 37.944)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2181" transform="translate(79.537 51.808)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2182" transform="translate(79.537 55.457)">
              <path stroke="none" d="M0 0H3.648V3.284H0z" />
              <path fill="none" d="M0.5 0.5H3.148V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2183" transform="translate(79.537 58.74)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2184" transform="translate(79.537 79.537)">
              <path stroke="none" d="M0 0H3.648V3.648H0z" />
              <path fill="none" d="M0.5 0.5H3.148V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2185" transform="translate(83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2186" transform="translate(83.185 3.284)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2187" transform="translate(83.185 6.932)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2188" transform="translate(83.185 10.216)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2189" transform="translate(83.185 13.864)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2190" transform="translate(83.185 17.148)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2191" transform="translate(83.185 20.796)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2192" transform="translate(83.185 27.728)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2193" transform="translate(83.185 31.012)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2194" transform="translate(83.185 34.66)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2195" transform="translate(83.185 41.593)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2196" transform="translate(83.185 51.808)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2197" transform="translate(83.185 55.457)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
            <g data-name="Rectangle 2198" transform="translate(83.185 79.537)">
              <path stroke="none" d="M0 0H3.284V3.648H0z" />
              <path fill="none" d="M0.5 0.5H2.784V3.148H0.5z" />
            </g>
            <g data-name="Rectangle 2199" transform="translate(83.185 83.185)">
              <path stroke="none" d="M0 0H3.284V3.284H0z" />
              <path fill="none" d="M0.5 0.5H2.784V2.784H0.5z" />
            </g>
          </g>
        </g>
        <path
          fill="rgba(255,255,255,0.49)"
          d="M4206.953 2511l60.54 444.932h106.119V2511z"
          data-name="Path 1524"
          opacity="0.398"
          transform="translate(-3439.322 -2270)"
        />

        <circle
          cx="65.5"
          cy="65.5"
          r="65.5"
          fill="url(#pattern)"
          data-name="Ellipse 351"
          transform="translate(736 287)"
        />
      </g>
    </svg>
  );
}

export default UserTaskDetail;
