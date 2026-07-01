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
            // Filtramos filas vacías y ordenamos
            const data = res.data.filter(row => row.Evento && row.Fecha);
            data.sort((a, b) => {
                if (a.Fecha !== b.Fecha) return a.Fecha.localeCompare(b.Fecha);
                const [hA, mA] = a.Hora_Inicio.split(':').map(Number);
                const [hB, mB] = b.Hora_Inicio.split(':').map(Number);
                return (hA * 60 + mA) - (hB * 60 + mB);
            });
            clasificarEventos(data);
            if (btn) btn.innerText = "Recargar";
        } 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0]; 
    const minsAhora = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        // 1. Limpiamos y convertimos a fecha real
        const fechaEvento = new Date(ev.Fecha + 'T00:00:00').getTime();
        const hoyTs = new Date().setHours(0,0,0,0);
        
        // 2. Calculamos los minutos para el horario
        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;
        const minsAhora = ahora.getHours() * 60 + ahora.getMinutes();

        // 3. Comparación matemática
        const esHoy = (fechaEvento === hoyTs);
        const esAhora = (minsAhora >= inicioMin && minsAhora <= finMin);

        // Debug para ver qué está pasando exactamente
        console.log(`Evento: ${ev.Evento} | Fecha: ${ev.Fecha} | EsHoy: ${esHoy}`);

        // Crear elemento visual
        let canalDisp = logos[ev.Canal] ? `<img src="${logos[ev.Canal]}" class="logo">` : `<span class="badge">${ev.Canal.substring(0,3).toUpperCase()}</span>`;
        let torneoDisp = logosTorneo[ev.Torneo] ? `<img src="${logosTorneo[ev.Torneo]}" class="logo">` : `<span class="badge">${ev.Torneo ? ev.Torneo.substring(0,3).toUpperCase() : ''}</span>`;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `
            <div class="col-logo">${canalDisp}</div>
            <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Torneo || ''}</small><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
            <div class="col-logo">${torneoDisp}</div>
        `;
        const btn = document.createElement('button');
        btn.className = 'btn-recordar';
        btn.innerText = 'Recordar';
        btn.onclick = () => descargarRecordatorio(ev.Evento, ev.Fecha, ev.Hora_Inicio);
        div.appendChild(btn);

        // Clasificación
        if (esHoy && esAhora) {
            document.querySelector('#ahora .lista').appendChild(div);
        } else if (esHoy) {
            document.querySelector('#hoy .lista').appendChild(div);
        } else if (fechaEvento > hoyTs) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });

function descargarRecordatorio(evento, fecha, hora) {
    const fLimpia = fecha.replace(/-/g, '');
    const hLimpia = hora.replace(/:/g, '') + '00';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evento}\nDTSTART:${fLimpia}T${hLimpia}\nDESCRIPTION:Recordatorio de ${evento}\nEND:VEVENT\nEND:VCALENDAR`;
    
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
}
function compartirApp() {
    const url = window.location.href;
    
    // Intentamos el modo nativo del celular
    if (navigator.share) {
        navigator.share({
            title: 'Programación Deportiva',
            text: 'Mira la programación deportiva:',
            url: url
        }).catch((err) => {
            console.log("Compartir cancelado o falló, usando copia manual:", err);
            copiarAlPortapapeles(url);
        });
    } else {
        // Modo fallback (computadora o navegadores antiguos)
        copiarAlPortapapeles(url);
    }
}

function copiarAlPortapapeles(texto) {
    // Usamos el API moderna del portapapeles
    navigator.clipboard.writeText(texto).then(() => {
        alert("¡Enlace copiado al portapapeles!");
    }).catch(err => {
        console.error("Error al copiar:", err);
        // Fallback final para navegadores muy antiguos
        const input = document.createElement('input');
        input.value = texto;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert("Enlace copiado manualmente.");
    });
}
cargarDatos();
setInterval(cargarDatos, 60000);
