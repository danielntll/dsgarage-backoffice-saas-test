import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { text } from "./text";

import styles from "./RegistrazionePage.module.css";

import { useContext, useState } from "react";
import {
  eyeOffOutline,
  eyeOutline,
  informationCircleOutline,
  logInOutline,
} from "ionicons/icons";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
} from "firebase/auth";

import { AuthContext } from "../../../context/contextAuth";
import { ContextLanguage } from "../../../context/contextLanguage";
import { ContextToast } from "../../../context/systemEvents/contextToast";
import { route_LoginPage } from "../../../routes/singleRoute";

const RegistrazionePage: React.FC = () => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { auth } = useContext(AuthContext);
  const { toast } = useContext(ContextToast);
  //CONDITIONS -----------------------
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repPassword, setRepPassword] = useState<string>("");
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  //FUNCTIONS ------------------------
  const handleDoRegistration = async (e: any) => {
    e.preventDefault();
    // 1. Check dimensioni password
    if (password.length < 6) {
      toast("warning", text[l].info__password, 3000);
    } else {
      // 2. Check password uguali
      if (password !== repPassword) {
        toast("warning", text[l].info__checkPassword, 3000);
      } else {
        // 4. ---------  Effettua registrazione ---------
        await createUserWithEmailAndPassword(auth, email, password)
          .then((data) => {
            sendVerifyEmail(data.user);
          })
          .catch((error) => {
            // 5. Feedback se la email è stata già utilizzata
            if (error.code === "auth/email-already-in-use") {
              toast("danger", text[l].error_user_already_exits);
            } else {
              // 6. Feedback per un errore generico
              toast("danger", text[l].error_generico);
            }
          });
      }
    }
  };
  const sendVerifyEmail = async (user: User) => {
    try {
      sendEmailVerification(user);
    } catch (error) {
      console.log(error);
      toast("danger", text[l].error_generico);
    }
  };
  const showPassword = () => {
    setVisiblePassword(!visiblePassword);
  };
  const openTutorial = () => {
    setIsModalTutorialOpen(true);
  };
  // EXTRA UI ------------------------
  const [isModalTutorialOpen, setIsModalTutorialOpen] =
    useState<boolean>(false);
  //RETURN COMPONENT -----------------
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              text={route_LoginPage.tab[l]}
              defaultHref={route_LoginPage.path}
            />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => openTutorial()}>
              {text[l].btn_tutorial}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar></IonToolbar>
        </IonHeader>
        {/* ----------------- PAGE CONTENT ------------------*/}
        <div className={styles.content}>
          <div className={"container__logo"}>
            <img
              src="./assets/logo.png"
              alt="MenuShare logo"
              className={"logo"}
            />
          </div>
          <div className="ion-padding ion-text-center">
            <IonText className={"pageSubtitle"}>{text[l].pageSubtitle}</IonText>
          </div>
          <div className={styles.container__registrazione}>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{text[l].pageTitle}</IonCardTitle>
              </IonCardHeader>
              <form onSubmit={handleDoRegistration}>
                <IonList inset>
                  <IonItem>
                    <IonInput
                      required
                      clearInput
                      label={text[l].input__email.label}
                      labelPlacement="stacked"
                      type="email"
                      placeholder={text[l].input__email.ph}
                      value={email}
                      onIonInput={(e) => {
                        setEmail(e.detail.value!);
                      }}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <IonInput
                        required
                        clearInput
                        label={text[l].input__password.label}
                        placeholder={text[l].input__password.ph}
                        labelPlacement="stacked"
                        type={visiblePassword ? "text" : "password"}
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                      />
                    </IonLabel>
                    <IonButton
                      slot="end"
                      size="small"
                      fill="clear"
                      onClick={showPassword}
                    >
                      <IonIcon
                        icon={visiblePassword ? eyeOffOutline : eyeOutline}
                      />
                    </IonButton>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <IonInput
                        required
                        clearInput
                        label={text[l].input__repPassword.label}
                        placeholder={text[l].input__repPassword.ph}
                        labelPlacement="stacked"
                        type={visiblePassword ? "text" : "password"}
                        value={repPassword}
                        onIonInput={(e) => setRepPassword(e.detail.value!)}
                      />
                    </IonLabel>
                  </IonItem>
                </IonList>

                <p className="ion-padding-horizontal">
                  <IonIcon
                    icon={informationCircleOutline}
                    color="warning"
                    className="icon-margin-right"
                  />
                  <span className={"info-text"}>{text[l].info__password}</span>
                </p>

                <div className="ion-padding">
                  <IonButton fill="solid" expand="block" type="submit">
                    {text[l].btn__registrati}
                    <IonIcon icon={logInOutline} className="icon-margin-left" />
                  </IonButton>
                </div>
              </form>
            </IonCard>
          </div>
        </div>
        {/* ----------------- EXTRA UI ----------------------*/}
      </IonContent>
    </IonPage>
  );
};

export default RegistrazionePage;
