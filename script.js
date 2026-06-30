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
    const hoy = new Date().toISOString().split('T')[0];
    const ahoraMin = new Date().getHours() * 60 + new Date().getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento || !ev.Fecha) return;
        
        const inicio = parseInt(ev.Hora_Inicio.split(':')[0])*60 + parseInt(ev.Hora_Inicio.split(':')[1]);
        const fin = parseInt(ev.Hora_Fin.split(':')[0])*60 + parseInt(ev.Hora_Fin.split(':')[1]);

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo" onerror="this.style.display='none'">
                         <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
                         <button onclick="reservarEvento('${ev.Evento}','${ev.Fecha}','${ev.Hora_Inicio}')" class="btn-recordar">Recordar</button>`;

        if (ev.Fecha === hoy) {
            if (ahoraMin >= inicio && ahoraMin <= fin) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (ev.Fecha > hoy) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}
cargarDatos();
setInterval(cargarDatos, 60000);
