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
    Papa.parse(CSV_URL, { 
        download: true, 
        header: true, 
        complete: (res) => {
            const data = res.data.filter(row => row.Evento && row.Fecha);
            clasificarEventos(data);
        } 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyTs = hoy.getTime();
    
    const ahora = new Date();
    const minsAhora = (ahora.getHours() * 60) + ahora.getMinutes();

    // ✅ AQUÍ ESTÁ EL FIX: ordenar por fecha y luego por hora
    eventos.sort((a, b) => {
        // Primero ordenar por fecha
        const partesA = a.Fecha.split('-');
        const partesB = b.Fecha.split('-');
        const fechaA = new Date(partesA[0], partesA[1] - 1, partesA[2]).getTime();
        const fechaB = new Date(partesB[0], partesB[1] - 1, partesB[2]).getTime();
        
        if (fechaA !== fechaB) return fechaA - fechaB;
        
        // Si misma fecha, ordenar por hora de inicio
        const [hA, mA] = a.Hora_Inicio.split(':').map(Number);
        const [hB, mB] = b.Hora_Inicio.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
    });

    eventos.forEach(ev => {
        if (!ev.Fecha) return;
        
        const partes = ev.Fecha.split('-');
        const fechaEvento = new Date(partes[0], partes[1] - 1, partes[2]);
        const fechaTs = fechaEvento.getTime();

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = (hI * 60) + mI;
        const finMin = (hF * 60) + mF;

        // Ocultar eventos de hoy que ya terminaron
        if (fechaTs === hoyTs && minsAhora > finMin) return;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `
            <div class="col-logo">${logos[ev.Canal] ? `<img src="${logos[ev.Canal]}" class="logo">` : `<span class="badge">${ev.Canal ? ev.Canal.substring(0,3).toUpperCase() : ''}</span>`}</div>
            <div style="flex-grow:1;">
                <strong>${ev.Evento}</strong><br>
                <small>${ev.Torneo || ''}</small><br>
                <small>${ev.Fecha} | ${ev.Hora_Inicio}</small>
            </div>
            <div class="col-logo">${logosTorneo[ev.Torneo] ? `<img src="${logosTorneo[ev.Torneo]}" class="logo">` : `<span class="badge">${ev.Torneo ? ev.Torneo.substring(0,3).toUpperCase() : ''}</span>`}</div>
        `;
        
        const btn = document.createElement('button');
        btn.className = 'btn-recordar';
        btn.innerText = 'Recordar';
        btn.onclick = () => descargarRecordatorio(ev.Evento, ev.Fecha, ev.Hora_Inicio);
        div.appendChild(btn);

        // Clasificar según fecha
        if (fechaTs === hoyTs) {
            if (minsAhora >= inicioMin && minsAhora <= finMin) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (fechaTs > hoyTs) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

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
    if (navigator.share) navigator.share({ title: 'Programación', url: url });
    else navigator.clipboard.writeText(url).then(() => alert("Enlace copiado"));
}

cargarDatos();
setInterval(cargarDatos, 60000);
