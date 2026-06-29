// --- CONFIGURACIÓN ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

const logos = {
    "ESPN": "https://raw.githubusercontent.com/oalborta/spg/main/espn.png",
    "Fox Sports": "https://raw.githubusercontent.com/oalborta/spg/main/fox.png",
    "TyC Sports": "https://raw.githubusercontent.com/oalborta/spg/main/tyc.png",
    "Directv": "https://raw.githubusercontent.com/oalborta/spg/main/directv.png",
    "Star": "https://raw.githubusercontent.com/oalborta/spg/main/star.png",
    "TNT": "https://raw.githubusercontent.com/oalborta/spg/main/tnt.png",
    "DSports": "https://raw.githubusercontent.com/oalborta/spg/main/dsports.png",
    "Tigo": "https://raw.githubusercontent.com/oalborta/spg/main/tigo.png",
    "GOL": "https://raw.githubusercontent.com/oalborta/spg/main/gol.png",
    "SNT": "https://raw.githubusercontent.com/oalborta/spg/main/snt.png"
};

// --- LÓGICA PRINCIPAL ---
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
    // Limpiamos los contenedores para evitar duplicados al refrescar
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0]; 
    const horaMinutos = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento) return;

        // Convertimos horas a minutos para comparar
        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMinutos = hI * 60 + mI;
        const finMinutos = hF * 60 + mF;

        // Lógica inteligente: ¿Fecha de hoy o futura?
        const textoTiempo = (ev.Fecha === hoyStr) 
            ? `${ev.Hora_Inicio}` 
            : `${ev.Fecha} | ${ev.Hora_Inicio}`;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `
            <img src="${logos[ev.Canal] || ''}" class="logo" onerror="this.style.display='none'"> 
            <div>
                <strong style="display:block;">${ev.Evento}</strong>
                <small style="color: #666;">${textoTiempo}</small>
            </div>`;

        // Clasificación en bloques
        if (ev.Fecha === hoyStr) {
            if (horaMinutos >= inicioMinutos && horaMinutos <= finMinutos) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (ev.Fecha > hoyStr) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

// --- EJECUCIÓN ---
cargarDatos();
setInterval(cargarDatos, 60000); // Recarga automática cada 60 segundos
