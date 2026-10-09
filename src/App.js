import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Page from "./pages/Page";
import Legal from "./pages/Legal";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import { applyConsent, getConsent, setConsent } from "./analytics";
import './App.css'

const ErrorPage = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>404: page not found</h1>
    </div>
  );
};

function App() {
  const [showBanner, setShowBanner] = useState(() => !getConsent());

  useEffect(() => {
    const consent = getConsent();
    if (consent) applyConsent(consent);
  }, []);

  function handleChoice(value) {
    setConsent(value);
    setShowBanner(false);
  }

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/legal" component={Legal} />
          <Route exact path="/:id" component={Page} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
      <Footer onCookieSettings={() => setShowBanner(true)} />
      {showBanner && <CookieBanner onChoice={handleChoice} />}
    </>
  );
}

export default App;
