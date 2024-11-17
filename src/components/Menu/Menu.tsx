import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import "./Menu.css";
import { appRoutes } from "../../routes/routes";
import { useContext } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { AuthContext } from "../../context/contextAuth";

const Menu: React.FC = () => {
  //VARIABLES ------------------------
  const location = useLocation();
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Menu</IonListHeader>
          <IonNote>{authenticateUser?.email}</IonNote>
          {appRoutes.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.path ? "selected" : ""
                  }
                  routerLink={appPage.path}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    color={
                      location.pathname === appPage.path ? "primary" : "medium"
                    }
                    icon={
                      location.pathname === appPage.path
                        ? appPage.icons.active
                        : appPage.icons.notActive
                    }
                  />
                  <IonLabel
                    color={location.pathname === appPage.path ? "primary" : ""}
                  >
                    {appPage.tab[l]}
                  </IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
