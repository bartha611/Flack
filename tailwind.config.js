module.exports = {
  purge: {
    enabled: true,
    content: ["client/**/*.js", "client/**/*.jsx"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: (theme) => ({
        dashboard: "calc(100% - 55px)",
      }),
      width: (theme) => ({
        dashboard: "calc(100% - 240px)",
      }),
    },
  },
  variants: {
    extend: {
      appearance: ["responsive", "group-hover"],
      display: ["responsive", "group-hover"],
    },
  },
  plugins: [],
};
