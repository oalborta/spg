const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

// Diccionario de Logos
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
        download: true, 
        header: true, 
        complete: (res) => clasificarEventos(res.data) 
    });
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(c => c.innerHTML = '');
    
    // Fecha de hoy formato AAAA-MM-DD
    const hoy = new Date().toISOString().split('T')[0];
    const ahoraMin = new Date().getHours() * 60 + new Date().getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento || !ev.Fecha) return;

        // Normalizar fecha (por si viene como DD/MM/AAAA)
        let fechaNormalizada = ev.Fecha;
        if (ev.Fecha.includes('/')) {
            const p = ev.Fecha.split('/');
            fechaNormalizada = `${p[2]}-${p[1]}-${p[0]}`;
        }

        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMin = hI * 60 + mI;
        const finMin = hF * 60 + mF;

        const div = document.createElement('div');
        div.className = 'evento';
        
        // Aquí insertamos el logo. Si el nombre del canal en el sheet no está en el diccionario, no pone nada.
        const urlLogo = logos[ev.Canal] || '';
        const imgTag = urlLogo ? `<img src="${urlLogo}" class="logo">` : '';

        div.innerHTML = `${imgTag}
                         <div style="flex-grow:1;"><strong>${ev.Evento}</strong><br><small>${ev.Fecha} | ${ev.Hora_Inicio}</small></div>
                         <button class="btn-recordar" onclick="alert('Programado')">Recordar</button>`;

        if (fechaNormalizada === hoy) {
            if (ahoraMin >= inicioMin && ahoraMin <= finMin) document.querySelector('#ahora .lista').appendChild(div);
            else document.querySelector('#hoy .lista').appendChild(div);
        } else if (fechaNormalizada > hoy) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

cargarDatos();
setInterval(cargarDatos, 60000);
