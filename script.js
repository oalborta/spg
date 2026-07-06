var CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpWDOBhG0TjMrBBi1EYQ8fjdlqTKYOV5PZqlgPrm_Pp8qLE-kcX_QoGPLZTofZ7W1JNYHEpBfLvlLL/pub?output=csv';

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

var logosTorneo = {
    "MUNDIAL": "https://github.com/oalborta/spg/blob/main/fifa.png?raw=true",
    "F1": "https://github.com/oalborta/spg/blob/main/f1.png?raw=true",
    "TOUR DE FRANCE": "https://github.com/oalborta/spg/blob/main/TOUR%20DE%20FRANCE.png?raw=true",
    "WIMBLEDON": "https://github.com/oalborta/spg/blob/main/wimbledon.png?raw=true"
};

var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function cargarDatos() {
    document.getElementById('btnRecargar').innerText = 'Cargando...';
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function(res) {
            document.getElementById('btnRecargar').innerText = '↻ Recargar';
            var data = res.data.filter(function(row) {
                return row.Evento && row.Fecha;
            });
            clasificarEventos(data);
        }
    });
}

function obtenerCuentaRegresiva(fecha, hora) {
    var partes = fecha.split('-');
    var h = parseInt(hora.split(':')[0]);
    var m = parseInt(hora.split(':')[1]);
    var eventoFecha = new Date(partes[0], partes[1] - 1, partes[2], h, m);
    var ahora = new Date();
    var diff = eventoFecha - ahora;
    var horas = Math.floor(diff / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    
    if (horas <= 0 && mins <= 0) return '';
    if (horas === 0) return 'En ' + mins + ' min';
    if (horas === 1) return 'En 1 hora';
    if (horas < 24) return 'En ' + horas + ' horas';
    var dias = Math.floor(horas / 24);
    if (dias === 1) return 'Mañana';
    return 'En ' + dias + ' días';
}

function fechaLegible(fecha) {
    var partes = fecha.split('-');
    var d = new Date(partes[0], partes[1] - 1, partes[2]);
    return diasSemana[d.getDay()] + ' ' + d.getDate() + ' ' + meses[d.getMonth()];
}

function clasificarEventos(eventos) {
    document.querySelectorAll('.lista').forEach(function(c) {
        c.innerHTML = '';
    });

    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var hoyTs = hoy.getTime();

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

    var ultimoDiaMostrado = '';

    eventos.forEach(function(ev) {
        if (!ev.Fecha || !ev.Hora_Inicio || !ev.Hora_Fin) return;

        var partes = ev.Fecha.split('-');
        var fechaEvento = new Date(partes[0], partes[1] - 1, partes[2]);
        var fechaTs = fechaEvento.getTime();

        var hI = parseInt(ev.Hora_Inicio.split(':')[0]);
        var mI = parseInt(ev.Hora_Inicio.split(':')[1]);
        var hF = parseInt(ev.Hora_Fin.split(':')[0]);
        var mF = parseInt(ev.Hora_Fin.split(':')[1]);

        var fechaInicio = new Date(partes[0], partes[1] - 1, partes[2], hI, mI);
        var fechaFin = new Date(partes[0], partes[1] - 1, partes[2], hF, mF);

        if (fechaFin <= fechaInicio) {
            fechaFin.setDate(fechaFin.getDate() + 1);
        }

        var ahora = new Date();

        if (ahora > fechaFin) return;

        var estaEnVivo = (ahora >= fechaInicio && ahora <= fechaFin);
        var esHoy = (fechaTs === hoyTs);

        if (!esHoy && estaEnVivo) {
            esHoy = true;
        }

        var logoCanal = logos[ev.Canal]
            ? '<img src="' + logos[ev.Canal] + '" class="logo">'
            : '<span class="badge">' + (ev.Canal ? ev.Canal.substring(0, 3).toUpperCase() : '') + '</span>';

        var logoTorneo = logosTorneo[ev.Torneo]
            ? '<img src="' + logosTorneo[ev.Torneo] + '" class="logo">'
            : '<span class="badge">' + (ev.Torneo ? ev.Torneo.substring(0, 3).toUpperCase() : '') + '</span>';

        var cuenta = obtenerCuentaRegresiva(ev.Fecha, ev.Hora_Inicio);
        var cuentaHtml = cuenta ? '<div class="cuenta-regresiva">' + cuenta + '</div>' : '';

        var div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML =
            '<div class="col-logo">' + logoCanal + '</div>' +
            '<div class="evento-info" style="flex-grow:1;">' +
                '<strong>' + ev.Evento + '</strong><br>' +
                '<small>' + (ev.Torneo || '') + '</small><br>' +
                '<span class="hora-destacada">' + ev.Hora_Inicio + '</span>' +
                '<small> - ' + ev.Hora_Fin + '</small>' +
                cuentaHtml +
            '</div>' +
            '<div class="col-logo">' + logoTorneo + '</div>';

        var btn = document.createElement('button');
        btn.className = 'btn-recordar';
        btn.innerText = 'Recordar';
        btn.onclick = function() {
            descargarRecordatorio(ev.Evento, ev.Fecha, ev.Hora_Inicio);
        };
        div.appendChild(btn);

        if (esHoy) {
            if (estaEnVivo) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (fechaTs > hoyTs) {
            if (ev.Fecha !== ultimoDiaMostrado) {
                ultimoDiaMostrado = ev.Fecha;
                var sep = document.createElement('div');
                sep.className = 'separador-dia';
                sep.innerText = fechaLegible(ev.Fecha);
                document.querySelector('#proximos .lista').appendChild(sep);
            }
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });

    ['ahora', 'hoy', 'proximos'].forEach(function(id) {
        var lista = document.querySelector('#' + id + ' .lista');
        if (lista.children.length === 0) {
            lista.innerHTML = '<div class="sin-eventos">Sin eventos</div>';
        }
    });
}

// 🛠️ FUNCIÓN NUEVA "A PRUEBA DE BALAS" PARA MAC
function descargarRecordatorio(evento, fecha, hora) {
    // 1. Limpiamos el nombre del evento (quitamos saltos de línea y comas que hacen fallar a Mac)
    var eventoLimpio = evento.replace(/[\n\r]+/g, ' ').replace(/,/g, ' ');

    var fLimpia = fecha.replace(/-/g, '');
    var hLimpia = hora.replace(/:/g, '') + '00';

    // 2. Formato estricto que le gusta a Apple Calendar
    var ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Programacion Deportiva//ES\nBEGIN:VEVENT\nDTSTART:' + fLimpia + 'T' + hLimpia + '\nDTEND:' + fLimpia + 'T' + hLimpia + '\nSUMMARY:' + eventoLimpio + '\nDESCRIPTION:Recordatorio de ' + eventoLimpio + '\nEND:VEVENT\nEND:VCALENDAR';
    
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento.ics';
    
    // 3. Truco para forzar la descarga en navegadores de Mac
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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

cargarDatos();
setInterval(cargarDatos, 60000);
