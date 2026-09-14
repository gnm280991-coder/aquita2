import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

async function cargarCatalogo() {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "<p>Cargando productos...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        
        if (querySnapshot.empty) {
            contenedor.innerHTML = "<p>No hay productos disponibles por ahora.</p>";
            return;
        }

        contenedor.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const prod = doc.data();
            
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-producto");
            
            tarjeta.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <p class="precio">$${prod.precio}</p>
                <a href="https://wa.me/?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(prod.nombre)}" 
                   class="btn-whatsapp" target="_blank">Consultar por WhatsApp</a>
            `;
            
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
        contenedor.innerHTML = "<p>Error al cargar el catálogo.</p>";
    }
}

cargarCatalogo();

