const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

const logos = {
    "ESPN": "https://github.com/oalborta/spg/blob/main/espn.png?raw=true",
    "ESPN 2": "https://github.com/oalborta/spg/blob/main/espn2.png?raw=true",
    "ESPN 3": "https://github.com/oalborta/spg/blob/main/espn3.png?raw=true",
    "ESPN 4": "https://github.com/oalborta/spg/blob/main/espn4.png?raw=true",
    "ESPN 5": "https://github.com/oalborta/spg/blob/main/espn5.png?raw=true",
    "ESPN 6": "https://github.com/oalborta/spg/blob/main/espn6.png?raw=true",
    "ESPN 7": "https://github.com/oalborta/spg/blob/main/espn7.png?raw=true",
    "TS 1": "https://github.com/oalborta/spg/blob/main/ts1.png?raw=true",
    "TS 2": "https://github.com/oalborta/spg/blob/main/ts2.png?raw=true"
};

// IMPORTANTE: Usa raw.githubusercontent.com para que cargue la imagen
const logosTorneo = {
    "MUNDIAL": "https://github.com/oalborta/spg/blob/main/fifa.png?raw=true",
    "WIMBLEDON": "https://github.com/oalborta/spg/blob/main/wimbledon.png?raw=true"
};

function cargarDatos() {
    const btn = document.getElementById('btnRecargar');
    if (btn) btn.innerText = "Actualizando...";
    
    Papa.parse(CSV_URL, { 
        download: true, header: true, 
        complete: (res) => {
            // Filtramos filas vacías antes de ordenar
            const data = res.data.filter(row => row.Evento && row.Fecha);
            const datosOrdenados = data.sort((a, b) => {
                const fA = new Date(a.Fecha.split('/').reverse().join('-')).getTime();
                const fB = new Date(b.Fecha.split('/').reverse().join('-')).getTime();
                if (fA !== fB) return fA - fB;
                const [hA, mA] = a.Hora_Inicio.split(':').map(Number);
                const [hB, mB] = b.Hora_Inicio.split(':').map(Number);
                return (hA * 60 + mA) - (hB * 60 + mB);
            });
            clasificarEventos(datosOrdenados);
            if (btn) btn.innerText = "Recargar";
        } 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const ahora = new Date();
    // Ajustamos hoy para comparar correctamente con el formato AAAA-MM-DD
    const hoyStr = ahora.toISOString().split('T')[0]; 
    const minsAhora = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        // ev.Fecha ya viene como "2026-06-30"
        const fechaEvento = ev.Fecha; 
        
        // Convertimos Hora_Inicio a minutos
        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;

        // Ocultar si ya pasó hoy
        if (fechaEvento === hoyStr && minsAhora > finMin) return;

        // Lógica de visualización
        let canalDisp = logos[ev.Canal] ? `<img src="${logos[ev.Canal]}" class="logo">` : `<span class="badge">${ev.Canal.substring(0,3).toUpperCase()}</span>`;
        let torneoDisp = logosTorneo[ev.Torneo] ? `<img src="${logosTorneo[ev.Torneo]}" class="logo">` : `<span class="badge">${ev.Torneo ? ev.Torneo.substring(0,3).toUpperCase() : ''}</span>`;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `
            <div class="col-logo">${canalDisp}</div>
            <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Torneo || ''}</small><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
            <div class="col-logo">${torneoDisp}</div>
            <button class="btn-recordar" onclick="descargarRecordatorio('${ev.Evento}', '${ev.Fecha}', '${ev.Hora_Inicio}')">💾</button>
        `;

        if (fechaEvento === hoyStr) {
            if (minsAhora >= inicioMin && minsAhora <= finMin) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (fechaEvento > hoyStr) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}
// ... (mantiene tus funciones compartirApp y descargarRecordatorio)
