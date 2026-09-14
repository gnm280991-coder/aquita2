import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAj_ZTJwiNL3cZIKU2L-RlaLyO_vO68oGc",
    authDomain: "aquita-tienda.firebaseapp.com",
    projectId: "aquita-tienda",
    storageBucket: "aquita-tienda.firebasestorage.app",
    messagingSenderId: "981582885638",
    appId: "1:981582885638:web:9b4f96775ca04d78dba487"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLOUD_NAME = "sole"; 
const UPLOAD_PRESET = "catalogo_aquita"; 

const form = document.getElementById("form-producto");
const mensajeEstado = document.getElementById("mensaje-estado");
const btnGuardar = document.getElementById("btn-guardar");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const archivoImagen = document.getElementById("imagen").files[0];

    if (!archivoImagen) {
        alert("Por favor selecciona una foto.");
        return;
    }

    btnGuardar.disabled = true;
    mensajeEstado.style.color = "blue";
    mensajeEstado.textContent = "Subiendo imagen a Cloudinary...";

    try {
        const formData = new FormData();
        formData.append("file", archivoImagen);
        formData.append("upload_preset", UPLOAD_PRESET);

        const respuestaCloudinary = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );

        const datosImagen = await respuestaCloudinary.json();

        if (!datosImagen.secure_url) {
            throw new Error("Cloudinary error: " + (datosImagen.error ? datosImagen.error.message : JSON.stringify(datosImagen)));
        }

        mensajeEstado.textContent = "Guardando producto en Firestore...";

        await addDoc(collection(db, "productos"), {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            imagen: datosImagen.secure_url,
            creado: new Date()
        });

        mensajeEstado.style.color = "green";
        mensajeEstado.textContent = "¡Producto publicado con éxito!";
        form.reset();
    } catch (error) {
        console.error(error);
        mensajeEstado.style.color = "red";
        mensajeEstado.textContent = "Error: " + error.message;
    } finally {
        btnGuardar.disabled = false;
    }
});
