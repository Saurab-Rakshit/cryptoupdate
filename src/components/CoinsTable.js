import React, { useState, useEffect } from "react";
import { CoinList } from "../config/api";
import axios from "axios";
import { CryptoState } from "../CryptoContext";
import {
  Container,
  createTheme,
  TableContainer,
  Table,
  TextField,
  ThemeProvider,
  Typography,
  LinearProgress,
  TableHead,
  TableRow,
  TableCell,
  TableBody,  
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@material-ui/lab";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(()=>({
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
  pagination:{
    "& .MuiPaginationItem-root":{
      color:"gold",
    },
  }
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page,setPage]=useState(1);
  const navigate = useNavigate();
  const classes = useStyles()

  const { currency,currencySymbol } = CryptoState();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    // console.log(data);
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]); //whenever the currency changes we gonna call this use state

  // for dark theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleSearch = ()=>{
    return coins.filter(
      (coin)=>
      coin.name.toLowerCase().includes(search)||coin.symbol.toLowerCase().includes(search)
    );    
  };  


  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices By Market Cap
        </Typography>
        <TextField
          label="Search for Cryptocurrency...."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgrounColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coins", "Price", "24hr Change", "Market Cap"].map(
                    (head) => (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: 700,
                          fontFamily: "Montserrat",
                        }}
                        key={head}
                        // align={head === "Coins" ? "" : "right"}
                        align="left"                        
                        // "center","inherit","justify","left","right"
                      >
                        {head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              {/* So this handleSearch function return us the array of filtered coins if we haven't type anything inside the search box it will return all of the coins of array*/}
              <TableBody>{handleSearch().slice((page-1)*10,(page-1)*10 +10).map((row)=>{
                const profit = row.price_change_percentage_24h>0; 
                return(
                  <TableRow
                    onClick={()=>navigate(`/coins/${row.id}`)}
                    key={row.name}
                    className={classes.row}
                  >
                    <TableCell 
                      component='th' 
                      scope='row'
                      style={{
                        display:'flex',
                        gap:15  
                      }}
                    >
                      <img 
                        src={row.image}
                        alt={row.name}
                        height="50"
                        style={{marginBottom:10}}  
                      />
                      <div style={{display:'flex',flexDirection:'column'}}>
                        <span
                          style={{textTransform:'uppercase',fontSize:15}}
                        >{row.symbol}</span>
                        <span style={{color:'darkgray'}} >{row.name}</span>
                      </div>
                    </TableCell>
                    <TableCell align='right'>
                      {currencySymbol}{' '}
                      {numberWithCommas(row.current_price.toFixed(2))}
                    </TableCell>
                    <TableCell 
                      align='right'
                      style={{
                        color:profit?"green":"red"
                      }}
                    >
                      {profit && "+"}
                      {row.price_change_percentage_24h.toFixed(2)}%
                    </TableCell>
                    <TableCell align='right'>
                      {currencySymbol}
                      {numberWithCommas(row.market_cap.toString().slice(0,-6))}M
                    </TableCell>
                  </TableRow>
                )
              })}</TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          // count={(handleSearch()?.length/10).toFixed(0)}
          count={10}
          style={{
            padding:20,
            width:"100%",
            display:'flex',
            justifyContent:'center'
          }}
          classes={{ul:classes.pagination}}
          onChange={(_,value)=>{
            setPage(value);
            window.scroll(0,450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;

/* import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  createTheme,
  ThemeProvider,
  Container,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  rowStyle: {
    backgroundColor: "#16171a",
    cursor: "pointer",      
    fontFamily: "Montserrat",
  },
}));

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  //currency passed in the async funtion is comming from CryptoContext component.
  const { currency } = CryptoState();

  const fetchCoins = async () => {
    setLoading(true); //before fetching data from API set it to true.
    const { data } = await axios.get(CoinList(currency)); //{data} destructuring the data from inside of our API
    console.log(data);
    setCoins(data); //passing the data of the coins to coins state.
    setLoading(false); //After fetching data from API set it to false.
  };

  
  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      main: "#fff",
    },
    type: "dark",
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) || //searching with Currency Name
        coin.symbol.toLowerCase().includes(search) //searching with Currency Symbol
    );
  };

  const useStyles = makeStyles(() => ({
    rowStyle: {
      backgroundColor: "#16171a",
      cursor: "pointer",      
      fontFamily: "Montserrat",
    },
  }));

  const classes = useStyles();


  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{
            fontFamily: "Montserrat",
            margin: 18,
            textTransform: "capitalize",
          }}
        >
          cryptocurrency prices by market cap
        </Typography>
        <TextField
          label="Search for a Crypto Currency..."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          InputLabelProps={{ style: { color: "#a9a9a9" } }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>          
          {loading ? (
            <LinearProgress style={{ backgrounColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24hr Change", "Market Cap"].map(
                    (head) => (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: 700,
                          fontFamily: "Montserrat",
                        }}
                        key={head}
                        align={head === "Coin" ? "" : "right"}
                      >
                        {head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>         
              <TableBody>
              // this handel
                {handleSearch().map((row) => {
                  let profit = row.price_change_percentage_24h > 0;
                  return (
                    <TableRow
                      onClick={() => navigate(`/coins/${row.id}`)}
                      className={classes.row}
                      key={row.name}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{display:'flex',gap:15}}
                      >
                        <img
                         src={row?.image}
                         alt={row.name}
                         height='50'
                         style={{marginBottom:10}}                         
                        />                         
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer> 
      </Container>
    </ThemeProvider>
  );
};
export default CoinsTable; */

/* import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import { CoinList } from "../config/api";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CoinsTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol } = CryptoState();

  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    },
  });

  const classes = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    console.log(data);

    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search For a Crypto Currency.."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {coins.slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
} */
