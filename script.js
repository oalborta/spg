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
