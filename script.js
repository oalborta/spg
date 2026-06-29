function clasificarEventos(eventos) {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0]; 
    
    // Convertimos la hora actual a minutos para comparar fácilmente
    const horaActualMinutos = ahora.getHours() * 60 + ahora.getMinutes();

    eventos.forEach(ev => {
        if (!ev.Evento) return;

        // Convertimos Hora_Inicio y Hora_Fin a minutos
        const [hI, mI] = ev.Hora_Inicio.split(':').map(Number);
        const [hF, mF] = ev.Hora_Fin.split(':').map(Number);
        const inicioMinutos = hI * 60 + mI;
        const finMinutos = hF * 60 + mF;

        const div = document.createElement('div');
        div.className = 'evento';
        div.innerHTML = `<img src="${logos[ev.Canal] || ''}" class="logo"> 
                         <strong>${ev.Evento}</strong><br><small>${ev.Hora_Inicio} - ${ev.Canal}</small>`;

        // Lógica de filtrado con minutos
        if (ev.Fecha === hoyStr) {
            if (horaActualMinutos >= inicioMinutos && horaActualMinutos <= finMinutos) {
                document.querySelector('#ahora .lista').appendChild(div);
            } else {
                document.querySelector('#hoy .lista').appendChild(div);
            }
        } else if (ev.Fecha > hoyStr) {
            document.querySelector('#proximos .lista').appendChild(div);
        }
    });
}
