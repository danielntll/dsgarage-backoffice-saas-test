import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/global.css";
import "./theme/authpages.css";
import { ProviderContextLanguage } from "./context/contextLanguage";
import { ProviderContextToast } from "./context/systemEvents/contextToast";
import { AuthContextProvider } from "./context/contextAuth";
import Menu from "./components/Menu/Menu";
import {
  route_GalleryPage,
  route_HomePage,
  route_ImpostazioniPage,
  route_LoginPage,
  route_PromotionsPage,
  route_ServicesPage,
  route_CarPromotionPage,
} from "./routes/singleRoute";
import HomePage from "./pages/Home/HomePage";
import ImpostazioniPage from "./pages/Impostazioni/ImpostazioniPage";
import { loginRoutes } from "./routes/routes";
import LoginPage from "./pages/Auth/Login_Page/LoginPage";
import GalleryPage from "./pages/Gallery/Gallery";
import PromotionsPage from "./pages/Promotions/PromotionsPage";
import ServicesPage from "./pages/Services/ServicesPage";
import CarPromotionPage from "./pages/Car Promotion/CarPromotionPage";

setupIonicReact({
  rippleEffect: false,
  mode: "ios",
});

const App: React.FC = () => {
  //VARIABLES ------------------------
  console.log("TEST - TEST");
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonApp>
      <IonReactRouter>
        <ProviderContextLanguage>
          <ProviderContextToast>
            <AuthContextProvider />
          </ProviderContextToast>
        </ProviderContextLanguage>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

export const authenticatedRoutesOutlet = () => {
  //VARIABLES ------------------------
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonSplitPane contentId="main">
      <Menu />
      <IonRouterOutlet id="main">
        {/* ---- Auto Usate ---- */}
        <Route exact path={route_CarPromotionPage.path}>
          <CarPromotionPage />
        </Route>
        {/* ---- Servizi ---- */}
        <Route exact path={route_ServicesPage.path}>
          <ServicesPage />
        </Route>
        {/* ---- Promozioni ---- */}
        <Route exact path={route_PromotionsPage.path}>
          <PromotionsPage />
        </Route>
        {/* ---- Galleria ---- */}
        <Route exact path={route_GalleryPage.path}>
          <GalleryPage />
        </Route>
        {/* ---- Home ---- */}
        <Route exact path={route_HomePage.path}>
          <HomePage />
        </Route>
        {/* ---- Impostazioni ---- */}
        <Route exact path={route_ImpostazioniPage.path}>
          <ImpostazioniPage />
        </Route>

        {/* --------- REDIRECT --------- */}
        <Route exact path="/">
          <Redirect to={route_HomePage.path} />
        </Route>
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export const loginRoutesOutlet = () => {
  //VARIABLES ------------------------
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonRouterOutlet>
      {/* --------- REDIRECT --------- */}
      <Route exact path="/">
        <Redirect to={loginRoutes.route_LoginPage.path} />
      </Route>

      {/* --------- ROUTES ----------- */}
      {/* ---- Login ---- */}
      <Route exact path={route_LoginPage.path}>
        <LoginPage />
      </Route>
    </IonRouterOutlet>
  );
};
