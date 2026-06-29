// ... (mantiene la lógica de cargarDatos que ya tienes)

function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

function generarQR() {
    const modal = document.getElementById('qr-modal');
    modal.style.display = 'flex';
    document.getElementById('qr-code').innerHTML = '';
    new QRCode(document.getElementById("qr-code"), {
        text: window.location.href,
        width: 200, height: 200
    });
}

// Asegúrate de añadir estas funciones al final de tu archivo script.js actual
