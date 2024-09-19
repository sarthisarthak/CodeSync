import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Navbar = () => {
  const styles = {
    color: "white",
    fontSize: "13px",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#4aed88",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2b824c",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2b824c",
    },
    ".MuiSelect-icon": {
      color: "#4aed88",
    },
  };
  return (
    <div className="navbar">
      <div className="languageSelect">
        <InputLabel id="demo-simple-select-label" sx={styles}>
          Language
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="language"
          //   value="C"
          //   onChange={handleLanguageChange}
          sx={{
            ...styles,
            height: "35px",
            width: "95px",
          }}
        >
          <MenuItem value="c">C</MenuItem>
          <MenuItem value="cpp">C++</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="java">Java</MenuItem>
        </Select>
      </div>
      <div className="fontSizeSelect">
        <label style={{ fontSize: "15px" }}>Font Size</label>
        <input
          //   value={fontSize}
          //   onChange={handleFontSizeChange}
          type="range"
          min="12"
          max="30"
          step="2"
        />
      </div>
      <div className="themeSelect">
        <InputLabel id="themeLabel" sx={styles}>
          Theme
        </InputLabel>
        <Select
          labelId="themeLabel"
          id="theme"
          //   value={theme}
          //   onChange={handleThemeChange}
          sx={{
            ...styles,
            height: "35px",
            width: "95px",
          }}
        >
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="light">Light</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default Navbar;
