/* ===================================================================
   CARRUSELES DE LIBROS (Soporte para múltiples carruseles)
   -------------------------------------------------------------------
   Detecta cada contenedor .carrusel-libros y le asigna el control de
   sus respectivas flechas (izquierda / derecha) de manera independiente.
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const carruseles = document.querySelectorAll('.carrusel-libros');

  carruseles.forEach((carrusel) => {
    const rejilla = carrusel.querySelector('.rejilla-libros');
    const flechaIzquierda = carrusel.querySelector('.flecha-izquierda');
    const flechaDerecha = carrusel.querySelector('.flecha-derecha');

    if (!rejilla || !flechaIzquierda || !flechaDerecha) return;

    function calcularDistanciaDeslizamiento() {
      const primeraFicha = rejilla.querySelector('.ficha-libro');
      if (!primeraFicha) return 460;

      const estilos = getComputedStyle(rejilla);
      const gap = parseFloat(estilos.columnGap || estilos.gap) || 0;
      return primeraFicha.offsetWidth + gap;
    }

    function deslizar(direccion) {
      const distancia = calcularDistanciaDeslizamiento();
      rejilla.scrollBy({
        left: direccion * distancia,
        behavior: 'smooth'
      });
    }

    flechaIzquierda.addEventListener('click', () => deslizar(-1));
    flechaDerecha.addEventListener('click', () => deslizar(1));

    function actualizarEstadoFlechas() {
      const maximoScroll = rejilla.scrollWidth - rejilla.clientWidth;
      flechaIzquierda.disabled = rejilla.scrollLeft <= 2;
      flechaDerecha.disabled = rejilla.scrollLeft >= maximoScroll - 2;
    }

    rejilla.addEventListener('scroll', actualizarEstadoFlechas);
    window.addEventListener('resize', actualizarEstadoFlechas);

    actualizarEstadoFlechas();
  });
});

/* ===================================================================
   MENÚ DE MÓVIL
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const botonMenu = document.querySelector('.boton-menu');
  const navegacion = document.querySelector('.navegacion');

  if (!botonMenu || !navegacion) return;

  botonMenu.addEventListener('click', () => {
    navegacion.classList.toggle('activa');
    const abierto = navegacion.classList.contains('activa');
    botonMenu.setAttribute('aria-expanded', abierto);
  });

  navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      navegacion.classList.remove('activa');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
});

/* ===================================================================
   FORMULARIO DE CONTACTO
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const CORREO_DESTINO = 'monika81111@gmail.com';

  const formulario = document.querySelector('#formulario-contacto');
  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nombre = formulario.nombre.value;
    const correo = formulario.correo.value;
    const mensaje = formulario.mensaje.value;

    const asunto = encodeURIComponent(`Mensaje de ${nombre} desde la web`);
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`
    );

    window.location.href = `mailto:${CORREO_DESTINO}?subject=${asunto}&body=${cuerpo}`;
  });
});