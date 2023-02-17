import { makeStyles } from "@material-ui/core/styles";
import './App.css';
import Header from './components/Header';
import Homepage from './Pages/Homepage';
import Coinpage from './Pages/CoinPage';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

const useStyles = makeStyles(()=>({
  App:{
    backgroundColor:'#14161a',
    color:'#fff',
    minHeight:"100vh"
  }
}));

const App = ()=> {   

  const classes = useStyles()

  return (        
    <>
    <BrowserRouter>
      <div className={classes.App} >
        <Header/>
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/coins/:id" element={<Coinpage />} />                  
        </Routes>        
      </div>      
    </BrowserRouter>
    </>
  );
};
export default App;
/* <BrowserRouter>
    <div className={classes.App} >
      <Header/>
      <Route path="/" element={<Homepage />} />
      <Route path="/coins/:id" element={<Coinpage />} />                  
    </div>
</BrowserRouter> */