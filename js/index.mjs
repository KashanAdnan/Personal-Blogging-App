import { auth, db, storage } from "./firebase.mjs";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getDownloadURL,
  ref,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.querySelector(".form-blog").style.display = "flex";
    const q = query(collection(db, "users"), where("user", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      document.querySelector("#profile").href = "../pages/user/profile.html";
      document.querySelector("#profile").innerHTML = `${
        doc.data().first_name
      }  ${doc.data().last_name}`;
      document.querySelector("#logout").style.display = "block";
      document.querySelector("#heading").innerHTML = "Dashboard";
      document.querySelector(".form-blog").innerHTML = `
          <input id="placeholder" required minLenght="5" maxLenght="50" type="text" placeholder="Placeholder" />
          <textarea id="blog" required  minLenght="100" maxLength="3000" placeholder="What is in your mind"></textarea>
          <button onclick="publishBlog()">Publish Blog</button>
      `;
      document.querySelector("#logout").addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {});
      });
    });

    window.publishBlog = async () => {
      try {
        const date = new Date();
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "July",
          "August",
          "September",
          "November",
          "December",
        ];
        await addDoc(collection(db, "blogs"), {
          user: user.uid,
          date: `${
            months[date.getMonth()]
          } ${date.getDate()}th, ${date.getFullYear()} `,
          placeholder: document.getElementById("placeholder").value,
          blog: document.getElementById("blog").value,
        });
        Swal.fire("Good job!", "Blog Published!", "success");
        getData();
        document.getElementById("placeholder").value = "";
        document.getElementById("blog").value = "";
      } catch (error) {
        console.log(error);
      }
    };

    async function getData() {
      document.getElementById("blogdasd").innerHTML = `My Blog`;
      const q = query(collection(db, "blogs"), where("user", "==", user.uid));

      const querySnapshot = await getDocs(q);
      document.querySelector(".blogs").innerHTML = "";
      querySnapshot.forEach(async (doc) => {
        const q = query(
          collection(db, "users"),
          where("user", "==", doc.data().user)
        );
        const querySnapshot = await getDocs(q);
        const date = doc.data().date;
        querySnapshot.forEach((docu) => {
          getDownloadURL(ref(storage, docu.data().email))
            .then((url) => {
              document.querySelector(".blogs").innerHTML += `
            <div class="blog" id="${doc.id}">
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
            <div class="buttons">
            <a onclick="deletePost('${doc.id}')">Delete</a>
            <a onclick="updatePost('${doc.id}' , '${url}','${
                docu.data().first_name
              }','${doc.data().placeholder}','${doc.data().date}','${doc.data().blog}')">Update</a>
            </div>
  
            `;
            })
            .catch((error) => {});
        });
      });
    }

    window.deletePost = (id) => {
      Swal.fire({
        title: "Are you sure you want to Delete",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1ca1f1",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete!",
      })
        .then(async (result) => {
          if (result.isConfirmed) {
            await deleteDoc(doc(db, "blogs", id));
            getData();
          }
        })
        .catch((error) => {});
    };
    window.updatePost = async (id, url, first, placeholder, date, blog) => {
      document.getElementById(`${id}`).innerHTML = `
      <div class="image-user">
      <img
      src="${url}"
      alt=""
      />
      <div class="user-name">
      <input type="text" id="title-${id}" value="${placeholder}"></h1>
      <p>${first} - ${date}</p>
      </div>
      </div>
      <textarea id="para-${id}" >${blog}</textarea>
      <div class='buttons'>
      
      <button onclick="update('${id}')">Update</button>
      </div>    
        `;
    };
    window.update = async (id) => {
      const washingtonRef = doc(db, "blogs", id);

      await updateDoc(washingtonRef, {
        placeholder: document.getElementById(`title-${id}`).value,
        blog: document.getElementById(`para-${id}`).value,
      });
      getData();
    };
    getData();
  } else {
    async function getDataWithOutLogin() {
      const q = query(collection(db, "blogs"));

      const querySnapshot = await getDocs(q);
      document.querySelector(".blogs").innerHTML = "";
      querySnapshot.forEach(async (doc) => {
        const q = query(
          collection(db, "users"),
          where("user", "==", doc.data().user)
        );

        const querySnapshot = await getDocs(q);
        const date = doc.data().date;
        querySnapshot.forEach((docu) => {
          getDownloadURL(ref(storage, docu.data().email))
            .then((url) => {
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
             <a onclick="redirect('${
               doc.data().user
             }')">see all from this user</a>
              </div>
              `;
            })
            .catch((error) => {
              // Handle any errors
            });
        });
      });
    }

    getDataWithOutLogin();

    window.redirect = (user) => {
      localStorage.setItem("user-id", user);
      window.location.href = "../pages/blogs/blogDetails.html";
    };
  }
});
