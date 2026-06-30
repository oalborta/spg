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
            const datosOrdenados = res.data.sort((a, b) => {
                const fechaA = new Date(a.Fecha.split('/').reverse().join('-')).getTime();
                const fechaB = new Date(b.Fecha.split('/').reverse().join('-')).getTime();
                if (fechaA !== fechaB) return fechaA - fechaB;
                const [hA, mA] = a.Hora_Inicio.split(':').map(Number);
                const [hB, mB] = b.Hora_Inicio.split(':').map(Number);
                return (hA * 60 + mA) - (hB * 60 + mB);
            });
            clasificarEventos(datosOrdenados);
            if (btn) btn.innerText = "Recargar";
        } 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    const ahora = new Date();
    const hoyTs = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
    const minsAhora = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento || !ev.Fecha) return;

        let fPartes = ev.Fecha.split('/');
        let fechaObj = new Date(fPartes[2], fPartes[1] - 1, fPartes[0]);
        const fechaTs = fechaObj.getTime();

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;

        if (fechaTs === hoyTs && minsAhora > finMin) return;

        // Lógica de visualización (Canal y Torneo)
        let canalDisp = logos[ev.Canal] ? `<img src="${logos[ev.Canal]}" class="logo">` : `<span class="badge">${ev.Canal}</span>`;
        let torneoDisp = logosTorneo[ev.Torneo] ? `<img src="${logosTorneo[ev.Torneo]}" class="logo">` : `<span class="badge">${ev.Torneo}</span>`;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `
            <div class="col-logo">${canalDisp}</div>
            <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Torneo || ''}</small><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
            <div class="col-logo">${torneoDisp}</div>
            <button class="btn-recordar" onclick="descargarRecordatorio('${ev.Evento}', '${ev.Fecha}', '${ev.Hora_Inicio}')">Recordar</button>
        `;

        if (fechaTs === hoyTs) {
            if (minsAhora >= inicioMin && minsAhora <= finMin) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (fechaTs > hoyTs) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

function compartirApp() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: 'Programación', url: url });
    else navigator.clipboard.writeText(url).then(() => alert("Enlace copiado"));
}

function descargarRecordatorio(evento, fecha, hora) {
    const f = fecha.replace(/\//g, '');
    const h = hora.replace(/:/g, '') + '00';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evento}\nDTSTART:${f.substring(4,8)}${f.substring(2,4)}${f.substring(0,2)}T${h}\nBEGIN:VALARM\nTRIGGER:-PT15M\nACTION:DISPLAY\nDESCRIPTION:Recordatorio: ${evento}\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
    link.download = 'evento.ics';
    link.click();
}

cargarDatos();
setInterval(cargarDatos, 60000);
