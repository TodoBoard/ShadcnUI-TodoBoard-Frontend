export function TermsHero() {
  return (
    <div className="text-center space-y-8 mb-16">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold">
          <span className="relative">
            <span className="text-gradient bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
              Terms of Service
            </span>
            <svg
              className="absolute -bottom-5 w-full left-0"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.5C47.6667 2.16667 154.4 -2.4 199 6"
                stroke="url(#paint0_linear)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="1"
                  y1="5"
                  x2="199"
                  y2="5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D247BF" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>
      </div>
    </div>
  );
}
