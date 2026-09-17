'use strict';

/* =========================================================
   JEISSONXP - APP.JS
   JavaScript principal del catálogo
   ========================================================= */

/* ---------- CONFIGURACIÓN CENTRALIZADA ---------- */

const DEFAULT_CONFIG = {
  siteName: "JeissoNxP",
  catalogIndex: "catalogo-index.json",
  favoritesKey: "jxp_favorites",
  historyKey: "jxp_historial",
  historyMax: 20,
  requestTimeout: 15000,
  repositories: {
    sagas: "https://jeissonxp182.github.io/player/sagas.json",
    peliculas: "https://jeissonxp182.github.io/player/peliculas.json",
    series: "https://jeissonxp182.github.io/player/series.json",
    anime: "https://jeissonxp182.github.io/player/anime.json",
    videos: "https://jeissonxp182.github.io/player/videos.json",
    tv: "https://iptv-org.github.io/iptv/index.m3u"
  }
};

let APP_CONFIG = {
  ...DEFAULT_CONFIG,
  repositories: { ...DEFAULT_CONFIG.repositories }
};

async function cargarConfiguracion() {
  try {
    const respuesta = await fetch('config.json?v=' + Date.now(), {
      cache: 'no-store'
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo cargar config.json');
    }

    const remota = await respuesta.json();

    APP_CONFIG = {
      ...DEFAULT_CONFIG,
      ...remota,
      repositories: {
        ...DEFAULT_CONFIG.repositories,
        ...(remota.repositories || {})
      }
    };

    console.log('Configuración centralizada cargada.');
  } catch (error) {
    console.warn('No se pudo cargar config.json. Se usarán los valores predeterminados.', error);
  }
}

function getRepositoryUrl(sectionKey) {
  return APP_CONFIG.repositories?.[sectionKey] || '';
}

/* ---------- ESTADO ---------- */

let LOCAL_CATALOG = {
  sagas: [],
  peliculas: [],
  series: [],
  anime: [],
  videos: [],
  tv: [],
  favoritos: [],
  historial: []
};

let currentSectionKey = 'inicio';
let targetHtmlUrl = '';
let currentSerieData = null;
let currentSeasonData = null;

// Caché en memoria para evitar leer localStorage repetidamente.
let FAVORITES_CACHE = null;
let HISTORY_CACHE = null;

// Evita solicitudes duplicadas si una sección ya se está cargando.
const SECTION_LOAD_PROMISES = {};


/* =========================================================
   UTILIDADES
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function getItemId(item) {
  return item?.id || item?.titulo;
}

function formatDuration(duracion) {
  if (!duracion) return '';
  return duracion.replace(/(\d+h):?(\d+m)/, '$1:$2');
}


/* =========================================================
   FAVORITOS
   ========================================================= */

function getFavorites() {
  if (Array.isArray(FAVORITES_CACHE)) return FAVORITES_CACHE;

  try {
    const data = JSON.parse(localStorage.getItem(APP_CONFIG.favoritesKey));
    FAVORITES_CACHE = Array.isArray(data) ? data : [];
  } catch {
    FAVORITES_CACHE = [];
  }

  return FAVORITES_CACHE;
}

function isFavorite(item) {
  const id = getItemId(item);
  return getFavorites().some(fav => getItemId(fav) === id);
}

function toggleFavorite(event, item) {
  event?.stopPropagation();

  const favoritos = getFavorites();
  const id = getItemId(item);

  const index = favoritos.findIndex(
    fav => getItemId(fav) === id
  );

  if (index >= 0) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(item);
  }

  FAVORITES_CACHE = favoritos;

  localStorage.setItem(
    APP_CONFIG.favoritesKey,
    JSON.stringify(favoritos)
  );

  if (currentSectionKey === 'favoritos') {
    LOCAL_CATALOG.favoritos = favoritos;
    renderCatalog(favoritos);
    return;
  }

  const boton = event?.currentTarget;

  if (boton) {
    const activo = favoritos.some(
      fav => getItemId(fav) === id
    );

    boton.classList.toggle('active', activo);
    boton.innerHTML = activo ? '★' : '☆';
    boton.title = activo
      ? 'Quitar de Favoritos'
      : 'Añadir a Favoritos';
  }
}


/* =========================================================
   HISTORIAL DE REPRODUCCIÓN
   ========================================================= */

const HISTORIAL_KEY = DEFAULT_CONFIG.historyKey;
const HISTORIAL_MAX = Number(APP_CONFIG.historyMax) || 20;

function getHistory() {
  if (Array.isArray(HISTORY_CACHE)) return HISTORY_CACHE;

  try {
    const data = JSON.parse(localStorage.getItem(HISTORIAL_KEY));
    HISTORY_CACHE = Array.isArray(data) ? data : [];
  } catch {
    HISTORY_CACHE = [];
  }

  return HISTORY_CACHE;
}

function addToHistory(item) {
  if (!item) return;

  const id = getItemId(item);
  if (!id) return;

  const historial = getHistory();
  const index = historial.findIndex(x => getItemId(x) === id);

  if (index >= 0) historial.splice(index, 1);

  historial.unshift({
    ...item,
    _historialFecha: Date.now()
  });

  const limitado = historial.slice(0, HISTORIAL_MAX);
  HISTORY_CACHE = limitado;
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(limitado));
  LOCAL_CATALOG.historial = limitado;
}

function clearHistory() {
  localStorage.removeItem(HISTORIAL_KEY);
  HISTORY_CACHE = [];
  LOCAL_CATALOG.historial = [];
  if (currentSectionKey === 'historial') renderCatalog([]);
}

function removeFromHistory(event, item) {
  event?.stopPropagation();
  const id = getItemId(item);
  const nuevo = getHistory().filter(x => getItemId(x) !== id);
  HISTORY_CACHE = nuevo;
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(nuevo));
  LOCAL_CATALOG.historial = nuevo;
  if (currentSectionKey === 'historial') renderCatalog(nuevo);
}


/* =========================================================
   META SOCIAL
   ========================================================= */

function updateSocialMeta(items) {
  let firstImage = '';

  if (items?.length) {
    const item = items[0];

    if (item.portada) {
      firstImage = item.portada;
    } else if (
      Array.isArray(item.peliculas) &&
      item.peliculas.length
    ) {
      firstImage = item.peliculas[0].portada || '';
    }
  }

  if (!firstImage) return;

  $('ogImageMeta')?.setAttribute(
    'content',
    firstImage
  );

  $('twitterImageMeta')?.setAttribute(
    'content',
    firstImage
  );
}


/* =========================================================
   PANTALLA INICIAL / SELECTOR
   ========================================================= */

function showInitialScreen() {
  const container = $('catalogContainer');

  if (!container) return;

  container.innerHTML = `
    <div class="initial-selector">
      <div class="initial-selector-inner">
        <h2>¿Qué quieres ver?</h2>
        <p>Selecciona una categoría para comenzar</p>

        <div class="initial-selector-grid">
          <button class="initial-option" data-section="peliculas">
            <span class="initial-option-icon">🎬</span>
            <span>Películas</span>
          </button>

          <button class="initial-option" data-section="series">
            <span class="initial-option-icon">📺</span>
            <span>Series</span>
          </button>

          <button class="initial-option" data-section="anime">
            <span class="initial-option-icon">🇯🇵</span>
            <span>Anime</span>
          </button>

          <button class="initial-option" data-section="sagas">
            <span class="initial-option-icon">📁</span>
            <span>Sagas</span>
          </button>

          <button class="initial-option" data-section="videos">
            <span class="initial-option-icon">📽️</span>
            <span>Videos</span>
          </button>

          <button class="initial-option" data-section="tv">
            <span class="initial-option-icon">📡</span>
            <span>TV Live</span>
          </button>

          <button class="initial-option" data-section="favoritos">
            <span class="initial-option-icon">⭐</span>
            <span>Favoritos</span>
          </button>

          <button class="initial-option" data-section="historial">
            <span class="initial-option-icon">🕘</span>
            <span>Historial</span>
          </button>
        </div>
      </div>
    </div>
  `;

  container
    .querySelectorAll('.initial-option')
    .forEach(button => {
      button.addEventListener('click', () => {
        const section = button.dataset.section;

        if (section) {
          switchSection(section);
        }
      });
    });
}

/* ---------- ESTILOS DEL SELECTOR INICIAL ---------- */

function injectInitialScreenStyles() {
  if ($('initial-selector-styles')) return;

  const style = document.createElement('style');
  style.id = 'initial-selector-styles';

  style.textContent = `
    .initial-selector {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 35px 15px 50px;
      box-sizing: border-box;
    }

    .initial-selector-inner {
      width: min(900px, 100%);
      text-align: center;
    }

    .initial-selector h2 {
      margin: 0 0 8px;
      color: var(--text-main, #f8fafc);
      font-size: clamp(1.5rem, 4vw, 2.1rem);
    }

    .initial-selector p {
      margin: 0 0 28px;
      color: var(--text-muted, #94a3b8);
      font-size: .98rem;
    }

    .initial-selector-grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(130px, 1fr)
      );
      gap: 14px;
    }

    .initial-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 9px;
      min-height: 115px;
      padding: 18px 12px;
      border: 1px solid var(--border-purple, rgba(168,85,247,.35));
      border-radius: 14px;
      background: rgba(28,22,46,.72);
      color: var(--text-main, #f8fafc);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      transition:
        transform .2s ease,
        background .2s ease,
        border-color .2s ease,
        box-shadow .2s ease;
    }

    .initial-option:hover {
      transform: translateY(-3px);
      background: rgba(126,34,206,.25);
      border-color: var(--accent-purple, #a855f7);
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
    }

    .initial-option:active {
      transform: translateY(0);
    }

    .initial-option-icon {
      font-size: 2rem;
      line-height: 1;
    }

    @media (max-width: 480px) {
      .initial-selector {
        padding-top: 25px;
      }

      .initial-selector-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .initial-option {
        min-height: 105px;
      }
    }
  `;

  document.head.appendChild(style);
}


/* =========================================================
   MENSAJES DE ESTADO Y ERRORES
   ========================================================= */

function mostrarMensajeEstado(tipo, titulo, detalle = '', botonTexto = '', accion = null) {
  const container = $('catalogContainer');
  if (!container) return;

  const iconos = { cargando:'⏳', error:'⚠️', vacio:'📭', red:'🌐' };
  const icono = iconos[tipo] || 'ℹ️';

  container.innerHTML = `
    <div class="jxp-status-message" style="text-align:center;margin:50px auto;padding:25px 18px;max-width:560px;">
      <div style="font-size:2.5rem;margin-bottom:10px;">${icono}</div>
      <div style="font-size:1.15rem;font-weight:700;color:var(--text-main,#f8fafc);">${titulo}</div>
      ${detalle ? `<div style="margin-top:8px;color:var(--text-muted,#94a3b8);font-size:.95rem;line-height:1.5;">${detalle}</div>` : ''}
      ${botonTexto ? `<button id="jxp-status-action" style="margin-top:16px;padding:10px 18px;border:1px solid var(--accent-purple,#a855f7);border-radius:10px;background:transparent;color:var(--text-main,#f8fafc);font:inherit;cursor:pointer;">${botonTexto}</button>` : ''}
    </div>`;

  if (accion) {
    const btn = $('jxp-status-action');
    if (btn) btn.onclick = accion;
  }
}

function mensajeErrorSeccion(sectionKey, error) {
  const nombres = { sagas:'Sagas', peliculas:'Películas', series:'Series', anime:'Anime', videos:'Videos', tv:'TV Live' };
  const nombre = nombres[sectionKey] || 'esta sección';
  const esRed = error?.name === 'TypeError' || error?.message === 'Failed to fetch' || error?.message === 'TIMEOUT';
  const detalle = esRed
    ? 'No se pudo conectar con la fuente de contenido. Revisa tu conexión e inténtalo nuevamente.'
    : 'La fuente respondió, pero el contenido no pudo cargarse correctamente.';

  mostrarMensajeEstado(esRed ? 'red' : 'error', `No se pudo cargar ${nombre}`, detalle, '↻ Reintentar', () => cargarSeccionRemota(sectionKey, true));
}

function mostrarSeccionVacia(sectionKey) {
  const nombres = { sagas:'Sagas', peliculas:'Películas', series:'Series', anime:'Anime', videos:'Videos', tv:'TV Live' };
  mostrarMensajeEstado('vacio', `${nombres[sectionKey] || 'Esta sección'} está vacía`, 'No hay contenido disponible para mostrar en este momento.');
}

/* =========================================================
   CARGA DE SECCIONES
   ========================================================= */

async function cargarSeccionRemota(sectionKey, forceReload = false) {
  const container = $('catalogContainer');

  if (sectionKey === 'favoritos') {
    const favoritos = getFavorites();

    LOCAL_CATALOG.favoritos = favoritos;

    renderCatalog(favoritos);
    updateSocialMeta(favoritos);

    return favoritos;
  }

  if (
    !forceReload &&
    LOCAL_CATALOG[sectionKey] &&
    LOCAL_CATALOG[sectionKey].length
  ) {
    renderCatalog(LOCAL_CATALOG[sectionKey]);
    updateSocialMeta(LOCAL_CATALOG[sectionKey]);

    return LOCAL_CATALOG[sectionKey];
  }

  // Si la misma sección ya está cargándose, reutilizamos esa petición
  // en vez de descargar el JSON otra vez.
  if (!forceReload && SECTION_LOAD_PROMISES[sectionKey]) {
    return SECTION_LOAD_PROMISES[sectionKey];
  }

  mostrarMensajeEstado('cargando', 'Cargando contenido...', 'Espera un momento.');

  const carga = (async () => {
    try {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), Number(APP_CONFIG.requestTimeout) || 15000);
    let respuesta;
    try {
      respuesta = await fetch(getRepositoryUrl(sectionKey), { signal: controlador.signal });
    } finally {
      clearTimeout(temporizador);
    }

    if (!respuesta.ok) {
      throw new Error(`HTTP_${respuesta.status}`);
    }

    let data;

    if (sectionKey === 'tv') {
      const textoM3U = await respuesta.text();
      data = parsearM3U(textoM3U);
    } else {
      data = await respuesta.json();
    }

    if (!Array.isArray(data)) {
      throw new Error('FORMATO_INVALIDO');
    }

    LOCAL_CATALOG[sectionKey] = data;

    if (!data.length) {
      mostrarSeccionVacia(sectionKey);
      updateSocialMeta(data);
      return data;
    }

    renderCatalog(data);
    updateSocialMeta(data);

    return data;

    } catch (error) {
      console.error('Error al cargar la sección:', error);
      if (error?.name === 'AbortError') error.message = 'TIMEOUT';
      mensajeErrorSeccion(sectionKey, error);
      return null;
    } finally {
      delete SECTION_LOAD_PROMISES[sectionKey];
    }
  })();

  SECTION_LOAD_PROMISES[sectionKey] = carga;
  return carga;
}


/* =========================================================
   PARSER M3U - TV LIVE
   ========================================================= */

function parsearM3U(contenido) {
  const lineas = contenido.split('\n');
  const canales = [];
  let currentChannel = {};

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].trim();

    if (linea.startsWith('#EXTINF:')) {
      const partes = linea.split(',');
      const titulo =
        partes[partes.length - 1] ||
        'Canal sin nombre';

      const logoMatch =
        linea.match(/tvg-logo="([^"]+)"/);

      const portada =
        logoMatch ? logoMatch[1] : '';

      currentChannel = {
        id: 'tv_' + i,
        titulo,
        ano: 'En Directo',
        duracion: 'LIVE',
        director: 'TV Live',
        portada,
        sinopsis:
          'Transmisión de televisión en vivo.'
      };

    } else if (
      linea &&
      !linea.startsWith('#')
    ) {
      currentChannel.url = linea;

      if (currentChannel.titulo) {
        canales.push(currentChannel);
        currentChannel = {};
      }
    }
  }

  return canales;
}


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function updateModalHistory(query) {
  const url =
    `${window.location.pathname}?${query}`;

  // Al abrir un elemento desde un enlace directo no creamos
  // una entrada duplicada. En una interacción normal sí.
  if (window.__initialNavigation) {
    history.replaceState(
      { section: currentSectionKey, modal: true },
      '',
      url
    );
  } else {
    history.pushState(
      { section: currentSectionKey, modal: true },
      '',
      url
    );
  }
}

function hideModalOnly() {
  const modal = $('movieModal');
  if (modal) modal.style.display = 'none';

  const tempContainer =
    $('modalTemporadasContainer');

  if (tempContainer) {
    tempContainer.style.display = 'block';
  }

  currentSerieData = null;
  currentSeasonData = null;
}

function loadSection(sectionKey) {
  // "Inicio" es una pantalla local, no una sección remota.
  if (sectionKey === 'historial') {
    currentSectionKey = 'historial';
    const select = $('sectionSelect');
    if (select) select.value = 'historial';
    const historial = getHistory();
    LOCAL_CATALOG.historial = historial;
    renderCatalog(historial);
    updateSocialMeta(historial);
    return Promise.resolve(historial);
  }

  if (sectionKey === 'inicio') {
    currentSectionKey = 'inicio';

    const select = $('sectionSelect');
    if (select) select.value = 'inicio';

    showInitialScreen();
    return Promise.resolve([]);
  }

  currentSectionKey = sectionKey;

  const select = $('sectionSelect');

  if (select) {
    select.value = sectionKey;
  }

  return cargarSeccionRemota(sectionKey);
}

function switchSection(sectionKey) {
  const search = $('searchInput');

  if (search) {
    search.value = '';
  }

  if (sectionKey === currentSectionKey) {
    if (sectionKey === 'inicio') showInitialScreen();
    return;
  }

  // Cada sección crea una entrada real en el historial.
  // Así, Atrás vuelve a la sección anterior en vez de sacar al usuario.
  const nextUrl =
    sectionKey === 'inicio'
      ? window.location.pathname
      : `${window.location.pathname}?seccion=${encodeURIComponent(sectionKey)}`;

  history.pushState(
    { section: sectionKey },
    '',
    nextUrl
  );

  loadSection(sectionKey);
}


/* =========================================================
   INICIO Y ENLACES DIRECTOS
   ========================================================= */

window.addEventListener(
  'DOMContentLoaded',
  async () => {

    await cargarConfiguracion();

    injectInitialScreenStyles();

    const urlParams =
      new URLSearchParams(
        window.location.search
      );

    const targetId =
      urlParams.get('peli') ||
      urlParams.get('episodio') ||
      urlParams.get('id');

    if (!targetId) {
      history.replaceState(
        { section: 'inicio' },
        '',
        window.location.pathname
      );

      showInitialScreen();
      return;
    }

    window.__initialNavigation = true;

    const secciones = [
      'sagas',
      'peliculas',
      'series',
      'anime',
      'videos'
    ];

    let encontrado = false;

    for (const sec of secciones) {
      const data =
        await loadSection(sec);

      if (!data) continue;


      /* ---------- SAGAS / PELÍCULAS AGRUPADAS ---------- */

      if (
        sec === 'sagas' ||
        (
          sec === 'peliculas' &&
          data.some(g => g.peliculas)
        )
      ) {

        for (const grupo of data) {
          if (!grupo.peliculas) continue;

          const item =
            grupo.peliculas.find(
              peli => peli.id === targetId
            );

          if (item) {
            openModal(item);
            encontrado = true;
            break;
          }
        }


      /* ---------- SERIES / ANIME ---------- */

      } else if (
        sec === 'series' ||
        sec === 'anime'
      ) {

        for (const serie of data) {

          if (serie.id === targetId) {
            openSeriesModal(serie);
            encontrado = true;
            break;
          }

          if (serie.temporadas) {

            for (const temp of serie.temporadas) {

              if (!temp.episodios) continue;

              const ep =
                temp.episodios.find(
                  episodio =>
                    episodio.id === targetId
                );

              if (ep) {
                currentSerieData = serie;

                openEpisodeDetailsModal(
                  ep,
                  temp
                );

                encontrado = true;
                break;
              }
            }
          }

          if (encontrado) break;
        }


      /* ---------- CONTENIDO NORMAL ---------- */

      } else {

        const item =
          data.find(
            peli => peli.id === targetId
          );

        if (item) {
          openModal(item);
          encontrado = true;
          break;
        }
      }

      if (encontrado) break;
    }

    if (!encontrado) {
      console.warn(
        'No se encontró ningún elemento con el ID especificado:',
        targetId
      );

      history.replaceState(
        { section: 'inicio' },
        '',
        window.location.pathname
      );

      showInitialScreen();
    }

    window.__initialNavigation = false;
  }
);


/* =========================================================
   TARJETAS
   ========================================================= */

function createCardElement(item) {
  const formattedDur =
    formatDuration(item.duracion);

  const card =
    document.createElement('div');

  card.className = 'card';

  const isSeries =
    (
      item.temporadas &&
      item.temporadas.length > 0
    ) ||
    currentSectionKey === 'series' ||
    currentSectionKey === 'anime';

  card.onclick = () => {
    if (isSeries) {
      openSeriesModal(item);
    } else {
      openModal(item);
    }
  };


  /* ---------- POSTER ---------- */

  const posterWrapper =
    document.createElement('div');

  posterWrapper.className =
    'poster-wrapper';


  /* ---------- FAVORITO ---------- */

  const favActive =
    isFavorite(item);

  const favBtn =
    document.createElement('button');

  favBtn.className =
    `fav-btn ${favActive ? 'active' : ''}`;

  favBtn.innerHTML =
    favActive ? '★' : '☆';

  favBtn.title =
    favActive
      ? 'Quitar de Favoritos'
      : 'Añadir a Favoritos';

  favBtn.onclick =
    event =>
      toggleFavorite(event, item);


  /* ---------- IMAGEN ---------- */

  const img =
    document.createElement('img');

  img.src = item.portada || '';
  img.alt =
    item.titulo || 'Portada';

  img.loading = 'lazy';
  img.decoding = 'async';
  img.onerror = () => {
    img.onerror = null;
    img.removeAttribute('src');
    img.alt = 'Imagen no disponible';
    img.style.opacity = '0.45';
  };


  /* ---------- INFORMACIÓN ---------- */

  const cardInfo =
    document.createElement('div');

  cardInfo.className =
    'card-info';

  const title =
    document.createElement('div');

  title.className =
    'card-title';

  title.textContent =
    item.titulo || 'Sin título';

  const meta =
    document.createElement('div');

  meta.className =
    'card-meta';

  meta.textContent =
    `${item.ano || ''}${
      formattedDur
        ? ' • ' + formattedDur
        : ''
    }`;


  /* ---------- BOTÓN QUITAR DEL HISTORIAL ---------- */

  if (currentSectionKey === 'historial') {
    const historyBtn = document.createElement('button');
    historyBtn.className = 'hist-btn';
    historyBtn.innerHTML = '🗑️';
    historyBtn.title = 'Quitar del historial';
    historyBtn.onclick = event => removeFromHistory(event, item);
    posterWrapper.appendChild(historyBtn);
  }

  /* ---------- ENSAMBLAJE ---------- */

  posterWrapper.appendChild(favBtn);
  posterWrapper.appendChild(img);

  cardInfo.appendChild(title);
  cardInfo.appendChild(meta);

  card.appendChild(posterWrapper);
  card.appendChild(cardInfo);

  return card;
}


/* =========================================================
   RENDERIZADO DEL CATÁLOGO
   ========================================================= */

function renderCatalog(items) {
  const container =
    $('catalogContainer');

  container.innerHTML = '';

  if (!items?.length) {

    if (currentSectionKey === 'historial') {

      container.innerHTML = `
        <div style="text-align:center; margin-top:50px; color:var(--text-muted);">
          <div style="font-size:3rem; margin-bottom:12px;">🕘</div>
          <p style="font-size:1.1rem;">Aún no tienes reproducciones en el historial.</p>
          <p style="font-size:.95rem;">Cuando abras una película o serie, aparecerá aquí.</p>
        </div>
      `;

    } else if (currentSectionKey === 'favoritos') {

      container.innerHTML = `
        <p style="
          text-align:center;
          color:var(--text-muted);
          margin-top:50px;
          font-size:1.1rem;
        ">
          No tienes favoritos guardados aún.
          Haz clic en la estrella ⭐ de cualquier
          contenido para agregarlo aquí.
        </p>
      `;

    } else {

      container.innerHTML = `
        <p style="
          text-align:center;
          color:var(--text-muted);
          margin-top:50px;
          font-size:1.1rem;
        ">
          No hay contenido disponible en esta sección en este momento.
        </p>
      `;
    }

    return;
  }


  /* ---------- ICONO DE SECCIÓN ---------- */

  const iconos = {
    sagas: '📁',
    peliculas: '🎭',
    videos: '📽️',
    series: '👀',
    anime: '🇯🇵',
    tv: '📺',
    favoritos: '⭐',
    historial: '🕘'
  };

  const folderIcon =
    iconos[currentSectionKey] || '📁';


  /* ---------- DETECTAR GRUPOS ---------- */

  const esEstructuraGrupos =
    items.some(
      item =>
        item.peliculas &&
        Array.isArray(item.peliculas)
    );


  /* ---------- CATÁLOGO AGRUPADO ---------- */

  if (esEstructuraGrupos) {

    items.forEach(grupo => {

      if (
        !grupo.peliculas ||
        !grupo.peliculas.length
      ) {
        return;
      }

      const sagaSection =
        document.createElement('div');

      sagaSection.className =
        'saga-section';

      if (!grupo.abierta) {
        sagaSection.classList.add(
          'collapsed'
        );
      }


      const groupTitle =
        grupo.saga ||
        grupo.genero ||
        grupo.categoria ||
        grupo.nombre ||
        grupo.titulo ||
        'Categoría';

      const groupIcon =
        grupo.icono ||
        grupo.icon ||
        folderIcon;


      /* ---------- CABECERA ---------- */

      const sagaHeader =
        document.createElement('div');

      sagaHeader.className =
        'saga-header';

      sagaHeader.onclick = () => {
        sagaSection.classList.toggle(
          'collapsed'
        );
      };

      sagaHeader.innerHTML = `
        <div class="saga-title-content">
          <span class="folder-icon">
            ${groupIcon}
          </span>

          <span>
            ${groupTitle}
          </span>
        </div>

        <span class="arrow-icon">
          ▼
        </span>
      `;


      /* ---------- CONTENIDO ---------- */

      const sagaContent =
        document.createElement('div');

      sagaContent.className =
        'saga-content';

      const grid =
        document.createElement('div');

      grid.className =
        'grid-container';


      grupo.peliculas.forEach(peli => {
        grid.appendChild(
          createCardElement(peli)
        );
      });


      sagaContent.appendChild(grid);

      sagaSection.appendChild(
        sagaHeader
      );

      sagaSection.appendChild(
        sagaContent
      );

      container.appendChild(
        sagaSection
      );
    });


  /* ---------- CATÁLOGO SIMPLE ---------- */

  } else {

    const grid =
      document.createElement('div');

    grid.className =
      'grid-container';

    items.forEach(item => {
      grid.appendChild(
        createCardElement(item)
      );
    });

    container.appendChild(grid);
  }
}


/* =========================================================
   BÚSQUEDA
   ========================================================= */

function normalizeSearchText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Normalización adicional para búsquedas: elimina espacios y signos
// para que V/H/S, V-H-S, V H S y VHS se consideren equivalentes.
function normalizeSearchCompact(value) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]/g, '');
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }

    prev = current;
  }

  return prev[b.length];
}

function fuzzyTitleMatch(title, query) {
  const t = normalizeSearchCompact(title);
  const q = normalizeSearchCompact(query);

  if (!t || !q) return 0;
  if (t === q) return 1000;
  if (t.startsWith(q)) return 800;
  if (t.includes(q)) return 600;

  // Tolerancia a errores de escritura.
  // Ejemplos: VHS -> BHS, Renacido -> Renasido/Renazido.
  const maxDistance = q.length <= 3 ? 1 : q.length <= 6 ? 2 : 2;
  let best = Infinity;

  // Comparamos también contra fragmentos del título. Así una búsqueda
  // como "renasido" encuentra "El Renacido" aunque el título tenga
  // palabras antes o después.
  if (t.length >= q.length) {
    for (let i = 0; i <= t.length - q.length; i++) {
      const fragment = t.slice(i, i + q.length);
      best = Math.min(best, levenshteinDistance(fragment, q));
      if (best === 0) break;
    }
  }

  // También probamos cada palabra completa del título.
  const words = normalizeSearchText(title)
    .split(/\s+/)
    .map(normalizeSearchCompact)
    .filter(Boolean);

  for (const word of words) {
    if (Math.abs(word.length - q.length) <= maxDistance) {
      best = Math.min(best, levenshteinDistance(word, q));
    }
  }

  if (best <= maxDistance) {
    return Math.max(120, 500 - best * 100);
  }

  return 0;
}

function getSearchScore(item, query, groupTitle = '') {
  const q = normalizeSearchText(query);
  const qCompact = normalizeSearchCompact(query);
  if (!q || !item) return 0;

  let score = 0;

  const titulo = normalizeSearchText(item.titulo);
  const tituloCompact = normalizeSearchCompact(item.titulo);
  const ano = normalizeSearchText(item.ano);
  const director = normalizeSearchText(item.director);
  const saga = normalizeSearchText(
    item.saga ||
    item.genero ||
    item.categoria ||
    groupTitle
  );

  score = Math.max(score, fuzzyTitleMatch(item.titulo, query));

  if (tituloCompact === qCompact) score = Math.max(score, 1000);
  else if (tituloCompact.startsWith(qCompact)) score = Math.max(score, 800);
  else if (tituloCompact.includes(qCompact)) score = Math.max(score, 600);

  if (ano && ano.includes(q)) score = Math.max(score, 500);

  if (director === q) score = Math.max(score, 450);
  else if (director.includes(q)) score = Math.max(score, 400);

  if (saga === q) score = Math.max(score, 350);
  else if (saga.includes(q)) score = Math.max(score, 300);

  const temporadas = Array.isArray(item.temporadas)
    ? item.temporadas
    : [];

  for (const temp of temporadas) {
    const temporadaText = normalizeSearchText(
      `temporada ${temp.numeroTemporada ?? ''} ${temp.titulo ?? ''}`
    );

    const numeroTemporada =
      normalizeSearchText(temp.numeroTemporada);

    const tituloTemporada =
      normalizeSearchText(temp.titulo);

    if (
      temporadaText === q ||
      numeroTemporada === q
    ) {
      score = Math.max(score, 280);
    } else if (
      temporadaText.includes(q) ||
      tituloTemporada.includes(q)
    ) {
      score = Math.max(score, 260);
    }

    const episodios = Array.isArray(temp.episodios)
      ? temp.episodios
      : [];

    for (const ep of episodios) {
      const epTitle = normalizeSearchText(ep.titulo);
      const epNumber =
        normalizeSearchText(ep.numeroEpisodio);

      const episodeText = normalizeSearchText(
        `episodio ${ep.numeroEpisodio ?? ''} ${ep.titulo ?? ''}`
      );

      if (epTitle === q) score = Math.max(score, 250);
      else if (
        epTitle.includes(q) ||
        episodeText.includes(q)
      ) {
        score = Math.max(score, 230);
      }

      if (epNumber && epNumber === q) {
        score = Math.max(score, 220);
      }
    }
  }

  return score;
}

function addSearchResult(results, item, sectionKey, groupTitle = '') {
  if (!item) return;

  const score = getSearchScore(
    item,
    results.query,
    groupTitle
  );

  if (score <= 0) return;

  results.items.push({
    item,
    sectionKey,
    score,
    groupTitle
  });
}

function filterGlobalCatalog(query) {
  const normalizedQuery =
    normalizeSearchText(query);

  if (!normalizedQuery) {
    showInitialScreen();
    return;
  }

  const results = {
    query: normalizedQuery,
    items: []
  };

  const sectionKeys = [
    'peliculas',
    'sagas',
    'series',
    'anime',
    'videos',
    'tv',
    'favoritos'
  ];

  for (const sectionKey of sectionKeys) {
    const items =
      LOCAL_CATALOG[sectionKey] || [];

    const esEstructuraGrupos =
      items.some(
        item =>
          item?.peliculas &&
          Array.isArray(item.peliculas)
      );

    if (esEstructuraGrupos) {
      for (const grupo of items) {
        const groupTitle =
          grupo.saga ||
          grupo.genero ||
          grupo.categoria ||
          grupo.nombre ||
          grupo.titulo ||
          '';

        const groupMatches =
          normalizeSearchText(groupTitle)
            .includes(normalizedQuery);

        for (const peli of (
          Array.isArray(grupo.peliculas)
            ? grupo.peliculas
            : []
        )) {
          const score =
            getSearchScore(
              peli,
              normalizedQuery,
              groupTitle
            );

          if (score > 0) {
            results.items.push({
              item: peli,
              sectionKey,
              score,
              groupTitle
            });
          } else if (groupMatches) {
            results.items.push({
              item: peli,
              sectionKey,
              score: 300,
              groupTitle
            });
          }
        }
      }
    } else {
      for (const item of items) {
        addSearchResult(
          results,
          item,
          sectionKey
        );
      }
    }
  }

  results.items.sort((a, b) =>
    b.score - a.score ||
    String(a.item.titulo || '')
      .localeCompare(
        String(b.item.titulo || ''),
        'es',
        { sensitivity: 'base' }
      )
  );

  renderGlobalSearchResults(
    results.items,
    normalizedQuery
  );
}

function renderGlobalSearchResults(results, query) {
  const container = $('catalogContainer');

  if (!container) return;

  container.innerHTML = '';

  if (!results.length) {
    container.innerHTML = `
      <div style="
        text-align:center;
        color:var(--text-muted);
        margin-top:50px;
        font-size:1.1rem;
      ">
        No encontramos resultados para
        <strong>"${query}"</strong>.
      </div>
    `;
    return;
  }

  const heading = document.createElement('div');

  heading.style.cssText = `
    text-align:center;
    color:var(--text-main);
    margin:20px 0 25px;
    font-size:1.1rem;
  `;

  heading.innerHTML =
    `🔎 Resultados para <strong>"${query}"</strong>
     <span style="color:var(--text-muted);font-size:.9rem;">
       (${results.length})
     </span>`;

  container.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'grid-container';

  // Evitar duplicados cuando el mismo contenido aparece
  // en más de una sección.
  const seen = new Set();

  for (const result of results) {
    const item = result.item;
    const key = getItemId(item);

    if (key && seen.has(key)) continue;

    if (key) seen.add(key);

    grid.appendChild(
      createCardElement(item)
    );
  }

  container.appendChild(grid);
}

let searchRequestId = 0;
let searchDebounceTimer = null;

async function prepararBusquedaGlobal() {
  // Inicio puede abrirse sin haber cargado ninguna sección todavía.
  // Cargamos solo los catálogos necesarios para buscar y dejamos
  // TV Live fuera porque es una fuente M3U mucho más pesada.
  const secciones = [
    'peliculas',
    'sagas',
    'series',
    'anime',
    'videos'
  ];

  const pendientes = secciones.filter(
    sectionKey =>
      !LOCAL_CATALOG[sectionKey] ||
      !LOCAL_CATALOG[sectionKey].length
  );

  if (!pendientes.length) return;

  // IMPORTANTE: no deshabilitamos el input.
  // Así el teclado/foco permanece activo mientras cargan los catálogos.
  await Promise.allSettled(
    pendientes.map(sectionKey =>
      cargarSeccionRemota(sectionKey)
    )
  );
}

async function ejecutarBusqueda(query, requestId) {
  if (requestId !== searchRequestId) return;

  const normalized = normalizeSearchText(query);

  if (!normalized) {
    if (currentSectionKey === 'inicio') {
      showInitialScreen();
    } else {
      renderCatalog(LOCAL_CATALOG[currentSectionKey] || []);
    }
    return;
  }

  await prepararBusquedaGlobal();

  // Si el usuario siguió escribiendo mientras cargaba, descartamos
  // esta búsqueda antigua y dejamos que la nueva continúe.
  if (requestId !== searchRequestId) return;

  filterGlobalCatalog(query);
}

function filterCatalog() {
  const search = $('searchInput');
  const query = search?.value || '';

  searchRequestId++;
  const requestId = searchRequestId;

  clearTimeout(searchDebounceTimer);

  // Pequeño debounce para no lanzar una carga/búsqueda por cada tecla.
  searchDebounceTimer = setTimeout(() => {
    ejecutarBusqueda(query, requestId);
  }, 120);
}



/* =========================================================
   MODAL DE PELÍCULA / VIDEO
   ========================================================= */

function openModal(peli) {
  addToHistory(peli);

  const formattedDur =
    formatDuration(peli.duracion);

  $('modalImg').src =
    peli.portada || '';

  $('modalTitle').innerText =
    peli.titulo || 'Sin título';

  $('modalYear').innerHTML =
    `📅 ${peli.ano || 'S/A'}`;

  $('modalDuration').innerHTML =
    `🕕 ${formattedDur || 'N/A'}`;


  const directorTag =
    $('modalDirector');

  if (peli.director) {

    directorTag.innerHTML =
      `🎥 ${peli.director}`;

    directorTag.style.display =
      'flex';

  } else {

    directorTag.style.display =
      'none';
  }


  $('modalTotalCap').style.display =
    'none';

  $('modalSinopsis').innerText =
    peli.sinopsis ||
    'Sin descripción disponible.';


  const tempContainer =
    $('modalTemporadasContainer');

  if (tempContainer) {
    tempContainer.style.display =
      'none';
  }

  $('modalPlayBtn').style.display =
    'block';


  /* ---------- URL DEL REPRODUCTOR ---------- */

  if (peli.id) {

    targetHtmlUrl =
      `reproductor.html?id=${
        encodeURIComponent(peli.id)
      }`;

    updateModalHistory(
      `id=${encodeURIComponent(peli.id)}`
    );

  } else if (peli.url) {

    targetHtmlUrl =
      `reproductor.html?url=${
        encodeURIComponent(peli.url)
      }&titulo=${
        encodeURIComponent(
          peli.titulo || 'Reproductor'
        )
      }`;
  }


  $('movieModal').style.display =
    'flex';
}


/* =========================================================
   MODAL DE SERIE
   ========================================================= */

function openSeriesModal(serie) {
  addToHistory(serie);
  currentSerieData = serie;
  currentSeasonData = null;

  const mainPoster =
    serie.portada || '';

  const totalTemporadasCount =
    serie.temporadas
      ? serie.temporadas.length
      : 0;


  $('modalImg').src =
    mainPoster;

  $('modalTitle').innerText =
    serie.titulo || 'Sin título';

  $('modalYear').innerHTML =
    `📅 ${serie.ano || 'S/A'}`;

  $('modalDuration').innerHTML =
    `📁 ${totalTemporadasCount} temporada${
      totalTemporadasCount === 1
        ? ''
        : 's'
    }`;


  if (serie.id) {
    updateModalHistory(
      `id=${encodeURIComponent(serie.id)}`
    );
  }


  /* ---------- DIRECTOR ---------- */

  const directorTag =
    $('modalDirector');

  if (serie.director) {

    directorTag.innerHTML =
      `🎥 ${serie.director}`;

    directorTag.style.display =
      'flex';

  } else {

    directorTag.style.display =
      'none';
  }


  /* ---------- TOTAL DE EPISODIOS ---------- */

  let totalCapsCount = 0;

  if (serie.temporadas) {

    serie.temporadas.forEach(
      temporada => {

        if (temporada.episodios) {
          totalCapsCount +=
            temporada.episodios.length;
        }
      }
    );
  }


  const totalCapTag =
    $('modalTotalCap');

  if (totalCapsCount > 0) {

    totalCapTag.innerHTML =
      `🎬 ${totalCapsCount} caps totales`;

    totalCapTag.style.display =
      'flex';

  } else {

    totalCapTag.style.display =
      'none';
  }


  $('modalSinopsis').innerText =
    serie.sinopsis ||
    'Sin descripción disponible general.';

  $('modalPlayBtn').style.display =
    'none';


  /* ---------- CONTENEDOR DE TEMPORADAS ---------- */

  let tempContainer =
    $('modalTemporadasContainer');

  if (!tempContainer) {

    tempContainer =
      document.createElement('div');

    tempContainer.id =
      'modalTemporadasContainer';

    tempContainer.style.marginTop =
      '20px';

    document
      .querySelector('.modal-details')
      .appendChild(tempContainer);
  }


  tempContainer.style.display =
    'block';

  tempContainer.innerHTML = '';


  /* ---------- BOTONES DE TEMPORADA ---------- */

  if (
    serie.temporadas &&
    serie.temporadas.length
  ) {

    serie.temporadas.forEach(temp => {

      const seasonBtn =
        document.createElement('button');

      seasonBtn.style.cssText = `
        display:flex;
        justify-content:space-between;
        align-items:center;
        width:100%;
        padding:14px 18px;
        margin-bottom:10px;
        background:rgba(28,22,46,.7);
        border:1px solid var(--border-purple);
        border-radius:10px;
        color:#fff;
        font-weight:700;
        font-size:1rem;
        cursor:pointer;
        transition:all .2s;
      `;

      seasonBtn.onmouseover = () => {
        seasonBtn.style.background =
          'rgba(126,34,206,.3)';

        seasonBtn.style.borderColor =
          'var(--accent-purple)';
      };

      seasonBtn.onmouseout = () => {
        seasonBtn.style.background =
          'rgba(28,22,46,.7)';

        seasonBtn.style.borderColor =
          'var(--border-purple)';
      };


      const numCapsEnTemporada =
        temp.episodios
          ? temp.episodios.length
          : 0;


      seasonBtn.innerHTML = `
        📁 Temporada ${temp.numeroTemporada}

        <span style="
          font-size:.85rem;
          color:var(--text-muted);
          font-weight:normal;
          margin-left:8px;
        ">
          (${numCapsEnTemporada}
          cap${numCapsEnTemporada === 1 ? '' : 's'})
        </span>

        <span style="
          color:var(--accent-purple);
          font-size:1.1rem;
        ">
          ➔
        </span>
      `;

      seasonBtn.onclick =
        () => openSeasonEpisodesView(temp);

      tempContainer.appendChild(
        seasonBtn
      );
    });

  } else {

    tempContainer.innerHTML = `
      <p style="
        color:var(--text-muted);
        text-align:center;
      ">
        No hay temporadas registradas aún.
      </p>
    `;
  }


  $('movieModal').style.display =
    'flex';
}


/* =========================================================
   VISTA DE EPISODIOS
   ========================================================= */

function openSeasonEpisodesView(temp) {
  currentSeasonData = temp;

  const seasonPoster =
    temp.portada ||
    currentSerieData?.portada ||
    '';


  $('modalImg').src =
    seasonPoster;

  $('modalTitle').innerText =
    `${currentSerieData
      ? currentSerieData.titulo
      : ''
    } - Temporada ${
      temp.numeroTemporada
    }`;

  $('modalYear').innerHTML =
    `📅 T${temp.numeroTemporada} (${
      temp.ano ||
      currentSerieData?.ano ||
      'S/A'
    })`;


  const numCaps =
    temp.episodios
      ? temp.episodios.length
      : 0;

  $('modalDuration').innerHTML =
    `🎬 ${numCaps} episodio${
      numCaps === 1 ? '' : 's'
    }`;

  $('modalDirector').style.display =
    'none';

  $('modalTotalCap').style.display =
    'none';

  $('modalSinopsis').innerText =
    temp.sinopsis ||
    `Selecciona un capítulo de la temporada ${
      temp.numeroTemporada
    } para ver sus detalles.`;

  $('modalPlayBtn').style.display =
    'none';


  const tempContainer =
    $('modalTemporadasContainer');

  tempContainer.innerHTML = '';


  /* ---------- BOTÓN VOLVER ---------- */

  const backBtn =
    document.createElement('button');

  backBtn.style.cssText = `
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    width:100%;
    padding:12px 16px;
    margin-bottom:18px;
    background:linear-gradient(
      135deg,
      rgba(168,85,247,.3),
      rgba(126,34,206,.4)
    );
    border:1px solid var(--accent-purple);
    border-radius:10px;
    color:#fff;
    font-weight:700;
    font-size:.95rem;
    cursor:pointer;
    transition:all .2s;
    box-shadow:
      0 4px 12px
      rgba(126,34,206,.3);
  `;

  backBtn.onmouseover = () => {
    backBtn.style.background =
      'linear-gradient(' +
      '135deg,' +
      'rgba(168,85,247,.5),' +
      'rgba(126,34,206,.6)' +
      ')';
  };

  backBtn.onmouseout = () => {
    backBtn.style.background =
      'linear-gradient(' +
      '135deg,' +
      'rgba(168,85,247,.3),' +
      'rgba(126,34,206,.4)' +
      ')';
  };

  backBtn.innerHTML =
    '⬅️ Volver a los detalles de la serie';

  backBtn.onclick =
    () => openSeriesModal(currentSerieData);

  tempContainer.appendChild(
    backBtn
  );


  /* ---------- LISTA DE EPISODIOS ---------- */

  const epsListDiv =
    document.createElement('div');

  epsListDiv.style.cssText =
    'display:flex;' +
    'flex-direction:column;' +
    'gap:8px;';


  if (
    temp.episodios &&
    temp.episodios.length
  ) {

    temp.episodios.forEach(ep => {

      const epBtn =
        document.createElement('button');

      epBtn.style.cssText = `
        display:block;
        width:100%;
        text-align:left;
        background:rgba(13,10,20,.8);
        border:1px solid var(--border-purple);
        color:var(--text-main);
        padding:12px 15px;
        cursor:pointer;
        border-radius:8px;
        font-size:.95rem;
        font-weight:600;
        transition:all .2s;
      `;

      epBtn.onmouseover = () => {
        epBtn.style.background =
          'rgba(168,85,247,.25)';

        epBtn.style.borderColor =
          'var(--accent-purple)';
      };

      epBtn.onmouseout = () => {
        epBtn.style.background =
          'rgba(13,10,20,.8)';

        epBtn.style.borderColor =
          'var(--border-purple)';
      };


      const numEpFormatted =
        String(ep.numeroEpisodio)
          .padStart(2, '0');


      epBtn.innerHTML = `
        ▶️ EP ${numEpFormatted} -
        ${ep.titulo}

        <span style="
          font-size:.8rem;
          color:var(--text-muted);
          font-weight:normal;
          float:right;
        ">
          ${ep.duracion || ''}
        </span>
      `;

      epBtn.onclick =
        () =>
          openEpisodeDetailsModal(
            ep,
            temp
          );

      epsListDiv.appendChild(
        epBtn
      );
    });

  } else {

    epsListDiv.innerHTML = `
      <p style="
        color:var(--text-muted);
        text-align:center;
        padding:15px;
      ">
        No hay capítulos registrados
        para esta temporada aún.
      </p>
    `;
  }


  tempContainer.appendChild(
    epsListDiv
  );
}


/* =========================================================
   DETALLES DE EPISODIO
   ========================================================= */

function openEpisodeDetailsModal(ep, temp) {

  const epPoster =
    ep.portada ||
    temp.portada ||
    currentSerieData?.portada ||
    '';

  const formattedDur =
    formatDuration(ep.duracion);

  const numEpFormatted =
    String(ep.numeroEpisodio)
      .padStart(2, '0');


  $('modalImg').src =
    epPoster;

  $('modalTitle').innerText =
    `${currentSerieData
      ? currentSerieData.titulo
      : ''
    } - T${temp.numeroTemporada} ` +
    `EP ${numEpFormatted}: ${ep.titulo}`;

  $('modalYear').innerHTML =
    `📅 ${
      ep.ano ||
      temp.ano ||
      currentSerieData?.ano ||
      'S/A'
    }`;

  $('modalDuration').innerHTML =
    `🕕 ${formattedDur || 'N/A'}`;

  $('modalDirector').style.display =
    'none';

  $('modalTotalCap').style.display =
    'none';

  $('modalSinopsis').innerText =
    ep.sinopsis ||
    'Sin descripción disponible para este episodio.';


  const tempContainer =
    $('modalTemporadasContainer');

  tempContainer.innerHTML = '';


  /* ---------- VOLVER A TEMPORADA ---------- */

  const backToSeasonBtn =
    document.createElement('button');

  backToSeasonBtn.style.cssText = `
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    width:100%;
    padding:12px 16px;
    margin-bottom:18px;
    background:linear-gradient(
      135deg,
      rgba(168,85,247,.3),
      rgba(126,34,206,.4)
    );
    border:1px solid var(--accent-purple);
    border-radius:10px;
    color:#fff;
    font-weight:700;
    font-size:.95rem;
    cursor:pointer;
    transition:all .2s;
    box-shadow:
      0 4px 12px
      rgba(126,34,206,.3);
  `;

  backToSeasonBtn.onmouseover = () => {
    backToSeasonBtn.style.background =
      'linear-gradient(' +
      '135deg,' +
      'rgba(168,85,247,.5),' +
      'rgba(126,34,206,.6)' +
      ')';
  };

  backToSeasonBtn.onmouseout = () => {
    backToSeasonBtn.style.background =
      'linear-gradient(' +
      '135deg,' +
      'rgba(168,85,247,.3),' +
      'rgba(126,34,206,.4)' +
      ')';
  };

  backToSeasonBtn.innerHTML =
    '⬅️ Volver a la lista de episodios';

  backToSeasonBtn.onclick =
    () =>
      openSeasonEpisodesView(temp);

  tempContainer.appendChild(
    backToSeasonBtn
  );


  /* ---------- BOTÓN REPRODUCIR ---------- */

  const playEpBtn =
    document.createElement('button');

  playEpBtn.className =
    'btn-play';

  playEpBtn.innerHTML =
    '▶ REPRODUCIR AHORA';


  const epId = ep.id;

  if (epId) {
    updateModalHistory(
      `episodio=${encodeURIComponent(epId)}`
    );
  }


  playEpBtn.onclick = () => {

    addToHistory({
      ...ep,
      id: epId || `${currentSerieData?.id || currentSerieData?.titulo || 'serie'}_t${temp.numeroTemporada}_e${ep.numeroEpisodio}`,
      titulo: `${currentSerieData?.titulo || 'Serie'} - T${temp.numeroTemporada} Ep ${ep.numeroEpisodio}`,
      portada: currentSerieData?.portada || ep.portada || '',
      ano: currentSerieData?.ano || ep.ano || '',
      duracion: ep.duracion || '',
      director: currentSerieData?.director || ''
    });

    if (epId) {

      targetHtmlUrl =
        `reproductor.html?id=${
          encodeURIComponent(epId)
        }`;

    } else if (ep.url) {

      targetHtmlUrl =
        `reproductor.html?url=${
          encodeURIComponent(ep.url)
        }&titulo=${
          encodeURIComponent(
            `${
              currentSerieData
                ? currentSerieData.titulo
                : ''
            } - T${temp.numeroTemporada}` +
            ` Ep ${ep.numeroEpisodio}`
          )
        }`;
    }

    launchPlayer();
  };


  tempContainer.appendChild(
    playEpBtn
  );

  $('movieModal').style.display =
    'flex';
}


/* =========================================================
   REPRODUCTOR
   ========================================================= */

function launchPlayer() {

  if (!targetHtmlUrl) return;

  if (
    currentSectionKey === 'tv' &&
    targetHtmlUrl.includes('http://') &&
    !targetHtmlUrl.includes('https://')
  ) {

    const abrirAfuera =
      confirm(
        'Este canal utiliza un protocolo HTTP ' +
        'no cifrado. Los navegadores web suelen ' +
        'bloquearlo internamente por seguridad.\n\n' +
        '¿Deseas abrirlo de todas formas en una ' +
        'pestaña independiente?'
      );

    if (abrirAfuera) {

      const urlMatch =
        targetHtmlUrl.match(
          /url=([^&]+)/
        );

      if (urlMatch?.[1]) {
        window.open(
          decodeURIComponent(urlMatch[1]),
          '_blank'
        );
      }
    }

    return;
  }

  window.location.href =
    targetHtmlUrl;
}


/* =========================================================
   CERRAR MODAL
   ========================================================= */

function closeModal(event) {
  // El botón X se comporta igual que Atrás: elimina solamente
  // la ventana/modal actual y conserva la sección donde estábamos.
  const params =
    new URLSearchParams(window.location.search);

  const tieneModal =
    params.has('id') ||
    params.has('peli') ||
    params.has('episodio');

  if (tieneModal && window.history.length > 1) {
    history.back();
    return;
  }

  hideModalOnly();
}

/* =========================================================
   ERRORES GLOBALES
   ========================================================= */

window.addEventListener('unhandledrejection', event => {
  console.error('Promesa no controlada:', event.reason);
});

window.addEventListener('error', event => {
  console.error('Error de JavaScript:', event.error || event.message);
});

/* =========================================================
   ATRÁS / HISTORIAL DEL NAVEGADOR
   ========================================================= */

window.addEventListener('popstate', () => {
  const params =
    new URLSearchParams(window.location.search);

  const targetId =
    params.get('peli') ||
    params.get('episodio') ||
    params.get('id');

  // Si no hay un elemento abierto, Atrás simplemente restaura
  // la sección representada por la entrada anterior del historial.
  if (!targetId) {
    hideModalOnly();

    const section =
      params.get('seccion') || 'inicio';

    if (section === 'inicio') {
      currentSectionKey = 'inicio';
      const select = $('sectionSelect');
      if (select) select.value = 'inicio';
      showInitialScreen();
      return;
    }

    loadSection(section);
    return;
  }

  // Si el historial cae sobre una URL con contenido abierto,
  // mantenemos el comportamiento compatible con enlaces directos.
  if ($('movieModal')?.style.display !== 'flex') {
    return;
  }
});
