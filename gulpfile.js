const gulp = require("gulp");
const replace = require("gulp-replace");
const argv = require("yargs").argv;

// Definir la configuración por defecto para clientes
const clientes = {
  clienteA: {
    apiKey: "AIzaSyAvfPnxpQ8T4qcLkHw24PkeACT2NHuOyOw",
    authDomain: "vzor-cms.firebaseapp.com",
    projectId: "vzor-cms",
    storageBucket: "vzor-cms.firebasestorage.app",
    messagingSenderId: "833531618499",
    appId: "1:833531618499:web:d1e15f1c7b5510e84f6e76",
    measurementId: "G-SJ0ZY3MQDJ"
  },
  clienteB: {
    apiKey: "AIzaSyAvfPnxpQ8T4qcLkHw24PkeACT2NHuOyOw",
    authDomain: "vzor-cms.firebaseapp.com",
    projectId: "vzor-cms",
    storageBucket: "vzor-cms.firebasestorage.app",
    messagingSenderId: "833531618499",
    appId: "1:833531618499:web:d1e15f1c7b5510e84f6e76",
    measurementId: "G-SJ0ZY3MQDJ"
  },
  clienteC: {
    apiKey: "AIzaSyAvfPnxpQ8T4qcLkHw24PkeACT2NHuOyOw",
    authDomain: "vzor-cms.firebaseapp.com",
    projectId: "vzor-cms",
    storageBucket: "vzor-cms.firebasestorage.app",
    messagingSenderId: "833531618499",
    appId: "1:833531618499:web:d1e15f1c7b5510e84f6e76",
    measurementId: "G-SJ0ZY3MQDJ"
  },
  nexgen: {
    apiKey: "AIzaSyAvfPnxpQ8T4qcLkHw24PkeACT2NHuOyOw",
    authDomain: "vzor-cms.firebaseapp.com",
    projectId: "vzor-cms",
    storageBucket: "vzor-cms.firebasestorage.app",
    messagingSenderId: "833531618499",
    appId: "1:833531618499:web:d1e15f1c7b5510e84f6e76",
    measurementId: "G-SJ0ZY3MQDJ"
  }
};

// Función de reemplazo
function modificarEnvironment(done) {
  const cliente = argv.cliente || "prod"; // Default a "prod" si no se pasa el parámetro
  const config = clientes[cliente] || {}; // Obtener la configuración del cliente
  if (!config.nombre) {
    console.log(`Cliente no encontrado: ${cliente}`);
    return done();
  }

  console.log(`Configuración generada para: ${cliente}`);

  // Modificar el archivo environment.prod.ts para el cliente seleccionado
  return gulp
    .src("src/environments/environment.prod.ts") // Cargar el archivo original
    .pipe(replace(/apiKey:\s*".*?"/, `apiKey: "${config.apiKey}"`))
    .pipe(replace(/authDomain:\s*".*?"/, `authDomain: "${config.authDomain}"`))
    .pipe(replace(/projectId:\s*".*?"/, `projectId: "${config.projectId}"`))
    .pipe(replace(/storageBucket:\s*".*?"/, `storageBucket: "${config.storageBucket}"`))
    .pipe(replace(/messagingSenderId:\s*".*?"/, `messagingSenderId: "${config.messagingSenderId}"`))
    .pipe(replace(/appId:\s*".*?"/, `appId: "${config.appId}"`))
    .pipe(replace(/measurementId:\s*".*?"/, `measurementId: "${config.measurementId}"`))
    .pipe(replace(/nombre:\s*".*?"/, `nombre: "${config.nombre}"`))
    .pipe(replace(/colorPrincipal:\s*".*?"/, `colorPrincipal: "${config.colorPrincipal}"`))
    .pipe(replace(/logo:\s*".*?"/, `logo: "${config.logo}"`))
    .pipe(gulp.dest("src/environments/")) // Guardar el archivo modificado
    .on('end', done); // Asegurarse de que la tarea se complete correctamente

}

// Registrar tarea
gulp.task("change", modificarEnvironment);
