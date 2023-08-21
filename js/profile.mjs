import { auth, db, storage } from "./firebase.mjs";
import {
  onAuthStateChanged,
  signOut,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getDownloadURL,
  uploadBytes,
  ref,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "users"), where("user", "==", user.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      getDownloadURL(ref(storage, doc.data().email)).then((url) => {
        console.log(url);
        document.querySelector(".profile-container").innerHTML = `
        <div class="image">
        <img src='${url}'  style="position:relative;"/>
        
        <input type="file" style="display: none" id="updateFile" onChange="updateFile('${
          doc.id
        }')" />
        <label for="updateFile"><i class="fa-solid fa-pen" style="color : #7749f8; position:absolute;font-size:20px;cursor:pointer; bottom:290px;left:270px;"></i></label>
        </div>
        <h1 style="display:flex;" id="${doc.id}-name">${
          doc.data().first_name
        } ${
          doc.data().last_name
        }   <i class="fa-solid fa-pen" onclick="updateNamInput('${
          doc.data().first_name
        }','${doc.data().last_name}','${
          doc.id
        }')" style="color : #7749f8; font-size:20px;margin-left:10px;margin-top:10px;cursor:pointer"></i></h1>
      
            <h1>Password</h1>
            <input type="text" id="old-password" placeholder="Old password" />
            <input type="text" id="p"  placeholder="New password" />
            <input type="text" id="uP" placeholder="Repeat password" />
            <button id="updatePasswor">Update Password</button>
        `;
        document.getElementById("updatePasswor").addEventListener("click", () => {
          // window.updatePassword = () => {
          const user = auth.currentUser;
          const newPassword = document.getElementById("uP").value;
          const password = document.getElementById("p").value;
          if (password == newPassword) {
            updatePassword(user, newPassword)
              .then(() => {
                console.log("done");
              })
              .catch((error) => {
                console.log(error);
              });
          }
          // };
        });
        document.getElementById("old-password").value = doc.data().password;
      });
      document.querySelector("#profile").innerHTML = `${
        doc.data().first_name
      }  ${doc.data().last_name}`;
      document.querySelector("#logout").addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {});
      });
    });
    window.updateFile = () => {
      const storageRef = ref(storage, user.email);
      uploadBytes(
        storageRef,
        document.getElementById("updateFile").files[0]
      ).then((snapshot) => {
        console.log("Uploaded a blob or file!");
        window.location.reload();
      });
    };
    window.updateNamInput = (first, last, id) => {
      console.log("asdas");
      document.getElementById(
        `${id}-name`
      ).innerHTML = `<div style="display:flex"><input id="${id}-value" value="${first} ${last}" />  <i class="fa-solid fa-pen" onclick="updateName('${id}')" style="color : #7749f8; font-size:20px;cursor:pointer; margin-left:10px;margin-top:10px; "></i></div>`;
    };
    window.updateName = async (id) => {
      const washingtonRef = doc(db, "users", id);

      await updateDoc(washingtonRef, {
        first_name: document.getElementById(`${id}-value`).value,
      });
      window.location.reload();
    };
  } else {
    console.log("sad");
  }
});


