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
    // Agrega tus otros canales aquí igual que los anteriores
};

function cargarDatos() {
    Papa.parse(CSV_URL, {
        download: true, header: true,
        complete: function(results) { clasificarEventos(results.data); }
    });
}

function compartirApp() {
    if (navigator.share) { navigator.share({ title: 'Programación', url: window.location.href }); }
    else { alert("Copia este enlace: " + window.location.href); }
}

function reservarEvento(evento, fecha, hora) {
    const horaInicio = fecha.replace(/-/g, '') + 'T' + hora.replace(':', '') + '00';
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evento}\nDTSTART:${horaInicio}\nDESCRIPTION:Alerta programada.\nBEGIN:VALARM\nTRIGGER:-PT30M\nACTION:DISPLAY\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
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
        const textoTiempo = (ev.Fecha === hoyStr) ? `${ev.Hora_Inicio}` : `${ev.Fecha} | ${ev.Hora_Inicio}`;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo" onerror="this.style.display='none'"> 
                         <div style="flex-grow: 1; margin-right: 10px;"><strong style="display:block;">${ev.Evento}</strong><small style="color: #666;">${textoTiempo}</small></div>
                         <button onclick="reservarEvento('${ev.Evento}', '${ev.Fecha}', '${ev.Hora_Inicio}')" class="btn-recordar">Recordar</button>`;

        if (ev.Fecha === hoyStr) {
            if (horaMinutos >= inicioMinutos && horaMinutos <= finMinutos) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (ev.Fecha > hoyStr) document.querySelector('#proximos .lista').appendChild(div);
    });
}

cargarDatos();
setInterval(cargarDatos, 60000);
