import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,onAuthStateChanged ,sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

// Select elements
const signUpEmail = document.getElementById("sign-up-email");
const signUpPassword = document.getElementById("sign-up-password");
const signUpButton = document.getElementById("sign-up");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const signInEmail = document.getElementById("sign-in-email");
const signInPassword = document.getElementById("sign-in-password");
const signInButton = document.getElementById("sign-in");

// Email validation pattern
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Registration function
const registration = (event) => {
    event.preventDefault();

    const email = signUpEmail.value;
    const password = signUpPassword.value;

    if (!emailPattern.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email is not valid",
        });
        return;
    }

    if (password.length < 8) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password must be at least 8 characters long.",
        });
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password must be at least 8 characters long.",
            });
            document.querySelector('.cont').classList.remove('s-signup');
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(error)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errorMessage,
            });
        });
};

// Sign-In function
const signIn = (event) => {
    event.preventDefault();

    const email = signInEmail.value;
    const password = signInPassword.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userEmail = userCredential.user.email;
            // Redirect to profile page with user's email as query parameter
            window.location.href ="menu.html"
        })
        .catch((error) => {
            const errorMessage = error.message;
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errorMessage,
            });
        });
};

// Add event listeners
signUpButton.addEventListener('click', registration);
signInButton.addEventListener('click', signIn);

// Toggle form view
document.querySelector('.img-btn').addEventListener('click', function () {
    document.querySelector('.cont').classList.toggle('s-signup');
});





