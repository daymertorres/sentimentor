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
    alert("Error al iniciar sesión: " + error.message);
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
    alert("Error al registrarse: " + error.message);
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
    alert("Error con Google: " + error.message);
  }
});
