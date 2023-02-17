import React, { createContext, useContext, useState,useEffect } from 'react'

const Crypto = createContext();

const CryptoContext = ({children}) => {
  
    const [currency,setCurrency] = useState('INR')
    const [currencySymbol,setCurrencySymbol] = useState('&#x20B9')
  
    //this useEffect will run every time whenever the currency changes so "currency" state is passed in the dependency array.
    useEffect(()=>{
      currency === 'INR' ? setCurrencySymbol('Rs.'):setCurrencySymbol('$')
    },[currency])

  return (
    <Crypto.Provider value={{currency,currencySymbol,setCurrency}} >
        {children}
    </Crypto.Provider>
  )
}

export default CryptoContext
//to export our state into whole of our app we are gonna make use of useContext() hook.

export const CryptoState = ()=>{
  return useContext(Crypto)
}

