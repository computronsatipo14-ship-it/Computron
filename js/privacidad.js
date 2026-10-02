/* =====================================================================
   SISTEMA DE PRIVACIDAD — COMPUTRON
   - Muestra un modal de consentimiento en la primera visita.
   - Permite abrir la Política de Privacidad completa desde el modal,
     desde el formulario o desde el pie de página.
   - Guarda la aceptación en localStorage (NO es una cookie).
   - Bloquea los botones de envío/WhatsApp del formulario hasta que
     el usuario marque la casilla de aceptación.
   No modifica la lógica de construcción/envío del mensaje de WhatsApp
   definida en main.js: solo habilita o deshabilita los botones.
   ===================================================================== */
(function () {
  var STORAGE_KEY = 'computron_privacidad_aceptada';

  document.addEventListener('DOMContentLoaded', function () {
    var overlayConsentimiento = document.getElementById('privacidad-modal-overlay');
    var overlayPolitica = document.getElementById('politica-modal-overlay');

    var btnAceptar = document.getElementById('privacidad-btn-aceptar');
    var btnVerPolitica = document.getElementById('privacidad-btn-ver-politica');
    var btnCerrarPolitica = document.getElementById('politica-modal-cerrar');
    var btnAceptarPolitica = document.getElementById('politica-btn-aceptar');

    var footerPoliticaLink = document.getElementById('footer-politica-link');
    var formPoliticaLink = document.getElementById('privacidad-ver-politica-form');

    var checkPrivacidad = document.getElementById('privacidad-check');
    var formContacto = document.getElementById('form-contacto');
    var botonesFormulario = formContacto
      ? Array.prototype.slice.call(formContacto.querySelectorAll('[data-numero]'))
      : [];

    function haAceptado() {
      try {
        return window.localStorage && localStorage.getItem(STORAGE_KEY) === '1';
      } catch (e) {
        return false; // Si el navegador bloquea localStorage, se vuelve a mostrar el aviso.
      }
    }

    function guardarAceptacion() {
      try {
        if (window.localStorage) localStorage.setItem(STORAGE_KEY, '1');
      } catch (e) {
        /* Almacenamiento no disponible: se continúa sin bloquear al usuario. */
      }
    }

    function hayAlgunModalAbierto() {
      return (overlayConsentimiento && overlayConsentimiento.classList.contains('activo')) ||
             (overlayPolitica && overlayPolitica.classList.contains('activo'));
    }

    function actualizarScrollBody() {
      document.body.style.overflow = hayAlgunModalAbierto() ? 'hidden' : '';
    }

    function abrirConsentimiento() {
      if (!overlayConsentimiento) return;
      overlayConsentimiento.classList.add('activo');
      actualizarScrollBody();
    }

    function cerrarConsentimiento() {
      if (!overlayConsentimiento) return;
      overlayConsentimiento.classList.remove('activo');
      actualizarScrollBody();
    }

    function abrirPolitica() {
      if (!overlayPolitica) return;
      overlayPolitica.classList.add('activo');
      actualizarScrollBody();
    }

    function cerrarPolitica() {
      if (!overlayPolitica) return;
      overlayPolitica.classList.remove('activo');
      actualizarScrollBody();
    }

    function aceptarTodo() {
      guardarAceptacion();
      cerrarPolitica();
      cerrarConsentimiento();
    }

    // ----- Mostrar el modal de consentimiento solo si no fue aceptado antes -----
    if (!haAceptado()) {
      abrirConsentimiento();
    }

    if (btnAceptar) btnAceptar.addEventListener('click', aceptarTodo);
    if (btnAceptarPolitica) btnAceptarPolitica.addEventListener('click', aceptarTodo);

    if (btnVerPolitica) {
      btnVerPolitica.addEventListener('click', function () {
        abrirPolitica();
      });
    }

    if (formPoliticaLink) {
      formPoliticaLink.addEventListener('click', function (e) {
        e.preventDefault();
        abrirPolitica();
      });
    }

    if (footerPoliticaLink) {
      footerPoliticaLink.addEventListener('click', function (e) {
        e.preventDefault();
        abrirPolitica();
      });
    }

    if (btnCerrarPolitica) {
      btnCerrarPolitica.addEventListener('click', function () {
        cerrarPolitica();
      });
    }

    // Cerrar la política al hacer clic fuera de la tarjeta (no aplica al aviso inicial,
    // que requiere una decisión explícita del usuario).
    if (overlayPolitica) {
      overlayPolitica.addEventListener('click', function (e) {
        if (e.target === overlayPolitica) cerrarPolitica();
      });
    }

    // Cerrar la política con la tecla Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlayPolitica && overlayPolitica.classList.contains('activo')) {
        cerrarPolitica();
      }
    });

    // ----- Casilla de aceptación dentro del formulario de contacto -----
    function actualizarBotonesFormulario() {
      if (!checkPrivacidad) return;
      botonesFormulario.forEach(function (btn) {
        btn.disabled = !checkPrivacidad.checked;
      });
    }

    if (checkPrivacidad) {
      checkPrivacidad.addEventListener('change', actualizarBotonesFormulario);
      actualizarBotonesFormulario(); // Estado inicial (deshabilitado si no está marcada).
    }
  });
})();
