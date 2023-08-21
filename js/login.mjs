import { auth } from "./firebase.mjs";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
const loginForm = document.querySelector(".login");

loginForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((data) => {
      Swal.fire("Good job!", "Login Succesfull!", "success").then(() => {
        window.location.href = "../../index.html";
      });
    })
    .catch((error) => {
      Swal.fire("Opps!", "Email And Password Wrong", "error");
    });
});
