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
 };

function cargarDatos() {
    Papa.parse(CSV_URL, { download: true, header: true, complete: (res) => clasificarEventos(res.data) });
}
function compartirApp() {
    navigator.share ? navigator.share({title: 'Programación', url: window.location.href}) : alert("Copia: " + window.location.href);
}
function reservarEvento(ev, fe, ho) {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${ev}\nDTSTART:${fe.replace(/-/g,'')}T${ho.replace(/:/g,'')}00\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], {type: 'text/calendar'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = 'evento.ics'; link.click();
}
function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const hoy = new Date().toISOString().split('T')[0];
    eventos.forEach(ev => {
        if (!ev.Evento) return;
        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal]||''}" class="logo" onerror="this.style.display='none'">
                         <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Fecha === hoy ? ev.Hora_Inicio : ev.Fecha + ' ' + ev.Hora_Inicio}</small></div>
                         <button onclick="reservarEvento('${ev.Evento}','${ev.Fecha}','${ev.Hora_Inicio}')" class="btn-recordar">Recordar</button>`;
        if(ev.Fecha === hoy) document.querySelector('#hoy .lista').appendChild(div);
        else if(ev.Fecha > hoy) document.querySelector('#proximos .lista').appendChild(div);
    });
}
cargarDatos();
