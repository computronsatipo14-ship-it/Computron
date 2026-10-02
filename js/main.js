// Animación de entrada del hero: el video de fondo hace fade-in y se reproduce
// una sola vez (sin loop); la pantalla del laptop se ilumina con un brillo pulsante.
window.addEventListener('load', function () {
  var heroBg = document.querySelector('.hero video.hero-bg');
  var heroGlow = document.querySelector('.hero .hero-glow');

  setTimeout(function () {
    if (heroBg) heroBg.classList.add('animate-in');
    if (heroGlow) heroGlow.classList.add('animate-in');
  }, 150);

  // Algunos navegadores requieren forzar el play() aunque el video esté muted+autoplay.
  if (heroBg) {
    var playPromise = heroBg.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Si el navegador bloquea el autoplay, se reproduce en cuanto el usuario interactúa.
        document.addEventListener('click', function () { heroBg.play(); }, { once: true });
      });
    }
  }

});

/* ===================== FORMULARIO DE CONTACTO → WHATSAPP ===================== */
(function () {
  var NUMERO_1 = '51924784318'; // 924 784 318
  var NUMERO_2 = '51922463976'; // 922 463 976

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('form-contacto');
    if (!form) return;

    var aviso = document.getElementById('form-aviso');

    function obtenerDatos() {
      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };
      var selTexto = function (id) {
        var el = document.getElementById(id);
        if (!el || el.selectedIndex < 0) return '';
        return el.value ? el.options[el.selectedIndex].text : '';
      };
      return {
        nombre: val('campo-nombre'),
        edad: val('campo-edad'),
        telefono: val('campo-telefono'),
        tipoDato: (form.querySelector('input[name="tipo-dato"]:checked') || {}).value || 'correo',
        contactoExtra: val('campo-contacto-extra'),
        curso: selTexto('campo-curso'),
        horario: selTexto('campo-horario'),
        mensaje: val('campo-mensaje')
      };
    }

    function construirMensaje(datos) {
      var lineas = [];
      lineas.push('Hola Computron, quisiera solicitar información.');
      if (datos.nombre) lineas.push('Nombre: ' + datos.nombre);
      if (datos.edad) lineas.push('Edad: ' + datos.edad);
      if (datos.telefono) lineas.push('Teléfono: ' + datos.telefono);
      if (datos.contactoExtra) {
        lineas.push((datos.tipoDato === 'dni' ? 'DNI: ' : 'Correo: ') + datos.contactoExtra);
      }
      if (datos.curso) lineas.push('Curso de interés: ' + datos.curso);
      if (datos.horario) lineas.push('Día y horario: ' + datos.horario);
      if (datos.mensaje) lineas.push('Mensaje: ' + datos.mensaje);
      return lineas.join('\n');
    }

    // Cambia el campo según se elija Correo electrónico o DNI
    var campoExtra = document.getElementById('campo-contacto-extra');
    var opcionesTipo = form.querySelectorAll('input[name="tipo-dato"]');

    function aplicarTipoDato() {
      if (!campoExtra) return;
      var tipo = (form.querySelector('input[name="tipo-dato"]:checked') || {}).value;
      campoExtra.value = '';
      campoExtra.setCustomValidity('');
      if (tipo === 'dni') {
        campoExtra.type = 'text';
        campoExtra.placeholder = '8 dígitos';
        campoExtra.inputMode = 'numeric';
        campoExtra.maxLength = 8;
        campoExtra.pattern = '[0-9]{8}';
        campoExtra.title = 'El DNI debe tener 8 dígitos';
        campoExtra.autocomplete = 'off';
      } else {
        campoExtra.type = 'email';
        campoExtra.placeholder = 'tu@correo.com';
        campoExtra.inputMode = 'email';
        campoExtra.removeAttribute('maxlength');
        campoExtra.removeAttribute('pattern');
        campoExtra.removeAttribute('title');
        campoExtra.autocomplete = 'email';
      }
    }

    opcionesTipo.forEach(function (r) { r.addEventListener('change', aplicarTipoDato); });
    if (campoExtra) {
      // En modo DNI solo se permiten números
      campoExtra.addEventListener('input', function () {
        var tipo = (form.querySelector('input[name="tipo-dato"]:checked') || {}).value;
        if (tipo === 'dni') campoExtra.value = campoExtra.value.replace(/\D/g, '').slice(0, 8);
      });
    }
    aplicarTipoDato();

    function validarMinimo(datos) {
      if (!(datos.nombre.length > 0 && datos.telefono.length > 0)) return false;
      if (datos.contactoExtra) {
        if (datos.tipoDato === 'dni') return /^\d{8}$/.test(datos.contactoExtra);
        return campoExtra ? campoExtra.checkValidity() : true;
      }
      return true;
    }

    function enviarPorWhatsApp(numero) {
      var datos = obtenerDatos();

      if (!validarMinimo(datos)) {
        if (aviso) aviso.style.display = 'block';
        var campoFalta = !datos.nombre ? 'campo-nombre'
          : !datos.telefono ? 'campo-telefono' : 'campo-contacto-extra';
        var el = document.getElementById(campoFalta);
        if (el) el.focus();
        return;
      }

      if (aviso) aviso.style.display = 'none';

      var texto = construirMensaje(datos);
      var url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
      window.open(url, '_blank', 'noopener');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      enviarPorWhatsApp(NUMERO_1);
    });

    var botonesWhatsApp = form.querySelectorAll('[data-numero]');
    botonesWhatsApp.forEach(function (btn) {
      if (btn.type === 'submit') return; // ya manejado por el submit
      btn.addEventListener('click', function () {
        enviarPorWhatsApp(NUMERO_2);
      });
    });
  });
})();

// ===================== Selector interactivo de personajes (Sección "Público objetivo") =====================
// Al hacer clic/tocar un personaje, éste se ilumina y el panel holográfico muestra
// información dinámica sobre lo que puede aprender y lograr esa etapa con la tecnología.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var contenedor = document.getElementById('selectorPersonajes');
    if (!contenedor) return;

    var personajes = Array.prototype.slice.call(contenedor.querySelectorAll('.personaje'));
    var infoHolo = document.getElementById('infoHolo');
    var infoNum = document.getElementById('infoNum');
    var infoRango = document.getElementById('infoRango');
    var infoTitulo = document.getElementById('infoTitulo');
    var infoTexto = document.getElementById('infoTexto');
    var infoLista = document.getElementById('infoLista');
    if (!personajes.length || !infoHolo) return;

    var DATOS = {
      ninos: {
        num: '01',
        rango: '6 - 11 años',
        titulo: 'Niños',
        texto: 'Descubren la tecnología jugando: dan sus primeros pasos frente al computador mientras desarrollan lógica, atención y creatividad de forma divertida.',
        logros: [
          'Manejo básico del computador y mecanografía',
          'Ofimática inicial: Word y PowerPoint para tareas escolares',
          'Programación por bloques para pensar de forma lógica',
          'Dibujo y creatividad digital'
        ]
      },
      jovenes: {
        num: '02',
        rango: '12 - 16 años',
        titulo: 'Adolescentes',
        texto: 'Construyen las bases de su futuro digital: pasan de usar la tecnología a crear con ella, ganando herramientas que fortalecen su etapa escolar.',
        logros: [
          'Ofimática intermedia y avanzada para el colegio',
          'Diseño gráfico digital: afiches, logos y redes sociales',
          'Primeros lenguajes de programación (Python, HTML/CSS)',
          'Introducción al mantenimiento de equipos y redes'
        ]
      },
      estudiantes: {
        num: '03',
        rango: '16 - 18 años',
        titulo: 'Estudiantes',
        texto: 'Se preparan para dar el salto a la universidad o al mundo laboral, sumando a su formación habilidades técnicas que marcan la diferencia.',
        logros: [
          'Programación web y desarrollo de aplicaciones',
          'Diseño arquitectónico y dibujo asistido por PC (CAD)',
          'Hardware: ensamblaje y mantenimiento de computadoras',
          'Certificación que fortalece su perfil académico'
        ]
      },
      universitarios: {
        num: '04',
        rango: '18 años a más',
        titulo: 'Jóvenes adultos',
        texto: 'Profesionalizan sus habilidades técnicas para diferenciarse en el mundo laboral, con formación práctica y certificación CETPRO.',
        logros: [
          'Redes y soporte técnico a nivel profesional',
          'Programación y desarrollo de software',
          'Diseño arquitectónico y CAD para proyectos reales',
          'Certificación CETPRO con salida laboral inmediata'
        ]
      }
    };

    function pintarInfo(id) {
      var d = DATOS[id];
      if (!d) return;
      infoNum.textContent = d.num;
      infoRango.textContent = d.rango;
      infoTitulo.textContent = d.titulo;
      infoTexto.textContent = d.texto;
      infoLista.innerHTML = '';
      d.logros.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        infoLista.appendChild(li);
      });
    }

    function seleccionar(personaje) {
      if (personaje.classList.contains('activo')) return;

      personajes.forEach(function (p) {
        p.classList.remove('activo');
        p.setAttribute('aria-pressed', 'false');
      });
      personaje.classList.add('activo');
      personaje.setAttribute('aria-pressed', 'true');

      // Pequeña transición del panel: se desvanece, cambia el contenido y reaparece.
      infoHolo.classList.add('cambiando');
      setTimeout(function () {
        pintarInfo(personaje.getAttribute('data-id'));
        infoHolo.classList.remove('cambiando');
      }, 180);
    }

    personajes.forEach(function (personaje) {
      personaje.addEventListener('click', function () { seleccionar(personaje); });
      personaje.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          seleccionar(personaje);
        }
      });
    });

    // Pinta la info del personaje activo por defecto (niños) al cargar.
    var activoInicial = contenedor.querySelector('.personaje.activo') || personajes[0];
    pintarInfo(activoInicial.getAttribute('data-id'));
  });
})();

// ===================== MODAL DE INFORMACIÓN DE CURSOS =====================
document.addEventListener('DOMContentLoaded', function () {

  // Datos de cada curso: icono, etiqueta, descripción y lo que se puede lograr aprender.
  // El "valor" debe coincidir EXACTO con las opciones del <select id="campo-curso"> del formulario.
  var CURSOS_INFO = {
    ofimatica: {
      icono: '🖥️',
      tag: '/ OFIMÁTICA PROFESIONAL',
      titulo: 'Técnico en Ofimática',
      descripcion: 'Fórmate en el manejo profesional de las herramientas informáticas más utilizadas en oficinas y empresas, desde documentos hasta hojas de cálculo y presentaciones.',
      valorSelect: 'Técnico en Ofimática',
      logros: [
        'Windows e Internet.',
        'Word, Excel y PowerPoint (Office 2020).',
        'Access y Publisher.',
        'HTML y HTML 5.',
        'Visual Studio .NET y Visual FoxPro.',
        'Python y Canva.',
        'Curso taller.'
      ]
    },
    diseno: {
      icono: '🎨',
      tag: '/ CREA, DISEÑA E IMPACTA',
      titulo: 'Diseño Gráfico Digital',
      descripcion: 'Aprende diseño gráfico desde cero y desarrolla piezas visuales profesionales usando las herramientas más demandadas del mercado.',
      valorSelect: 'Diseño Gráfico Digital',
      logros: [
        'CorelDRAW X20.',
        'Photoshop CS7.',
        'InDesign CS7.',
        'Macromedia Flash CS7.',
        '3D Max.',
        'Adobe Premiere.',
        'Dreamweaver CS7.'
      ]
    },
    arquitectonico: {
      icono: '🏠',
      tag: '/ REPRESENTACIÓN DIGITAL',
      titulo: 'Diseño Arquitectónico',
      descripcion: 'Formación orientada al diseño y representación arquitectónica mediante herramientas profesionales de dibujo y modelado.',
      valorSelect: 'Diseño Arquitectónico',
      logros: [
        'Creación y edición de polilíneas.',
        'Definición y edición de atributos.',
        'Trabajo con coordenadas.',
        'Prácticas de los ángulos.',
        'Trayectos, etc.'
      ]
    },
    hardware: {
      icono: '💻',
      tag: '/ SISTEMAS E INFRAESTRUCTURA',
      titulo: 'Hardware y Redes',
      descripcion: 'Aprende sobre computadoras, mantenimiento, configuración y redes para dar soporte técnico profesional.',
      valorSelect: 'Hardware y Redes',
      logros: [
        'Ensamblaje de computadoras.',
        'Mantenimiento de computadoras y accesorios.',
        'Diagnóstico de computadoras y accesorios.',
        'Fundamentos de redes.',
        'Instalación de redes y cableado.',
        'TCP/IP y aplicaciones.'
      ]
    },
    programador: {
      icono: '&lt;/&gt;',
      tag: '/ PYTHON · VISUAL STUDIO .NET',
      titulo: 'Programador de Aplicaciones',
      descripcion: 'Formación en programación y desarrollo de aplicaciones utilizando lenguajes y entornos profesionales.',
      valorSelect: 'Programador de Aplicaciones',
      logros: [
        'Programar en Python y .NET con Visual Studio.',
        'Desarrollar aplicaciones de escritorio y web funcionales.',
        'Aplicar lógica de programación y estructuras de datos.',
        'Conectar aplicaciones a bases de datos.'
      ]
    },
    cad: {
      icono: '📐',
      tag: '/ DISEÑO ASISTIDO POR COMPUTADORA',
      titulo: 'Dibujo Asistido por PC – CAD',
      descripcion: 'Formación en dibujo técnico y diseño asistido por computadora orientada a proyectos reales.',
      valorSelect: 'Dibujo Asistido por PC – CAD',
      logros: [
        'Edición de acotaciones.',
        'Modificación de referencias externas.',
        'Diferenciación de espacio de papel y modelo.',
        'Dibujo 3D.'
      ]
    }
  };

  var overlay = document.getElementById('curso-modal-overlay');
  if (!overlay) return; // Si el modal no existe en esta página, no seguir.

  var modalIcon = document.getElementById('curso-modal-icon');
  var modalTag = document.getElementById('curso-modal-tag');
  var modalTitulo = document.getElementById('curso-modal-titulo');
  var modalDesc = document.getElementById('curso-modal-desc');
  var modalLista = document.getElementById('curso-modal-lista');
  var modalConsultar = document.getElementById('curso-modal-consultar');
  var btnCerrar = document.getElementById('curso-modal-cerrar');

  var cursoActual = null;

  function abrirModal(claveCurso) {
    var curso = CURSOS_INFO[claveCurso];
    if (!curso) return;

    cursoActual = curso;

    modalIcon.innerHTML = curso.icono;
    modalTag.textContent = curso.tag;
    modalTitulo.textContent = curso.titulo;
    modalDesc.textContent = curso.descripcion;

    modalLista.innerHTML = '';
    curso.logros.forEach(function (logro) {
      var li = document.createElement('li');
      li.textContent = logro;
      modalLista.appendChild(li);
    });

    overlay.classList.add('activo');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    overlay.classList.remove('activo');
    document.body.style.overflow = '';
  }

  // Ir a la sección de contacto y precargar el curso en el <select> del formulario.
  function irAContactoConCurso(claveCurso) {
    var curso = CURSOS_INFO[claveCurso];
    var selectCurso = document.getElementById('campo-curso');

    if (curso && selectCurso) {
      selectCurso.value = curso.valorSelect;
    }

    var seccionContacto = document.getElementById('contacto');
    if (seccionContacto) {
      seccionContacto.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'contacto';
    }
  }

  // Botones "Ver información" de cada tarjeta de curso.
  document.querySelectorAll('.btn-info[data-curso]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      abrirModal(boton.getAttribute('data-curso'));
    });
  });

  // Botones "Consultar →" de cada tarjeta de curso.
  document.querySelectorAll('.btn-consultar[data-curso]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      irAContactoConCurso(boton.getAttribute('data-curso'));
    });
  });

  // Botón "Consultar sobre este curso" dentro del modal.
  if (modalConsultar) {
    modalConsultar.addEventListener('click', function () {
      var claveActual = null;
      Object.keys(CURSOS_INFO).forEach(function (clave) {
        if (CURSOS_INFO[clave] === cursoActual) claveActual = clave;
      });
      cerrarModal();
      if (claveActual) irAContactoConCurso(claveActual);
    });
  }

  // Cerrar modal: botón X, clic fuera de la tarjeta, o tecla Escape.
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) cerrarModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('activo')) cerrarModal();
  });
});
