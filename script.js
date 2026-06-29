const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

const logos = {
    "ESPN": "https://upload.wikimedia.org/wikipedia/commons/e/e3/ESPN.svg",
    "Fox Sports": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fox_Sports_logo.svg"
};

function cargarDatos() {
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function(results) {
            clasificarEventos(results.data);
        }
    });
}

function clasificarEventos(eventos) {
    // 1. Limpiamos los contenedores antes de rellenar
    const contenedores = document.querySelectorAll('.lista');
    contenedores.forEach(c => c.innerHTML = '');

    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0]; 
    const horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento) return;

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMinutos = hI * 60 + mI;
        const finMinutos = hF * 60 + mF;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo"> 
                         <div><strong>${ev.Evento}</strong><br><small>${ev.Hora_Inicio} - ${ev.Canal}</small></div>`;

        if (ev.Fecha === hoyStr) {
            if (horaActualMinutos >= inicioMinutos && horaActualMinutos <= finMinutos) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (ev.Fecha > hoyStr) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

// Carga inicial
cargarDatos();

// Refresco automático cada 60 segundos (60000 milisegundos)
setInterval(cargarDatos, 60000);// ... (mantiene la lógica de cargarDatos que ya tienes)

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
