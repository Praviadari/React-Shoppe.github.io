import react from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./header";
import Home from "./home";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
