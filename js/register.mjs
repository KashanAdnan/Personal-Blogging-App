import { db, auth, storage } from "./firebase.mjs";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const form = document.querySelector(".signup");

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const fname = document.querySelector("#fname").value;
  const lname = document.querySelector("#lname").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const repeatPassword = document.querySelector("#rpassword").value;
  if (password != repeatPassword) {
    Swal.fire("Please Match Password", "Error", "error");
  }
  const data = await createUserWithEmailAndPassword(auth, email, password);
  if (data) {
    const user = data.user;
    try {
      await setDoc(doc(db, "users", user.uid), {
        first_name: fname,
        last_name: lname,
        user: user.uid,
        email,
        password,
        repeatPassword,
      });

      const storage = getStorage();
      const storageRef = ref(storage, email);
      uploadBytes(storageRef, document.getElementById("file").files[0]).then(
        (snapshot) => {
          console.log("Uploaded a blob or file!");
        }
      );
      Swal.fire("Good job!", "Sign Up Succesfull!", "success").then(() => {
        window.location.href = "../../index.html";
      });
    } catch (error) {
      console.log(error);
    }
  }
});
