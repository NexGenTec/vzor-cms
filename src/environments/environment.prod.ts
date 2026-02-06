// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

  
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "vzor-cms",
    storageBucket: "",
    messagingSenderId: "833531618499",
    appId: "1:833531618499:web:d1e15f1c7b5510e84f6e76",
    measurementId: "G-SJ0ZY3MQDJ"
  },
  firestoreConfig: {
    projectId: "vzor-cms",
    databaseId: "vzor-web"
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * 
 * # Reconstruir la aplicación
  ng build --configuration production

  # Copiar archivos al directorio público
  xcopy "dist\nex-manager\browser" "public" /E /I /Y

  # Desplegar
  firebase deploy --only hosting
 */