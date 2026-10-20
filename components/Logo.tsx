/* the logo mark is defined once as an SVG symbol and reused via <use href="#lg"> */
export function LogoSymbol() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <mask id="lgm" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
          <rect width="400" height="400" fill="#fff" />
          <rect x="188.5" y="90.3" width="110" height="73.9" fill="#000" />
        </mask>
      </defs>
      <symbol id="lg" viewBox="95 17 250 250">
        <rect x="95" y="17" width="250" height="250" rx="62" fill="#0B1B3F" />
        <circle cx="188.5" cy="127.3" r="63.6" fill="none" stroke="#FFFFFF" strokeWidth="37.6" mask="url(#lgm)" />
        <polygon points="258,210 298,210 334,240 222,240" fill="#314A3E" />
        <rect x="258" y="45" width="40" height="165" fill="#B6F23A" />
        <g fill="#0B1B3F">
          <circle cx="278" cy="118" r="11" />
          <rect x="267" y="131" width="22" height="51" rx="7" />
          <rect x="268" y="176" width="8" height="34" />
          <rect x="280" y="176" width="8" height="34" />
        </g>
      </symbol>
    </svg>
  );
}

export function LogoMark() {
  return <svg aria-hidden="true"><use href="#lg" /></svg>;
}
