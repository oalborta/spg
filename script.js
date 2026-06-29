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

function cargarDatos() {
    Papa.parse(CSV_URL, {
        download: true, header: true,
        complete: function(results) { clasificarEventos(results.data); }
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0]; 
    const horaMinutos = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento) return;
        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMinutos = hI * 60 + mI;
        const finMinutos = hF * 60 + mF;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo" onerror="this.style.display='none'"> 
                         <div><strong style="display:block;">${ev.Evento}</strong><small style="color: #666;">${ev.Hora_Inicio} - ${ev.Canal}</small></div>`;

        if (ev.Fecha === hoyStr) {
            if (horaMinutos >= inicioMinutos && horaMinutos <= finMinutos) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (ev.Fecha > hoyStr) document.querySelector('#proximos .lista').appendChild(div);
    });
}

cargarDatos();
setInterval(cargarDatos, 60000);
