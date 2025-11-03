const form = document.getElementById('rsvpForm');
const submitButton = form.querySelector('button[type="submit"]');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTujIq6rUPrOgHy8MCjTA3MlHhU4Gz2H4MfyCzxEc-NElPfBc4fBnrPMpaSY5SGzFi/exec';

form.addEventListener('submit', e => {
  e.preventDefault();

  // Deshabilitar botón y mostrar spinner
  submitButton.disabled = true;
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = 'Enviando <span class="spinner"></span>';

  const data = new URLSearchParams(new FormData(form));

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: data
  })
  .then(res => res.text())
  .then(result => {
    if(result === "OK") {
      alert("¡Gracias por confirmar tu asistencia!");
      form.reset();
    } else {
      alert("Error al enviar: " + result);
    }
  })
  .catch(err => {
    alert("Error al enviar: " + err);
  })
  .finally(() => {
    // Restaurar botón
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  });
});
