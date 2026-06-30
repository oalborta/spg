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
    Papa.parse(CSV_URL, { 
        download: true, header: true, 
        complete: (res) => clasificarEventos(res.data) 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    
    const ahora = new Date();
    const hoyTimestamp = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento || !ev.Fecha) return;

        // Limpieza de datos
        let fPartes = ev.Fecha.includes('/') ? ev.Fecha.split('/') : ev.Fecha.split('-');
        let fechaObj = ev.Fecha.includes('/') ? new Date(fPartes[2], fPartes[1] - 1, fPartes[0]) : new Date(fPartes[0], fPartes[1] - 1, fPartes[2]);
        const fechaTimestamp = fechaObj.getTime();

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;

        // Crear elemento de evento
        const div = document.createElement('div');
        div.className = 'evento';

        // Lógica explicita de logo
        let imgTag = '';
        if (logos[ev.Canal]) {
            imgTag = `<img src="${logos[ev.Canal]}" class="logo" onerror="this.style.display='none'">`;
        }

        // Esto va dentro del bucle forEach de clasificarEventos:
div.innerHTML = `${imgTag}
                 <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br>
                 <small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
                 <button class="btn-recordar" onclick="descargarRecordatorio('${ev.Evento}', '${ev.Fecha}', '${ev.Hora_Inicio}')">Recordar</button>`;

        // Clasificación
        if (fechaTimestamp === hoyTimestamp) {
            if (minutosAhora >= inicioMin && minutosAhora <= finMin) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (fechaTimestamp > hoyTimestamp) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}
// 1. Función para compartir (copia al portapapeles)
function compartirApp() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Programación Deportiva', url: url });
    } else {
        navigator.clipboard.writeText(url).then(() => alert("Enlace copiado al portapapeles."));
    }
}

// 2. Función para descargar el recordatorio (ALERTA A 15 MIN)
function descargarRecordatorio(evento, fecha, hora) {
    const fechaISO = fecha.replace(/-/g, '');
    const horaISO = hora.replace(/:/g, '') + '00';
    const timestamp = fechaISO + 'T' + horaISO;

    // Nota el cambio a TRIGGER:-PT15M
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${evento}
DTSTART:${timestamp}
DESCRIPTION:Alerta 15 min antes del evento.
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ${evento} empieza pronto.
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
}

// 3. Función recargar con feedback visual
function cargarDatos() {
    const btn = document.querySelector('button[onclick="cargarDatos()"]');
    if(btn) btn.innerText = "Actualizando...";
    Papa.parse(CSV_URL, { 
        download: true, header: true, 
        complete: (res) => {
            clasificarEventos(res.data);
            if(btn) btn.innerText = "Recargar";
        }
    });
}

cargarDatos();
setInterval(cargarDatos, 60000);
