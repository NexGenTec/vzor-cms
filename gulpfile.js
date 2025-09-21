const gulp = require("gulp");
const replace = require("gulp-replace");
const argv = require("yargs").argv;

// Definir la configuración por defecto para clientes
const clientes = {
  clienteA: {
    apiKey: "API_KEY_CLIENTE_A",
    authDomain: "clienteA.firebaseapp.com",
    projectId: "clienteA",
    storageBucket: "clienteA.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:clienteA",
    measurementId: "G-CLIENTEA",
    nombre: "Cliente A",
    colorPrincipal: "#FF5733",
    logo: "assets/logos/clienteA.png"
  },
  clienteB: {
    apiKey: "API_KEY_CLIENTE_B",
    authDomain: "clienteB.firebaseapp.com",
    projectId: "clienteB",
    storageBucket: "clienteB.appspot.com",
    messagingSenderId: "987654321",
    appId: "1:987654321:web:clienteB",
    measurementId: "G-CLIENTEB",
    nombre: "Cliente B",
    colorPrincipal: "#33FF57",
    logo: "assets/logos/clienteB.png"
  },
  nexgen: {
    apiKey: "AIzaSyBUclhgw0asBudveCrwMvvdGiaTRe5Xlb4",
    authDomain: "nexgenwebmaintainer.firebaseapp.com",
    projectId: "nexgenwebmaintainer",
    storageBucket: "nexgenwebmaintainer.firebasestorage.app",
    messagingSenderId: "155866168020",
    appId: "1:155866168020:web:3c7f6852ad5083fed61941",
    measurementId: "G-4B5V1ZB8F3",
    nombre: "NexGenManager",
    colorPrincipal: "#009688",
    logo: "assets/logos/nexgen.png"
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
