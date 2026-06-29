const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';
const logos = { "ESPN": "https://github.com/oalborta/spg/blob/main/espn.png?raw=true",
    "ESPN 2": "https://github.com/oalborta/spg/blob/main/espn2.png?raw=true",
    "ESPN 3": "https://github.com/oalborta/spg/blob/main/espn3.png?raw=true",
    "ESPN 4": "https://github.com/oalborta/spg/blob/main/espn4.png?raw=true",
    "ESPN 5": "https://github.com/oalborta/spg/blob/main/espn5.png?raw=true",
    "ESPN 6": "https://github.com/oalborta/spg/blob/main/espn6.png?raw=true",
    "ESPN 7": "https://github.com/oalborta/spg/blob/main/espn7.png?raw=true",
    "TS 1": "https://github.com/oalborta/spg/blob/main/ts1.png?raw=true",
    "TS 2": "https://github.com/oalborta/spg/blob/main/ts2.png?raw=true"
;

function cargarDatos() {
    Papa.parse(CSV_URL, { download: true, header: true, complete: (results) => clasificarEventos(results.data) });
}

function compartirApp() {
    if (navigator.share) navigator.share({ title: 'Programación', url: window.location.href });
    else alert("Copia este link: " + window.location.href);
}

function reservarEvento(evento, fecha, hora) {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evento}\nDTSTART:${fecha.replace(/-/g, '')}T${hora.replace(/:/g, '')}00\nBEGIN:VALARM\nTRIGGER:-PT30M\nACTION:DISPLAY\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const hoyStr = new Date().toISOString().split('T')[0];
    const ahoraMin = new Date().getHours() * 60 + new Date().getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento) return;
        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicio = hI * 60 + mI;
        const fin = hF * 60 + mF;
        
        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo" onerror="this.style.display='none'"> 
                         <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Fecha === hoyStr ? ev.Hora_Inicio : ev.Fecha + ' ' + ev.Hora_Inicio}</small></div>
                         <button onclick="reservarEvento('${ev.Evento}', '${ev.Fecha}', '${ev.Hora_Inicio}')" class="btn-recordar">Recordar</button>`;

        if (ev.Fecha === hoyStr && ahoraMin >= inicio && ahoraMin <= fin) document.querySelector('#ahora .lista').appendChild(div);
        else if (ev.Fecha === hoyStr) document.querySelector('#hoy .lista').appendChild(div);
        else if (ev.Fecha > hoyStr) document.querySelector('#proximos .lista').appendChild(div);
    });
}
cargarDatos();
setInterval(cargarDatos, 60000);
