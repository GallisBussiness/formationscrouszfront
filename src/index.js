import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// core styles are required for all packages
import '@mantine/core/styles.css';

// other css files are required only if
// you are using components from the corresponding package
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import 'mantine-datatable/styles.layer.css';
import "./index.css";

import App from "./App";
import AuthProvider from 'react-auth-kit'
import { MantineProvider } from "@mantine/core";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import createStore from "react-auth-kit/createStore";
import { Notifications, notifications } from "@mantine/notifications";
function getSuccessMessage() {
  return "Opération réussie : la requête a été traitée avec succès.";
}

function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 400:
      return "Erreur de requête : la syntaxe de la requête est incorrecte.";
    case 401:
      return "Erreur d'authentification : vous n'avez pas les droits d'accès.";
    case 403:
      return "Accès refusé : vous n'avez pas la permission d'accéder à cette ressource.";
    case 404:
      return "Erreur 404 : la page demandée n'a pas été trouvée.";
    case 500:
      return "Erreur interne du serveur : une erreur inattendue est survenue.";
    case 502:
      return "Erreur de passerelle : le serveur a reçu une réponse invalide.";
    case 503:
      return "Service indisponible : le serveur est actuellement en maintenance.";
    default:
      return "Erreur inconnue : veuillez réessayer plus tard.";
  }
}
const queryClient = new QueryClient(
  {
    mutationCache: new MutationCache({
      onSuccess:()=> {
        notifications.show({message:getSuccessMessage(),color:'green'})
      },
      onError: (error) => {
        if(error?.response?.data?.statusCode){
          notifications.show({message:getErrorMessage(error.response.data.statusCode),color:'red'})
        } else {
          notifications.show({message:getErrorMessage(error),color:'red'})
        }
      }
    }),
    queryCache: new QueryCache({
      onError: (error) => {
        if(error?.response?.data?.statusCode){
          notifications.show({message:getErrorMessage(error.response.data.statusCode),color:'red'})
        } else {
          notifications.show({message:getErrorMessage(error),color:'red'})
        }
      }
    })
  }
)

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = createStore({
  authName: process.env.REACT_APP_TOKENSTORAGENAME,
  authType:'localstorage',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

root.render(
  <MantineProvider>
    <Notifications />
     <QueryClientProvider client={queryClient}>
     <AuthProvider store={store}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </AuthProvider>
  </QueryClientProvider>
  </MantineProvider>
);
