import { typeAvailableLanguagesModel } from "../../types/typeAvailableLanguage";

export const text: typeAvailableLanguagesModel = {
  it_IT: {
    pageTitle: "Impostazioni",
    changeEmail: "Modifica email di accesso",
    input__email: {
      label: "Inserisci la nuova email",
      ph: "nuova@email.com",
    },
    changeTutorial:
      "Vi verrà inviata una email di conferma per confermare l'identità. Finchè non verrà confermata, l'accesso rimarrà registrato sulla email inserita durante la fase di registrazione.",
    btn__change: "Cambia Email",
    warn_emailEmpty: "Inserire una mail prima di procedere.",
    btn__close: "Chiudi",
    success_changeEmail: "Email cambiata con successo:",
    error_changeEmail:
      "Ops! Errore durante il cambio email. Riprovare più tardi.",
    btn__logout: "Logout",
    modalTitleLogout: "Logout",
    paragraphLogout: "Sei sicuro di voler effettuare il logout?",
    changePasswordTitle: "Modifica password di accesso",
    input__password: {
      label: "Inserisci la nuova password",
      ph: "******",
    },
    input__password__confirm: {
      label: "Conferma la password",
      ph: "******",
    },
    info__password: "La password deve contenere almeno 6 caratteri.",
    changePasswordTutorial:
      "Una volta confermato verrete scollegati dall'account per permettervi di effettuare l'accesso con la nuova password.",
    btn__change__password: "Cambia password",
    warning__passLegth: "La password deve contenere almeno 6 caratteri.",
    success__passwordCambiata: "La sua password è stata cambiata con successo!",
    danger__passwordCambiata:
      "Ops, qualcosa è andato storto con il cambio password. L'operazione è stata annullata.",
    email_title: "Email",
    password_title: "Password",
    abbonamento_title: "Abbonamento attivo",
    account_section: "Account",
    abbonamento_section: "Abbonamento",
    abbonamento_storico: "Storico",
    interazione_section: "Notifiche",
    cta_abbonamento: "Passa a premium!",
    notifiche_sconti: "Sconti",
    note_premium: "Dai un boost alla tua attività!",
    note_abbonamento: "Scopri i dettagli del tuo abbonamento",
    note_storico: "Visualizza i tuoi vecchi abbonamenti",
    notifiche_vantaggi: "Vantaggi",
    notifiche_vantaggi_note: "Notifiche su suggerimenti che potete applicare",
    notifiche_promozioni: "Vantaggi",
    notifiche_promozioni_note: "Notifiche su suggerimenti che potete applicare",
    notifiche_inventario: "Inventario",
    notifiche_inventario_note:
      "Ti aggiorniamo quando c'è scarsità nel tuo inventario",
    notifiche_recensioni: "Recensioni",
    notifiche_recensioni_note:
      "Ti aggiorniamo quando c'è una nuova recensione sulla tua attività",
    notifiche_report: "Report mensile",
    notifiche_report_note:
      "Ti aggiorniamo quando c'è un nuovo report mensile sul andamento della tua attività con MenuShare",
    error_generic:
      "Ops, qualcosa è andato storto. Riprova più tardi o contatta l'assistenza.",
    preferenze_sezione: "Preferenze",
    preferenze_lingua: "Lingua",
    preferenze_lingua_title: "Seleziona la lingua",
    preferenze_nightMode: "Modalità notte",
    btn__delete: "Elimina account",
    modalDeleteTitle: "Elimina account",

    modalDeleteParagraph:
      "Attenzione, questa operazione è irreversibile. Sicuro di voler eliminare l'account?",
    success_deleted: "Account eliminato con successo!",
    error_delete:
      "Attenzione, questa operazione richiede che tu abbia fatto l'accesso di recente. effettua il login nuovamente per abilitare questafunzionalità.",
  },
  en_GB: {
    pageTitle: "Settings",
    changeEmail: "Change login email",
    input__email: {
      label: "Enter the new email",
      ph: "new@mail.com",
    },
    changeTutorial:
      "Once the procedure is completed by clicking on 'Change email' ",
    btn__change: "Change Email",
    warn_emailEmpty: "Enter an email before proceeding.",
    btn__close: "Close",
    success_changeEmail: "Email changed successfully:",
    error_changeEmail:
      "Oops! Error while changing the email. Please try again later.",
    btn__logout: "Logout",
    modalTitleLogout: "Logout",
    paragraphLogout: "Are you sure you want to logout?",
    changePasswordTitle: "Change login password",
    input__password: {
      label: "Enter the new password",
      ph: "******",
    },
    input__password__confirm: {
      label: "Confirm the password",
      ph: "******",
    },
    info__password: "The password must be at least 6 characters long.",
    changePasswordTutorial:
      "Once confirmed, you will be logged out of the account to allow you to log in with the new password.",
    btn__change__password: "Change password",
    warning__passLegth: "The password must be at least 6 characters long.",
    success__passwordCambiata: "Your password has been changed successfully!",
    danger__passwordCambiata:
      "Oops, something went wrong with changing the password. The operation has been canceled.",
    email_title: "Email",
    password_title: "Password",
    abbonamento_title: "Active subscription",
    account_section: "Account",
    abbonamento_section: "Subscription",
    abbonamento_storico: "Historical",
    interazione_section: "Notifications",
    cta_abbonamento: "Upgrade to premium!",
    notifiche_sconti: "Discounts",
    note_premium: "Boost your business!",
    note_abbonamento: "Check the details of your subscription",
    note_storico: "View your past subscriptions",
    notifiche_vantaggi: "Advantages",
    notifiche_vantaggi_note: "Notifications on applicable suggestions",
    notifiche_promozioni: "Advantages",
    notifiche_promozioni_note: "Notifications on applicable suggestions",
    notifiche_inventario: "Inventory",
    notifiche_inventario_note:
      "We'll update you when there's a shortage in your inventory",
    notifiche_recensioni: "Reviews",
    notifiche_recensioni_note:
      "We'll update you when there's a new review on your business",
    notifiche_report: "Monthly report",
    notifiche_report_note:
      "We'll update you when there's a new monthly report on your business's performance with MenuShare",
    error_generic:
      "Oops, something went wrong. Please try again later or contact support.",
    preferenze_sezione: "Preferences",
    preferenze_lingua: "Language",
    preferenze_lingua_title: "Select the language",
    preferenze_nightMode: "Night mode",
    btn__delete: "Delete account",
    modalDeleteTitle: "Elimina account",
    modalDeleteParagraph:
      "Attenzione, questa operazione è irreversibile. Sicuro di voler eliminare l'account?",
    success_deleted: "Account eliminato con successo!",
    error_delete:
      "Attenzione, questa operazione richiede che tu abbia fatto l'accesso di recente. effettua il login nuovamente per abilitare questafunzionalità.",
  },
};
