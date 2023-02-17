import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

const useStyle = makeStyles(() => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));

const numberWithCommas = (x)=>{
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");      
}

const Carousel = () => {
  
  const classes = useStyle();
  const { currency,currencySymbol } = CryptoState();
  const [trending, setTrending] = useState([]);
  
  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    setTrending(data)
  };

  // console.log(trending);

  useEffect(()=>{
    //We call this fucntion whenever the component is 1st time rendered.
    fetchTrendingCoins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currency])
    // whenever the currency changes I want to fetch the coins again so "currency" state is passed in dependency array of useEffect in above .
        
    // all of the trending coins gonna come here from trending state because it holds the array of trending coins data in it.
    const items = trending.map((coin)=>{
        
    //percentage change of coin in 24hr
    let profit = coin.price_change_percentage_24h >= 0 ; 

      return(
        <Link 
          className={classes.carouselItem} 
          to={`/coins/${coin.id}`}            
        >
          <img 
            src={coin?.image}
            alt={coin.name}
            height="80"
            style={{marginBottom:10}}
          />
          <span>
            {coin?.symbol}
            &nbsp;
            <span style={{
              color:profit>0?"#12AD2B":"red",
              fontWeight:500
            }} 
            >
              {profit && "+"} 
              {coin?.price_change_percentage_24h?.toFixed(2)}%
            </span>  
          </span>
          {/* for displaying the Price */}
          <span style={{fontSize:22,fontWeight:500}} >
            {currencySymbol} {numberWithCommas(coin?.current_price.toFixed(2))}
          </span>
        </Link>
      )
    });
    
    const responsive ={
      0:{
        item:2,
      },
      512:{
        item:4,
      }
    };

    return (
      <div className={classes.carousel}>
        <AliceCarousel 
          mouseTracking 
          infinite 
          autoPlayInterval={1000}
          animationDuration={1500}
          disableDotsControls
          disableButtonsControls
          responsive={responsive}
          autoPlay
          items={items}
        />
      </div>
    )
};

export default Carousel;
