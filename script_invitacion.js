// ===========================================
// script_invitacion.js - Funcionalidades de la invitación
// ===========================================

function animarScroll() {
    const alturaVentana = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.animar-scroll').forEach(el => {
        const { top, bottom } = el.getBoundingClientRect();
        // Si la parte superior está antes de (ventana - 60px) y la inferior aún no ha pasado 60px
        const estaVisible = top < alturaVentana - 60 && bottom > 60;
        el.classList.toggle('visible', estaVisible);
    });


    // Animación específica para las fotos
    document.querySelectorAll('.photo-item').forEach(el => {
        const { top, bottom } = el.getBoundingClientRect();
        const estaVisible = top < alturaVentana - 100 && bottom > 100;
        el.classList.toggle('visible', estaVisible);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // ============== 1. ANIMACIONES AL HACER SCROLL ==============
    // Ejecutar al cargar y en cada scroll
    window.addEventListener('scroll', animarScroll);
    const contenedorMobile = document.querySelector('.split-right');
    if (contenedorMobile) contenedorMobile.addEventListener('scroll', animarScroll);

    // ============== 2. MODAL DE DATOS BANCARIOS ==============
    const btnBancos = document.getElementById('btnBancos');
    const modalBancos = document.getElementById('modalBancos');

    if (btnBancos && modalBancos) {
        const closeBtn = modalBancos.querySelector('.modal-close');

        btnBancos.addEventListener('click', () => modalBancos.classList.add('visible'));
        closeBtn.addEventListener('click', () => modalBancos.classList.remove('visible'));
        modalBancos.addEventListener('click', (e) => {
            if (e.target === modalBancos) modalBancos.classList.remove('visible');
        });
    }

    // ============== 3. AGREGAR AL CALENDARIO (.ics) ==============
    // ============== 6. COUNTDOWN ==============

    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const targetDate = new Date(
            countdownElement.dataset.fecha + 'T' +
            countdownElement.dataset.hora + ':00'
        ).getTime();

        if (isNaN(targetDate)) {
            console.error('Fecha inválida en data-fecha o data-hora');
            return;
        }

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                document.querySelectorAll('#countdown span').forEach(span => span.textContent = '0');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('cd-days').textContent = days;
            document.getElementById('cd-hours').textContent = hours;
            document.getElementById('cd-mins').textContent = minutes;
            document.getElementById('cd-secs').textContent = seconds;
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    const btn = document.getElementById('addCalendar');
    if (btn && countdown) {
        const titulo = "Invitación de Braayan y Angie";
        const descripcion = "¡Te invitamos a nuestro evento!";
        const ubicacion = "Salón de eventos Alta Loma";

        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // 1) Tomar la fecha y hora desde el dataset del countdown
            const [year, month, day] = countdown.dataset.fecha.split('-').map(Number);
            const [hour, minute] = countdown.dataset.hora.split(':').map(Number);

            // 2) Crear objetos Date
            const start = new Date(year, month - 1, day, hour, minute);
            const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Duración 2 h

            // 3) Formato ICS
            function fmt(d) {
                const pad = (n) => String(n).padStart(2, '0');
                return (
                    d.getFullYear() +
                    pad(d.getMonth() + 1) +
                    pad(d.getDate()) +
                    'T' +
                    pad(d.getHours()) +
                    pad(d.getMinutes()) +
                    pad(d.getSeconds())
                );
            }

            // 4) Generar contenido del archivo .ics
            const icsLines = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Eventermas//InviCalendar//ES',
                'BEGIN:VEVENT',
                'UID:' + Date.now() + '@eventermas.com',
                'DTSTAMP:' + fmt(new Date()),
                'DTSTART:' + fmt(start),
                'DTEND:' + fmt(end),
                'SUMMARY:' + titulo,
                'DESCRIPTION:' + descripcion,
                'LOCATION:' + ubicacion,
                'END:VEVENT',
                'END:VCALENDAR',
            ].join('\r\n');

            // 5) Descargar archivo .ics
            const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invitacion.ics';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }


    // ============== 6. PRE-LLENAR NOMBRE DESDE URL ==============
    // Leer el parámetro 'nombre' o 'invitado' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreInvitado = urlParams.get('nombre') || urlParams.get('invitado');
    
    if (nombreInvitado) {
        // Función para prellenar el nombre
        const prellenarNombre = () => {
            const guestNameInput = document.getElementById('guest_name');
            if (guestNameInput) {
                // Decodificar el nombre (por si tiene espacios o caracteres especiales)
                const nombreDecodificado = decodeURIComponent(nombreInvitado);
                guestNameInput.value = nombreDecodificado;
                
                // Opcional: mostrar un mensaje personalizado
                const invitadoSection = document.querySelector('.invitadoinicial h2:last-child');
                if (invitadoSection) {
                    invitadoSection.innerHTML = `<strong>${nombreDecodificado}</strong>`;
                }
                return true;
            }
            return false;
        };
        
        // Intentar prellenar inmediatamente
        if (!prellenarNombre()) {
            // Si no está disponible, esperar un poco más
            setTimeout(() => {
                prellenarNombre();
            }, 100);
        }
    }



    // ============== 4. CONTROL DE MÚSICA ==============
    //musica    
    const withBtn = document.getElementById('withMusicBtn');
    const noBtn = document.getElementById('noMusicBtn');
    const overlay = document.getElementById('musicOverlay');
    const music = document.getElementById('bgMusic');

    const floatingControl = document.getElementById('floatingMusicControl');
    const pausePlayBtn = document.getElementById('pausePlayBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    withBtn.addEventListener('click', () => {
        music.play();
        overlay.remove();
        floatingControl.style.display = 'block';
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });
    noBtn.addEventListener('click', () => {
        overlay.remove();
    });

    // Control flotante de pausa/play
    pausePlayBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            music.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    // ============== 5. SINCRONIZAR SCROLL (PANEL IZQUIERDO/DERECHO) ==============
    const leftPane = document.querySelector('.split-left');
    const rightPane = document.querySelector('.split-right');

    if (leftPane && rightPane) {
        leftPane.addEventListener('wheel', (e) => {
            e.preventDefault();
            rightPane.scrollBy({ top: e.deltaY, behavior: 'auto' });
        });
    }
});