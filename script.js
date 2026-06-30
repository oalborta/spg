const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

const logos = {
    "ESPN": "https://raw.githubusercontent.com/oalborta/spg/main/espn.png",
    "ESPN 2": "https://raw.githubusercontent.com/oalborta/spg/main/espn2.png",
    "ESPN 3": "https://raw.githubusercontent.com/oalborta/spg/main/espn3.png",
    "ESPN 4": "https://raw.githubusercontent.com/oalborta/spg/main/espn4.png",
    "ESPN 5": "https://raw.githubusercontent.com/oalborta/spg/main/espn5.png",
    "ESPN 6": "https://raw.githubusercontent.com/oalborta/spg/main/espn6.png",
    "ESPN 7": "https://raw.githubusercontent.com/oalborta/spg/main/espn7.png",
    "TS 1": "https://raw.githubusercontent.com/oalborta/spg/main/ts1.png",
    "TS 2": "https://raw.githubusercontent.com/oalborta/spg/main/ts2.png"
};

function cargarDatos() {
    Papa.parse(CSV_URL, { download: true, header: true, complete: (res) => clasificarEventos(res.data) });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    
    // Obtenemos la hora local actual en Bolivia (GMT-4)
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento || !ev.Fecha) return;

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;

        const div = document.createElement('div');
        div.className = 'evento';
        
        // El logo se busca por el nombre exacto de la columna "Canal"
        const srcLogo = logos[ev.Canal] || '';
        
        div.innerHTML = `<img src="${srcLogo}" class="logo" onerror="this.style.display='none'">
                         <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
                         <button class="btn-recordar" onclick="alert('Evento programado')">Recordar</button>`;

        // Lógica de clasificación
        if (ev.Fecha === hoyStr) {
            if (minutosAhora >= inicioMin && minutosAhora <= finMin) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (ev.Fecha > hoyStr) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

cargarDatos();
setInterval(cargarDatos, 60000);
