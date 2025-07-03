const auth = firebase.auth();
const db = firebase.firestore();

// Selecciona elementos
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Cuando se hace click en "Regístrate" (botón de toggle)
registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

// Cuando se hace click en "Inicia Sesión" (botón de toggle)
loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

// Función para obtener mensaje de error en español
function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return "La dirección de correo electrónico está en formato inválido.";
    case 'auth/invalid-login-credentials':
      return "Los datos ingresados son incorrectos";
    case 'auth/missing-password':
      return "Debe ingresar una contraseña.";
    case 'auth/email-already-in-use':
      return "El correo electrónico ya está en uso.";
    case 'auth/operation-not-allowed':
      return "La operación no está permitida.";
    case 'auth/weak-password':
      return "La contraseña debe tener al menos 6 caracteres.";
    case 'auth/too-many-requests':
      return "Demasiadas solicitudes. Intenta de nuevo más tarde.";
    default:
      return "Error desconocido. Por favor, inténtalo de nuevo.";
  }
}

// LOGIN con correo
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-user").value;
  const password = document.getElementById("login-pass").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    const doc = await db.collection("usuarios").doc(uid).get();

    if (doc.exists) {
      const rol = doc.data().rol;
      if (rol === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "cliente.html";
      }
    } else {
      alert("No se encontró el rol del usuario.");
    }
  } catch (error) {
    console.error("Error completo:", error); // Imprimir el error completo en la consola
    alert("Error al iniciar sesión: " + getErrorMessage(error.code)); // Mensaje de error en español
  }
});

// REGISTRO con correo
document.getElementById("register-btn").addEventListener("click", async () => {
  const username = document.getElementById("register-user").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-pass").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    await db.collection("usuarios").doc(uid).set({
      nombre: username,
      correo: email,
      rol: "cliente"
    });

    window.location.href = "cliente.html";
  } catch (error) {
    console.error("Error completo:", error); // Imprimir el error completo en la consola
    alert("Error al registrarse: " + getErrorMessage(error.code)); // Mensaje de error en español
  }
});

// LOGIN con Google
document.getElementById("google-login").addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await auth.signInWithPopup(provider);
    const uid = result.user.uid;
    const userRef = db.collection("usuarios").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        nombre: result.user.displayName,
        correo: result.user.email,
        rol: "cliente"
      });
    }

    const rol = (await userRef.get()).data().rol;
    if (rol === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "cliente.html";
    }
  } catch (error) {
    console.error("Error completo:", error); // Imprimir el error completo en la consola
    alert("Error con Google: " + getErrorMessage(error.code)); // Mensaje de error en español
  }
});
