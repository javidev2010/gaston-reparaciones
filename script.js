// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// --- Antes/Después (deslizador horizontal) ---
// La clave: la imagen "después" está por encima y su ANCHO se ajusta con una
// variable CSS (--reveal). No se cambia el tamaño del contenedor ni se "agranda desde una esquina".
(function initBeforeAfter(){
  const root = document.querySelector('.before-after');
  if(!root) return;

  const range = root.querySelector('.ba-range');
  const after = root.querySelector('.ba-after');
  const handle = root.querySelector('.ba-handle');

  const setReveal = (valuePct) => {
    const clamped = Math.max(0, Math.min(100, Number(valuePct)));
    const pct = clamped.toFixed(0) + '%';
    after.style.setProperty('--reveal', pct);
    handle.style.left = `calc(${pct} - 1px)`;
  };

  // valor inicial desde data-attr o value del input
  const initial = root.getAttribute('data-initial') ?? range.value ?? 50;
  setReveal(initial);

  range.addEventListener('input', (e) => setReveal(e.target.value));

  // También permitir arrastrar sobre la imagen para mover el deslizador
  let dragging = false;

  const updateFromPointer = (clientX) => {
    const rect = root.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    range.value = Math.max(0, Math.min(100, pct));
    setReveal(range.value);
  };

  const start = (e) => {
    dragging = true;
    if (e.type.startsWith('touch')) {
      updateFromPointer(e.touches[0].clientX);
    } else {
      updateFromPointer(e.clientX);
    }
  };
  const move = (e) => {
    if (!dragging) return;
    if (e.type.startsWith('touch')) {
      updateFromPointer(e.touches[0].clientX);
    } else {
      updateFromPointer(e.clientX);
    }
  };
  const end = () => { dragging = false; };

  root.addEventListener('mousedown', start);
  root.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  root.addEventListener('touchstart', start, {passive: true});
  root.addEventListener('touchmove', move, {passive: true});
  window.addEventListener('touchend', end);
})();

// --- Botón WhatsApp: arma el mensaje con los datos del formulario ---
(function initWhatsApp(){
  const form = document.querySelector('.contact-form');
  if(!form) return;
  const btn = document.getElementById('btn-wpp');

  const encode = (s) => encodeURIComponent(s ?? '').replace(/%20/g, '+');

  const buildLink = () => {
    const nombre = form.nombre?.value?.trim();
    const tel = form.telefono?.value?.trim();
    const email = form.email?.value?.trim();
    const msg = form.mensaje?.value?.trim();

    const texto =
`Hola Gaston, soy ${nombre || 'cliente'}.
Tel: ${tel || '-'}
Email: ${email || '-'}
Mensaje: ${msg || 'Quisiera un presupuesto.'}`;

    // Reemplazá el número por el tuyo con código de país, sin signos.
    const numeroGaston = '5491125734536';
    return `https://wa.me/${numeroGaston}?text=${encode(texto)}`;
  };

  btn.addEventListener('click', (e) => {
    const link = buildLink();
    btn.setAttribute('href', link);
    // no prevenimos el default para que abra la pestaña
  });
})();
