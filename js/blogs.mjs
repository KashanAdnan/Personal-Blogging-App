import { auth, db ,storage} from "./firebase.mjs";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getDownloadURL , ref
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "users"), where("user", "==", user.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      document.querySelector("#profile").href  = "../pages/user/profile.html"
      document.querySelector("#profile").innerHTML = `${
        doc.data().first_name 
      }  ${doc.data().last_name}`;
      document.querySelector("#logout").style.display = "block";
      document.querySelector("#logout").addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {});
      });
    });
  } else {
  }
});

async function getData() {
  const q = query(
    collection(db, "blogs"),
    where("user", "==", localStorage.getItem("user-id"))
  );
  const querySnapshot = await getDocs(q);
  document.querySelector(".blogs").innerHTML = "";
  querySnapshot.forEach(async (doc) => {
    const q = query(
      collection(db, "users"),
      where("user", "==", doc.data().user)
    );
    const querySnapshot = await getDocs(q);
    const date = doc.data().date;
    querySnapshot
      .forEach((docu) => {
        getDownloadURL(ref(storage, docu.data().email)).then((url) => {
          document.querySelector(".blogs").innerHTML += `
        <div class="blog">
        <div class="image-user">
        <img
        src="${url}"
        alt=""
        />
        <div class="user-name">
          <h1>${doc.data().placeholder}</h1>
          <p>${docu.data().first_name} - ${doc.data().date}</p>
          </div>
          </div>
          <p>
          ${doc.data().blog}
          </p>
          </div>
          `;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  const us = query(
    collection(db, "users"),
    where("user", "==", localStorage.getItem("user-id"))
  );
  const user = await getDocs(us);
  
  user.forEach((doc) => {
    getDownloadURL(ref(storage, doc.data().email)).then((url) => {
      document.querySelector(".profile").innerHTML = `
      <h3>${doc.data().email}</h3>
      <h1>${doc.data().first_name} ${doc.data().last_name}</h1>
      <img src="${url}"/>
      `;
    })
  });
}

getData();
