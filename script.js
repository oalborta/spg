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
// ... (arriba mantienes tu diccionario 'logos' para canales)

// Nuevo diccionario para logos de Torneos
const logosTorneo = {
    "MUNDIAL": "https://github.com/oalborta/spg/blob/main/fifa.png?raw=true",
    "WIMBLEDON": "https://github.com/oalborta/spg/blob/main/wimbledon.png?raw=true"
    // Agrega aquí todos los que necesites
};

// ... (dentro de clasificarEventos, en el bucle forEach)

// 1. Lógica para Canal
let canalDisplay = logos[ev.Canal] 
    ? `<img src="${logos[ev.Canal]}" class="logo">` 
    : `<span class="badge-canal">${ev.Canal}</span>`;

// 2. Lógica para Torneo (Nueva columna)
let torneoDisplay = logosTorneo[ev.Torneo] 
    ? `<img src="${logosTorneo[ev.Torneo]}" class="logo-torneo">` 
    : `<span class="badge-torneo">${ev.Torneo}</span>`;

// Construcción del HTML
div.innerHTML = `
    <div class="column-left">${canalDisplay}</div>
    <div style="flex-grow:1;">
        <strong>${ev.Evento}</strong><br>
        <small>${ev.Torneo || ''}</small><br>
        <small>${ev.Fecha} | ${ev.Hora_Inicio}</small>
    </div>
    <div class="column-right">${torneoDisplay}</div>
    <button class="btn-recordar" onclick="descargarRecordatorio(...)">Recordar</button>
`;

function cargarDatos() {
    const btn = document.getElementById('btnRecargar');
    if (btn) btn.innerText = "Actualizando...";
    
    Papa.parse(CSV_URL, { 
        download: true, header: true, 
        complete: (res) => {
            clasificarEventos(res.data);
            if (btn) btn.innerText = "Recargar";
        } 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const ahora = new Date();
    const hoyTimestamp = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento || !ev.Fecha) return;

        let fPartes = ev.Fecha.includes('/') ? ev.Fecha.split('/') : ev.Fecha.split('-');
        let fechaObj = ev.Fecha.includes('/') ? new Date(fPartes[2], fPartes[1] - 1, fPartes[0]) : new Date(fPartes[0], fPartes[1] - 1, fPartes[2]);
        const fechaTimestamp = fechaObj.getTime();

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;

        if (fechaTimestamp === hoyTimestamp && minutosAhora > finMin) return;

        const div = document.createElement('div');
        div.className = 'evento';
        let imgTag = logos[ev.Canal] ? `<img src="${logos[ev.Canal]}" class="logo" onerror="this.style.display='none'">` : '';

        div.innerHTML = `${imgTag}
            <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
            <button class="btn-recordar" onclick="descargarRecordatorio('${ev.Evento}', '${ev.Fecha}', '${ev.Hora_Inicio}')">Recordar</button>`;

        if (fechaTimestamp === hoyTimestamp) {
            if (minutosAhora >= inicioMin && minutosAhora <= finMin) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (fechaTimestamp > hoyTimestamp) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

function compartirApp() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Programación', url: url });
    } else {
        navigator.clipboard.writeText(url).then(() => alert("Enlace copiado al portapapeles."));
    }
}

function descargarRecordatorio(evento, fecha, hora) {
    const fechaISO = fecha.replace(/-/g, '').replace(/\//g, '');
    const horaISO = hora.replace(/:/g, '') + '00';
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evento}\nDTSTART:${fechaISO}T${horaISO}\nBEGIN:VALARM\nTRIGGER:-PT15M\nACTION:DISPLAY\nDESCRIPTION:Recordatorio: ${evento}\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
}

cargarDatos();
