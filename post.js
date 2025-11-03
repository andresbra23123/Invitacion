const form = document.getElementById('rsvpForm');
const submitButton = form.querySelector('button[type="submit"]');
const messageContainer = document.getElementById('rsvpMessage');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTujIq6rUPrOgHy8MCjTA3MlHhU4Gz2H4MfyCzxEc-NElPfBc4fBnrPMpaSY5SGzFi/exec';

form.addEventListener('submit', e => {
  e.preventDefault();

  // Deshabilitar botón y mostrar spinner
  submitButton.disabled = true;
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = 'Enviando <span class="spinner"></span>';
  messageContainer.innerHTML = ''; // limpiar mensaje previo

  const data = new URLSearchParams(new FormData(form));

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: data
  })
  .then(res => res.text())
  .then(result => {
    if(result === "OK") {
      messageContainer.innerHTML = `<div style="padding:1em; background-color:#d4edda; color:#155724; border-radius:8px; display:inline-block;">
                                      ¡Gracias por confirmar tu asistencia!
                                    </div>`;
      form.reset();
    } else {
      messageContainer.innerHTML = `<div style="padding:1em; background-color:#f8d7da; color:#721c24; border-radius:8px; display:inline-block;">
                                      Error al enviar: ${result}
                                    </div>`;
    }
  })
  .catch(err => {
    messageContainer.innerHTML = `<div style="padding:1em; background-color:#f8d7da; color:#721c24; border-radius:8px; display:inline-block;">
                                    Error al enviar: ${err}
                                  </div>`;
  });
});
