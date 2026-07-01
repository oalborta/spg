// 🔗 URL de tu Google Sheets
var CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

// 🛵 Proxy para que funcione desde GitHub Pages
var PROXY = 'https://api.allorigins.win/raw?url=';

// 📺 Logos de canales
var logos = {
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

// 🏆 Logos de torneos
var logosTorneo = {
    "MUNDIAL": "https://github.com/oalborta/spg/blob/main/fifa.png?raw=true",
    "WIMBLEDON": "https://github.com/oalborta/spg/blob/main/wimbledon.png?raw=true"
};

// 📥 Cargar datos del CSV
function cargarDatos() {
    document.getElementById('btnRecargar').innerText = 'Cargando...';
    
    Papa.parse(PROXY + encodeURIComponent(CSV_URL), {
        download: true,
        header: true,
        complete: function(res) {
            document.getElementById('btnRecargar').innerText = 'Recargar';
            
            var data = res.data.filter(function(row) {
                return row.Evento && row.Fecha;
            });
            
            clasificarEventos(data);
        },
        error: function(err) {
            document.getElementById('btnRecargar').innerText = 'Recargar';
            console.log('Error:', err);
        }
    });
}

// 📋 Clasificar y mostrar eventos
function clasificarEventos(eventos) {
    // Limpiar listas
    document.querySelectorAll('.lista').forEach(function(c) {
        c.innerHTML = '';
    });
    
    // Fecha de hoy a medianoche
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var hoyTs = hoy.getTime();
    
    // Hora actual en minutos
    var ahora = new Date();
    var minsAhora = (ahora.getHours() * 60) + ahora.getMinutes();

    // ⏰ ORDENAR: primero por fecha, luego por hora
    eventos.sort(function(a, b) {
        var pA = a.Fecha.split('-');
        var pB = b.Fecha.split('-');
        var fA = new Date(pA[0], pA[1] - 1, pA[2]).getTime();
        var fB = new Date(pB[0], pB[1] - 1, pB[2]).getTime();
        
        if (fA !== fB) return fA - fB;
        
        var hA = parseInt(a.Hora_Inicio.split(':')[0]);
        var mA = parseInt(a.Hora_Inicio.split(':')[1]);
        var hB = parseInt(b.Hora_Inicio.split(':')[0]);
        var mB = parseInt(b.Hora_Inicio.split(':')[1]);
        return (hA * 60 + mA) - (hB * 60 + mB);
    });

    // 🔄 Crear cada tarjeta de evento
    eventos.forEach(function(ev) {
        if (!ev.Fecha || !ev.Hora_Inicio || !ev.Hora_Fin) return;
        
        var partes = ev.Fecha.split('-');
        var fechaEvento = new Date(partes[0], partes[1] - 1, partes[2]);
        var fechaTs = fechaEvento.getTime();

        var hI = parseInt(ev.Hora_Inicio.split(':')[0]);
        var mI = parseInt(ev.Hora_Inicio.split(':')[1]);
        var hF = parseInt(ev.Hora_Fin.split(':')[0]);
        var mF = parseInt(ev.Hora_Fin.split(':')[1]);
        var inicioMin = (hI * 60) + mI;
        var finMin = (hF * 60) + mF;

        // Ocultar eventos que ya terminaron hoy
        if (fechaTs === hoyTs && minsAhora > finMin) return;

        // Logo del canal
        var logoCanal = logos[ev.Canal]
            ? '<img src="' + logos[ev.Canal] + '" class="logo">'
            : '<span class="badge">' + (ev.Canal ? ev.Canal.substring(0, 3).toUpperCase() : '') + '</span>';

        // Logo del torneo
        var logoTorneo = logosTorneo[ev.Torneo]
            ? '<img src="' + logosTorneo[ev.Torneo] + '" class="logo">'
            : '<span class="badge">' + (ev.Torneo ? ev.Torneo.substring(0, 3).toUpperCase() : '') + '</span>';

        // Crear tarjeta
        var div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML =
            '<div class="col-logo">' + logoCanal + '</div>' +
            '<div style="flex-grow:1;">' +
                '<strong>' + ev.Evento + '</strong><br>' +
                '<small>' + (ev.Torneo || '') + '</small><br>' +
                '<small>' + ev.Fecha + ' | ' + ev.Hora_Inicio + ' - ' + ev.Hora_Fin + '</small>' +
            '</div>' +
            '<div class="col-logo">' + logoTorneo + '</div>';

        // Botón recordar
        var btn = document.createElement('button');
        btn.className = 'btn-recordar';
        btn.innerText = 'Recordar';
        btn.onclick = function() {
            descargarRecordatorio(ev.Evento, ev.Fecha, ev.Hora_Inicio);
        };
        div.appendChild(btn);

        // 📂 Poner en la sección correcta
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

// 📅 Descargar recordatorio para calendario
function descargarRecordatorio(evento, fecha, hora) {
    var fLimpia = fecha.replace(/-/g, '');
    var hLimpia = hora.replace(/:/g, '') + '00';
    var ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:' + evento + '\nDTSTART:' + fLimpia + 'T' + hLimpia + '\nDESCRIPTION:Recordatorio de ' + evento + '\nEND:VEVENT\nEND:VCALENDAR';
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
}

// 📤 Compartir
function compartirApp() {
    var url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Programación Deportiva', url: url });
    } else {
        navigator.clipboard.writeText(url).then(function() {
            alert('Enlace copiado');
        });
    }
}

// 🚀 Arrancar la app
cargarDatos();
setInterval(cargarDatos, 60000);
