import React from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Select,
  MenuItem,  
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  //importing the states which have created in CryptoContext .
  const {currency,setCurrency} = CryptoState();
  // console.log(currency);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
              variant="h6"
              className={classes.title}
            >
              Crytptoverse
              <Select
                variant="outlined"
                style={{
                  width: 100,
                  height: 40,                  
                  position:'absolute',
                  right:5
                }}
                value={currency}
                onChange={(e)=>setCurrency(e.target.value)}
              >
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"INR"}>INR</MenuItem>
              </Select>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
