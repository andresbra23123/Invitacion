
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxSiCRsRQKr0NB9IWpPmKsUPbHKZFGj0-vCoCDU0PgCVFLdrcsp7n-YcNMwIbcPCqLJ/exec';

// Función para mostrar mensaje tipo toast/modal
function showMessage(msg) {
  const msgBox = document.getElementById('rsvpMessage');
  const msgText = document.getElementById('rsvpMessageText');
  msgText.textContent = msg;
  msgBox.style.display = 'flex';

  setTimeout(() => {
    msgBox.style.display = 'none';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvpForm');
  if (!form) {
    console.error('Formulario RSVP no encontrado');
    return;
  }
  
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) {
    console.error('Botón de envío no encontrado');
    return;
  }

  document.getElementById('rsvpMessageClose').addEventListener('click', () => {
    document.getElementById('rsvpMessage').style.display = 'none';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    submitButton.disabled = true;
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = 'Enviando <span class="spinner"></span>';

    const data = new URLSearchParams(new FormData(form));
    console.log(data.toString());

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: data
    })
    .then(res => res.text())
    .then(result => {
      if(result === "OK") {
        showMessage("¡Gracias por confirmar tu asistencia!");
        form.reset();
      } else {
        showMessage("Error al enviar: " + result);
      }
    })
    .catch(err => {
      showMessage("Error al enviar: " + err);
    })
    .finally(() => {
      // Restaurar botón
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    });
  });
});


