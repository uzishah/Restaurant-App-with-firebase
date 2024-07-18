import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGkFTRw8B2h5K4JD2JzM5B23_oHVI4Eao",
  authDomain: "resturant-app-ac64e.firebaseapp.com",
  projectId: "resturant-app-ac64e",
  storageBucket: "resturant-app-ac64e.appspot.com",
  messagingSenderId: "121085123136",
  appId: "1:121085123136:web:e2fb12254ae64ac3e09da5",
  measurementId: "G-ZJEEL2NE95",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

let getCard = document.getElementById("card");

let getBtn = document.getElementById("addproduct");
const getBtnEventHandler = getBtn.onclick = () => {
  let pimg = document.getElementById("pimg");
  const file = pimg.files[0];
  const storageRef = ref(storage, `products/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);
        let pid = document.getElementById("pid");
        let pname = document.getElementById("pname");
        let pprice = document.getElementById("pprice");
        let pdes = document.getElementById("pdes");
        const docRef = await addDoc(collection(db, "products"), {
          pid: pid.value,
          pname: pname.value,
          pprice: pprice.value,
          pdes: pdes.value,
          pimg: downloadURL,
        });
        fetchData();
      });
    }
  );
};

async function fetchData() {
  getCard.innerHTML = ""; // Clear the existing cards
  const q = collection(db, "products");

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    getCard.innerHTML += `
      <div class="row g-4">
        <div class="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
          <div class="col-lg-6">
            <div class="d-flex align-items-center">
              <img class="flex-shrink-0 img-fluid rounded" src=${doc.data().pimg} alt="" style="width: 80px;">
              <div class="w-100 d-flex flex-column text-start ps-4">
                <h4 class="d-flex justify-content-between border-bottom pb-2">
                  <span class="menu-name">${doc.data().pname}</span>
                </h4>
                <h5 class="d-flex justify-content-between border-bottom pb-2">
                  <span class="text-primary">${doc.data().pprice}</span>
                  <span class="text-primary">${doc.data().pid}</span>
                </h5>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="fst-italic">${doc.data().pdes}</small>
                  <div>
                    <button type="button" class="btn btn-primary btn-sm mx-1" onclick="editItem('${doc.id}', '${doc.data().pname}', '${doc.data().pprice}', '${doc.data().pdes}', '${doc.data().pimg}')">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="delItem('${doc.id}')">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
}

fetchData();

async function delItem(id) {
  await deleteDoc(doc(db, "products", id));
  fetchData();
}

window.delItem = delItem;

window.editItem = (id, name, price, description, img) => {
  document.getElementById("pid").value = id;
  document.getElementById("pname").value = name;
  document.getElementById("pprice").value = price;
  document.getElementById("pdes").value = description;
  document.getElementById("addproduct").innerText = "Update Product";

  const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  myModal.show();

  getBtn.onclick = async () => {
    const productRef = doc(db, "products", id);
    let pname = document.getElementById("pname");
    let pprice = document.getElementById("pprice");
    let pdes = document.getElementById("pdes");
    let pimg = document.getElementById("pimg");

    let updateData = {
      pname: pname.value,
      pprice: pprice.value,
      pdes: pdes.value,
    };

    if (pimg.files.length > 0) {
      const file = pimg.files[0];
      const storageRef = ref(storage, `products/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          updateData.pimg = downloadURL;
          await updateDoc(productRef, updateData);
          fetchData();
          document.getElementById("addproduct").innerText = "Add Product";
          getBtn.onclick = getBtnEventHandler;
        }
      );
    } else {
      await updateDoc(productRef, updateData);
      fetchData();
      document.getElementById("addproduct").innerText = "Add Product";
      getBtn.onclick = getBtnEventHandler;
    }
  };
};
