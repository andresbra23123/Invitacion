// const iframe = document.getElementById('hidden_iframe');

// iframe.onload = function() {
//     try {
//         // leer contenido del iframe
//         const content = iframe.contentDocument.body.innerText;
        
//         // limpiar el formulario
//         document.getElementById('rsvpForm').reset();
        
//         // mostrar mensaje de confirmación con el contenido devuelto por Apps Script
//         if (content === "OK") {
//             alert("¡Gracias por confirmar tu asistencia!");
//         } else {
//             alert("Error al enviar: " + content);
//         }

//     } catch (e) {
//         alert("Error al procesar la respuesta: " + e);
//     }
// };


const form = document.getElementById('rsvpForm');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTujIq6rUPrOgHy8MCjTA3MlHhU4Gz2H4MfyCzxEc-NElPfBc4fBnrPMpaSY5SGzFi/exec'; 

form.addEventListener('submit', e => {
  e.preventDefault(); // evitar submit normal

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
  });
});