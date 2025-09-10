/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        instrument: ['"Instrument Serif"', "serif"],
        pixer: ["Pixer", "sans-serif"],
      },
      boxShadow: {
        "border-green": "0px 0px 17px 2px rgba(50, 111, 88, 1)", // Custom light shadow
        "button-shadow": "0px 0px 21.5px 0px rgba(0, 255, 174, 0.25)",
        "stats-shadow": "4px 4px 16px 0px rgba(51, 159, 135, 0.47)",
        "tooltip-shadow": "0px 4px 18.1px 0px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        "fund-footer": "1.5rem",
        "blur-hover": "25.45px",
        "faq-modal": "2rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gridTemplateColumns: {
        carouselLayout: "1fr 13.125rem",
        sidebarLandscapeDetailsLayout: "1fr 9rem",
      },
      colors: {
        background: "var(--background)",
        greyModal: "rgba(96, 96, 96, 0.44)",
        footerBg: "rgba(152, 217, 202, 0.15)",
        headerBg: " rgba(39, 39, 39, 1)",
        hoverCardColor: "rgba(108, 139, 132, 0.21)",
        cardGrey: "rgba(48, 48, 48, 1)",
        cardGreyBounty: "var(--card-grey-bounty)",
        whiteGrey: "var(--white-grey)",
        landscapeRedDark: "#B33030",
        landscapeYellowDark: "var(--landscape-yellow-dark)",
        landscapeYellowLight: "var(--landscape-yellow-light)",
        foreground: "var(--foreground)",
        textPrimary: "var(--text-primary)",
        textStats: "var(--text-stats)",
        textStatsLabel: "var(--text-stats-label)",
        textSupportHeading: "var(--text-support-heading)",
        textHeading: "var(--text-heading)",
        headingGrey: "var(--headingGrey",
        innerGrey: "var(--innerGrey)",
        subHeadingGrey: "var(--subHeadingGrey)",
        coreBlue: "#76C8E8",
        coreRed: "#BA2C2C",
        coreYellow: "#DFA40B",
        coreGreen: "#36B67A",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "radial-custom":
          "radial-gradient(farthest-corner at 40px 40px, rgba(50, 111, 88, 1) 0%, rgba(16, 18, 15, 1) 50%, rgba(16, 18, 15, 1) 100%)",
        "fund-mobile-gradient":
          "linear-gradient(180deg, #1C4032 0%, #050505 100%)",
        "bg-lg":
          "linear-gradient(180deg, var(--background) 100%, var(--background) 100%)",
        "mint-mobile-gradient":
          "linear-gradient(180deg, #40361C 0%, #050505 100%);",
        "pillsMap-upperGradient":
          " linear-gradient(180deg, #10120F 0%, #10120F 67.54%, rgba(16, 18, 15, 0.00) 100%)",
        "pillsMap-downwardGradient":
          "linear-gradient(0deg, #10120F 0%, #10120F 67.54%, rgba(16, 18, 15, 0.00) 100%)",
        "navigation-gradient":
          "radial-gradient(222.11% 65.82% at 50% 100%, rgba(50, 95, 86, 0.33) 0%, rgba(50, 95, 86, 0.00) 100%), #161616",
        "nft-gradient":
          "radial-gradient(50% 50% at 50% 50%, #0FA 0%, rgba(0, 255, 170, 0.00) 100%)",
        "right-box-gradient":
          "linear-gradient(90deg, rgba(27, 27, 27, 0.00) 1.81%, #1B1B1B 100%)",
        "right-box-green-gradient":
          "linear-gradient(90deg, rgba(80, 108, 102, 0), #061612 100%)",
        "text-gradient":
          "linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(39, 38, 38, 1) 100%)",
      },

      animation: {
        rings: "rings 4s linear infinite",
      },
      keyframes: {
        rings: {
          "0%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1.5)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
