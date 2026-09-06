/* ===================================================================
   CARRUSEL DE LIBROS
   -------------------------------------------------------------------
   Idea general: la rejilla (.rejilla-libros) ya se puede deslizar
   sola con el ratón/trackpad/dedo gracias al CSS (overflow-x: auto).
   Este script solo añade las FLECHAS como otra forma de moverla:
   cada clic desplaza el contenido con scrollBy(), y desactivamos
   la flecha correspondiente cuando ya no queda nada más que ver
   en esa dirección.
=================================================================== */

// Esperamos a que el HTML esté totalmente cargado antes de buscar
// los elementos, para asegurarnos de que existen en el DOM.
document.addEventListener('DOMContentLoaded', () => {

  const rejilla = document.querySelector('.rejilla-libros');
  const flechaIzquierda = document.querySelector('.flecha-izquierda');
  const flechaDerecha = document.querySelector('.flecha-derecha');

  // Si por lo que sea la página no tiene estos elementos, no seguimos
  // (evita errores en consola si el carrusel no está en esta página).
  if (!rejilla || !flechaIzquierda || !flechaDerecha) return;

  // Cuánto se mueve el carrusel en cada clic: el ancho de una ficha
  // más el gap. Lo calculamos a partir de la primera ficha real en
  // vez de "hardcodear" el número, así si cambias el ancho en el CSS
  // el JS se adapta solo.
  function calcularDistanciaDeslizamiento() {
    const primeraFicha = rejilla.querySelector('.ficha-libro');
    if (!primeraFicha) return 460; // valor de respaldo por si no hay fichas

    const estilos = getComputedStyle(rejilla);
    const gap = parseFloat(estilos.columnGap || estilos.gap) || 0;
    return primeraFicha.offsetWidth + gap;
  }

  // Mueve la rejilla hacia la izquierda o la derecha.
  function deslizar(direccion) {
    const distancia = calcularDistanciaDeslizamiento();
    rejilla.scrollBy({
      left: direccion * distancia,
      behavior: 'smooth'
    });
  }

  flechaIzquierda.addEventListener('click', () => deslizar(-1));
  flechaDerecha.addEventListener('click', () => deslizar(1));

  // Activa/desactiva las flechas según si queda contenido por ver
  // a cada lado. Se ejecuta al cargar y cada vez que el usuario
  // hace scroll manualmente (con el dedo, el trackpad, etc).
  function actualizarEstadoFlechas() {
    const maximoScroll = rejilla.scrollWidth - rejilla.clientWidth;

    // Un pequeño margen (2px) evita problemas de redondeo del navegador.
    flechaIzquierda.disabled = rejilla.scrollLeft <= 2;
    flechaDerecha.disabled = rejilla.scrollLeft >= maximoScroll - 2;
  }

  rejilla.addEventListener('scroll', actualizarEstadoFlechas);
  window.addEventListener('resize', actualizarEstadoFlechas);

  actualizarEstadoFlechas(); // estado inicial al cargar la página
});

/* ===================================================================
   MENÚ DE MÓVIL
   -------------------------------------------------------------------
   El CSS ya se encarga de OCULTAR el <ul> del menú por debajo de
   700px y de mostrarlo cuando <nav class="navegacion"> tiene la
   clase "activa". Aquí solo hace falta añadir/quitar esa clase.
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const botonMenu = document.querySelector('.boton-menu');
  const navegacion = document.querySelector('.navegacion');

  if (!botonMenu || !navegacion) return;

  botonMenu.addEventListener('click', () => {
    navegacion.classList.toggle('activa');

    // aria-expanded le dice a lectores de pantalla si el menú está
    // abierto o cerrado ahora mismo; sin esto, el botón "miente" a
    // quien navega sin ver la pantalla.
    const abierto = navegacion.classList.contains('activa');
    botonMenu.setAttribute('aria-expanded', abierto);
  });

  // Si el visitante pulsa un enlace del menú (por ejemplo "Libros"),
  // cerramos el menú automáticamente. Sin esto, el panel se quedaría
  // abierto tapando la sección a la que acaba de saltar.
  navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      navegacion.classList.remove('activa');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
});

/* ===================================================================
   FORMULARIO DE CONTACTO
   -------------------------------------------------------------------
   Esta web no tiene servidor propio, así que no podemos "enviar" el
   formulario a una base de datos ni nada parecido. La solución más
   sencilla para una web estática es construir un enlace "mailto:"
   con los datos que ha escrito el visitante, y abrirlo: el navegador
   arranca el programa de correo (Gmail, Outlook, la app de Mail...)
   con un email ya redactado. El visitante solo tiene que pulsar
   "Enviar" desde ahí.

   IMPORTANTE: cambia "TU_CORREO_AQUI@gmail.com" por el correo real
   de la autora, si no los mensajes no llegarán a nadie.
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const CORREO_DESTINO = 'monika81111@gmail.com';

  const formulario = document.querySelector('#formulario-contacto');
  if (!formulario) return; // esta página no tiene formulario de contacto

  formulario.addEventListener('submit', (evento) => {
    // Evita que el formulario haga lo que hace por defecto (recargar
    // la página e intentar enviarse solo a la URL actual).
    evento.preventDefault();

    const nombre = formulario.nombre.value;
    const correo = formulario.correo.value;
    const mensaje = formulario.mensaje.value;

    // El asunto y el cuerpo del email van dentro de la URL, así que
    // hay que "escaparlos" con encodeURIComponent: convierte espacios,
    // acentos, saltos de línea, etc. en un formato válido para una URL.
    const asunto = encodeURIComponent(`Mensaje de ${nombre} desde la web`);
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`
    );

    // Construimos el enlace mailto y lo "visitamos" con el navegador,
    // igual que si el visitante hubiera hecho clic en un enlace.
    window.location.href = `mailto:${CORREO_DESTINO}?subject=${asunto}&body=${cuerpo}`;
  });
});
