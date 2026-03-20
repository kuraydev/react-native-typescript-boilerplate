import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  "tr-TR": {
    translation: {
      noLocationService: "Lokasyon Servisi Kapalı",
      logout: "Çıkış",
      yes: "Evet",
      no: "Hayır",
      cancel: "İptal",
      areYouSure: "Emin misiniz?",
      logoutDesc: "Çıkış yapmak üzeresiniz onaylıyor musunuz?",
      noInternet: "İnternet Bağlantısı Yok",
    },
  },
  en: {
    translation: {
      noLocationService: "Location Service Not Available",
      logout: "Logout",
      yes: "Yes",
      no: "No",
      cancel: "Cancel",
      areYouSure: "Are you sure?",
      logoutDesc: "You are about to log out, confirm?",
      noInternet: "No Internet Connection",
    },
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// ? Set the language manually
// i18n.changeLanguage("tr-TR");

export default i18n;
