export const ChevronLeftCircleSVG = (size: number, color: string) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="chevron_left_circle">
      <path
        id="Vector"
        d="M31.3333 18C31.3333 21.5362 29.9286 24.9276 27.4281 27.4281C24.9276 29.9285 21.5362 31.3333 18 31.3333C16.249 31.3333 14.5152 30.9884 12.8976 30.3184C11.2799 29.6483 9.81003 28.6662 8.57191 27.4281C6.07143 24.9276 4.66667 21.5362 4.66667 18C4.66667 14.4637 6.07143 11.0724 8.57191 8.57187C11.0724 6.07138 14.4638 4.66663 18 4.66663C19.751 4.66663 21.4848 5.0115 23.1025 5.68157C24.7201 6.35163 26.19 7.33375 27.4281 8.57187C28.6662 9.80998 29.6483 11.2798 30.3184 12.8975C30.9885 14.5152 31.3333 16.249 31.3333 18ZM22.5333 24.1333L16.4 18L22.5333 11.8666L20.6667 9.99996L12.6667 18L20.6667 26L22.5333 24.1333Z"
        fill={color}
      />
    </g>
    <defs>
      <filter
        id="filter0_d_89_3504"
        x="-2"
        y="-2"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_89_3504"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_89_3504"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
