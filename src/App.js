import logo from "./logo.svg";
import "./App.css";
import Auth from "./Components/Auth/auth";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/dashboard";
import axios from "axios";
export let axiosInstance = axios.create({
  baseURL: "http://51.75.253.157:7354/api",
  Headers: {
    "Content-Type": "application/json",
  },
});
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Auth} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
