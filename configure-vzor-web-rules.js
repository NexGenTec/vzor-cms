// Script para configurar reglas de Firestore para la base de datos vzor-web
// Este script debe ejecutarse en la consola de Firebase

const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/vzor-web/documents {
    // Reglas para la base de datos vzor-web
    match /{document=**} {
      // Permitir lectura y escritura solo a usuarios autenticados
      allow read, write: if request.auth != null;
    }
    
    // Reglas específicas para la colección Users
    match /Users/{userId} {
      // Los usuarios pueden leer y escribir sus propios datos
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permitir creación de nuevos usuarios durante el registro
      allow create: if request.auth != null;
    }
    
    // Reglas para otras colecciones
    match /Projects/{projectId} {
      allow read, write: if request.auth != null;
    }
    
    match /Tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    match /Products/{productId} {
      allow read, write: if request.auth != null;
    }
    
    match /Tickets/{ticketId} {
      allow read, write: if request.auth != null;
    }
  }
}`;

console.log('Reglas para vzor-web:');
console.log(rules);
console.log('\nInstrucciones:');
console.log('1. Ve a https://console.firebase.google.com/project/vzor-cms/firestore/rules');
console.log('2. Selecciona la base de datos "vzor-web" en el selector de base de datos');
console.log('3. Copia y pega las reglas de arriba');
console.log('4. Haz clic en "Publicar"');

