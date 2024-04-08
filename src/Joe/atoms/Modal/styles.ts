const styles = {
  overlay: {
    background: "rgba(255, 255, 255, 0.8)",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    pointerEvents: "all",
    position: "fixed",
    zIndex: /*modalZIndex*/ 10000,
    alignItems: "center",
    svg: {
      fill: "var(--textColor)",
      filter: "none",
    },
  },

  wrapper: {
    width: "95%",
    maxWidth: ["720px", null, null, null, null, "960px"],
    maxHeight: "95%",
    margin: "0 auto",
    flexDirection: "column",
    backgroundImage:
      "linear-gradient( 45deg, var(--contextGradientColor1), var(--contextGradientColor2) )",
    boxShadow: "var(--overlayShadow)",
    " > *": {
      width: "100%",
    },
  },

  largeWrapper: {
    width: "95%",
    maxWidth: "1000px",
    maxHeight: "95%",
    margin: "0 auto",
    flexDirection: "column",
    backgroundImage:
      "linear-gradient( 45deg, var(--contextGradientColor1), var(--contextGradientColor2) )",
    boxShadow: "var(--overlayShadow)",
    " > *": {
      width: "100%",
    },
  },

  headerWrapper: {
    padding: "1.5rem 1.5rem 0 1.5rem",
    order: 1,
  },

  header: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    color: "var(--textColor)",
    borderBottom: "1px solid",
    borderColor: "var(--modalLine)",
    pb: "1.5rem",
  },

  headerContent: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },

  heading: {
    color: "var(--textColor)",
    display: "flex",
    alignItems: "center",
  },

  content: {
    color: "var(--textColor)",
    position: "relative",
    padding: "1.5rem",
    flex: 1,
    order: 2,
    overflow: "auto",
  },
};

export default styles;
