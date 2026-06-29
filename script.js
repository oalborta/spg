const CSV_URL = 'TU_URL_AQUI'; 

const logos = {
    "ESPN": "https://upload.wikimedia.org/wikipedia/commons/e/e3/ESPN.svg",
    "Fox Sports": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fox_Sports_logo.svg"
};

function toggleDarkMode() { document.body.classList.toggle('dark'); }

function cargarDatos() {
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function(results) {
            clasificarEventos(results.data);
        }
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
                         <div><strong>${ev.Evento}</strong><br><small>${ev.Hora_Inicio} | ${ev.Canal}</small></div>`;

        if (ev.Fecha === hoyStr) {
            if (horaMinutos >= inicioMinutos && horaMinutos <= finMinutos) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (ev.Fecha > hoyStr) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}

cargarDatos();
setInterval(cargarDatos, 60000);
