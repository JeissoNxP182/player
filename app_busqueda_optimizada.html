'use strict';

// JXP OPT 1: renderizado por lotes + limpieza de precarga no usada.
// JXP CACHE FIX: remote JSON is the source of truth; IndexedDB is fallback only.
// JXP OPT 2: búsqueda global con caché de metadatos + consultas y catálogo de búsqueda independiente.

/* =========================================================
   JEISSONXP - APP.JS
   JavaScript principal del catálogo
   ========================================================= */

/* ---------- CONFIGURACIÓN CENTRALIZADA ---------- */

const DEFAULT_CONFIG = {
  siteName: "JeissoNxP",
  catalogIndex: "configuracion/catalogo-index.json",
  favoritesKey: "jxp_favorites",
  historyKey: "jxp_historial",
  historyMax: 20,
  requestTimeout: 15000,
  repositories: {
    sagas: "https://jeissonxp182.github.io/player/datos/sagas.json",
    peliculas: "https://jeissonxp182.github.io/player/datos/peliculas.json",
    series: "https://jeissonxp182.github.io/player/datos/series.json",
    anime: "https://jeissonxp182.github.io/player/datos/anime.json",
    videos: "https://jeissonxp182.github.io/player/datos/videos.json",
    tv: "https://iptv-org.github.io/iptv/index.m3u"
  }
};

let APP_CONFIG = {
  ...DEFAULT_CONFIG,
  repositories: { ...DEFAULT_CONFIG.repositories }
};

async function cargarConfiguracion() {
  try {
    const respuesta = await fetch('configuracion/config.json?v=' + Date.now(), {
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

// Índice de búsqueda independiente del catálogo visible.
// Permite buscar en todas las categorías aunque la interfaz
// haya liberado de memoria las secciones que ya no están activas.
const GLOBAL_SEARCH_CATALOG = Object.create(null);
const SEARCH_META_CACHE = new WeakMap();
const SEARCH_QUERY_CACHE = new Map();
const SEARCH_QUERY_CACHE_MAX = 80;


// Gestión de memoria: evita conservar catálogos que ya no se necesitan.
// Se mantiene Inicio y la sección activa; favoritos/historial se gestionan aparte.
function liberarCatalogosInactivos(seccionActiva) {
  const conservar = new Set(['inicio', seccionActiva]);
  ['sagas', 'peliculas', 'series', 'anime', 'videos', 'tv'].forEach(key => {
    if (!conservar.has(key)) LOCAL_CATALOG[key] = [];
  });
}

let currentSectionKey = 'inicio';
let targetHtmlUrl = '';
let currentSerieData = null;
let currentSeasonData = null;

// Caché en memoria para evitar leer localStorage repetidamente.
let FAVORITES_CACHE = null;
let HISTORY_CACHE = null;

// Evita solicitudes duplicadas si una sección ya se está cargando.
const SECTION_LOAD_PROMISES = {};


// Caché persistente con IndexedDB: permite conservar catálogos entre
// recargas/cierres del navegador sin llenar localStorage.
const CATALOG_DB_NAME = 'jeissonxp_catalog_cache';
const CATALOG_DB_VERSION = 1;
const CATALOG_STORE_NAME = 'catalogos';
let CATALOG_DB_PROMISE = null;

function abrirCatalogoDB() {
  if (CATALOG_DB_PROMISE) return CATALOG_DB_PROMISE;

  if (!('indexedDB' in window)) return Promise.resolve(null);

  CATALOG_DB_PROMISE = new Promise(resolve => {
    try {
      const request = indexedDB.open(CATALOG_DB_NAME, CATALOG_DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(CATALOG_STORE_NAME)) {
          db.createObjectStore(CATALOG_STORE_NAME, { keyPath: 'sectionKey' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch (error) {
      console.warn('IndexedDB no disponible:', error);
      resolve(null);
    }
  });

  return CATALOG_DB_PROMISE;
}

async function leerCatalogoPersistente(sectionKey) {
  if (sectionKey === 'tv' || sectionKey === 'favoritos' || sectionKey === 'historial') return null;

  const db = await abrirCatalogoDB();
  if (!db) return null;

  return new Promise(resolve => {
    try {
      const tx = db.transaction(CATALOG_STORE_NAME, 'readonly');
      const request = tx.objectStore(CATALOG_STORE_NAME).get(sectionKey);

      request.onsuccess = () => {
        const registro = request.result;
        const ttl = Number(APP_CONFIG.catalogCacheTTL) || 21600000;

        if (
          registro &&
          Array.isArray(registro.data) &&
          registro.savedAt &&
          (Date.now() - registro.savedAt) <= ttl
        ) {
          resolve(registro.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    } catch (error) {
      console.warn('No se pudo leer la caché persistente:', error);
      resolve(null);
    }
  });
}

async function guardarCatalogoPersistente(sectionKey, data) {
  if (
    sectionKey === 'tv' ||
    sectionKey === 'favoritos' ||
    sectionKey === 'historial' ||
    !Array.isArray(data) ||
    !data.length
  ) return;

  const db = await abrirCatalogoDB();
  if (!db) return;

  try {
    await new Promise(resolve => {
      const tx = db.transaction(CATALOG_STORE_NAME, 'readwrite');
      tx.objectStore(CATALOG_STORE_NAME).put({
        sectionKey,
        savedAt: Date.now(),
        data
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  } catch (error) {
    console.warn('No se pudo guardar la caché persistente:', error);
  }
}

async function eliminarCatalogoPersistente(sectionKey) {
  if (sectionKey === 'tv') return;
  const db = await abrirCatalogoDB();
  if (!db) return;

  try {
    await new Promise(resolve => {
      const tx = db.transaction(CATALOG_STORE_NAME, 'readwrite');
      tx.objectStore(CATALOG_STORE_NAME).delete(sectionKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  } catch (error) {
    console.warn('No se pudo eliminar la caché persistente:', error);
  }
}


/* =========================================================
   UTILIDADES
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getItemId(item) {
  return item?.id || item?.titulo;
}

function formatDuration(duracion) {
  if (duracion === null || duracion === undefined || duracion === '') return '';

  const texto = String(duracion).trim();

  // Normaliza formatos como:
  // 01h:39m, 01h 39m, 1h:20min, 1h 20 min
  return texto.replace(
    /(\d+)\s*h\s*:?\s*(\d+)\s*(m|min)\b/i,
    '$1h:$2m'
  );
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

function getHistoryKey() {
  return APP_CONFIG.historyKey || DEFAULT_CONFIG.historyKey;
}

function getHistoryMax() {
  return Number(APP_CONFIG.historyMax) || Number(DEFAULT_CONFIG.historyMax) || 20;
}

function getHistory() {
  if (Array.isArray(HISTORY_CACHE)) return HISTORY_CACHE;

  try {
    const data = JSON.parse(localStorage.getItem(getHistoryKey()));
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

  const limitado = historial.slice(0, getHistoryMax());
  HISTORY_CACHE = limitado;
  localStorage.setItem(getHistoryKey(), JSON.stringify(limitado));
  LOCAL_CATALOG.historial = limitado;
}

function clearHistory() {
  localStorage.removeItem(getHistoryKey());
  HISTORY_CACHE = [];
  LOCAL_CATALOG.historial = [];
  if (currentSectionKey === 'historial') renderCatalog([]);
}

function removeFromHistory(event, item) {
  event?.stopPropagation();
  const id = getItemId(item);
  const nuevo = getHistory().filter(x => getItemId(x) !== id);
  HISTORY_CACHE = nuevo;
  localStorage.setItem(getHistoryKey(), JSON.stringify(nuevo));
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
      <div style="font-size:1.15rem;font-weight:700;color:var(--text-main,#f8fafc);">${escapeHtml(titulo)}</div>
      ${detalle ? `<div style="margin-top:8px;color:var(--text-muted,#94a3b8);font-size:.95rem;line-height:1.5;">${escapeHtml(detalle)}</div>` : ''}
      ${botonTexto ? `<button id="jxp-status-action" style="margin-top:16px;padding:10px 18px;border:1px solid var(--accent-purple,#a855f7);border-radius:10px;background:transparent;color:var(--text-main,#f8fafc);font:inherit;cursor:pointer;">${escapeHtml(botonTexto)}</button>` : ''}
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

async function cargarSeccionRemota(sectionKey, forceReload = false, renderResult = true) {
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
    if (renderResult) {
      renderCatalog(LOCAL_CATALOG[sectionKey]);
      updateSocialMeta(LOCAL_CATALOG[sectionKey]);
    }

    return LOCAL_CATALOG[sectionKey];
  }

  // La caché persistente NO se usa como fuente principal.
  // Primero buscamos siempre el JSON actual para evitar mostrar datos antiguos.
  // IndexedDB queda únicamente como respaldo si la red falla.

  // Si la misma sección ya está cargándose, reutilizamos esa petición
  // en vez de descargar el JSON otra vez.
  if (!forceReload && SECTION_LOAD_PROMISES[sectionKey]) {
    return SECTION_LOAD_PROMISES[sectionKey];
  }

  if (renderResult) {
    mostrarMensajeEstado('cargando', 'Cargando contenido...', 'Espera un momento.');
  }

  const carga = (async () => {
    try {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), Number(APP_CONFIG.requestTimeout) || 15000);
    let respuesta;
    try {
      const urlBase = getRepositoryUrl(sectionKey);
      const separador = urlBase.includes('?') ? '&' : '?';
      const urlActualizada = `${urlBase}${separador}_jxp=${Date.now()}`;
      respuesta = await fetch(urlActualizada, {
        signal: controlador.signal,
        cache: 'no-store'
      });
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
    liberarCatalogosInactivos(sectionKey);

    // Guardamos una copia persistente para futuras recargas. TV Live se excluye.
    void guardarCatalogoPersistente(sectionKey, data);

    if (!data.length) {
      if (renderResult) {
        mostrarSeccionVacia(sectionKey);
        updateSocialMeta(data);
      }
      return data;
    }

    if (renderResult) {
      renderCatalog(data);
      updateSocialMeta(data);
    }

    return data;

    } catch (error) {
      console.error('Error al cargar la sección:', error);
      if (error?.name === 'AbortError') error.message = 'TIMEOUT';

      // Si la red falla, usamos la última copia guardada como respaldo.
      if (sectionKey !== 'tv') {
        const respaldo = await leerCatalogoPersistente(sectionKey);
        if (Array.isArray(respaldo) && respaldo.length) {
          LOCAL_CATALOG[sectionKey] = respaldo;
          liberarCatalogosInactivos(sectionKey);
          if (renderResult) {
            renderCatalog(respaldo);
            updateSocialMeta(respaldo);
          }
          return respaldo;
        }
      }

      if (renderResult) {
        mensajeErrorSeccion(sectionKey, error);
      } else {
        console.warn(`Carga de ${sectionKey} no disponible:`, error);
      }
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

    // MOSTRAR INICIO INMEDIATAMENTE:
    // la pantalla aparece sin esperar a config.json.
    showInitialScreen();
    injectInitialScreenStyles();

    // La configuración se carga después, en segundo plano.
    // Así la interfaz no queda esperando la red.
    await cargarConfiguracion();

    const urlParams =
      new URLSearchParams(
        window.location.search
      );

    const targetId =
      urlParams.get('peli') ||
      urlParams.get('episodio') ||
      urlParams.get('id');

    const targetSection = urlParams.get('seccion');

    if (!targetId) {
      const seccionesValidas = [
        'inicio',
        'sagas',
        'peliculas',
        'series',
        'anime',
        'videos',
        'tv',
        'favoritos',
        'historial'
      ];

      if (
        targetSection &&
        seccionesValidas.includes(targetSection)
      ) {
        currentSectionKey = targetSection;

        const select = $('sectionSelect');
        if (select) {
          select.value = targetSection;
        }

        await loadSection(targetSection);
        return;
      }

      history.replaceState(
        { section: 'inicio' },
        '',
        window.location.pathname
      );

      // Inicio queda ligero: no descargamos catálogos hasta que el usuario los necesite.
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

  img.src =
    item.portada ||
    item.poster ||
    item.miniatura ||
    '';
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
            ${escapeHtml(groupIcon)}
          </span>

          <span>
            ${escapeHtml(groupTitle)}
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


      const fragment = document.createDocumentFragment();

      grupo.peliculas.forEach(peli => {
        fragment.appendChild(
          createCardElement(peli)
        );
      });

      grid.appendChild(fragment);
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

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
      fragment.appendChild(
        createCardElement(item)
      );
    });

    grid.appendChild(fragment);
    container.appendChild(grid);

    /* ---------- BOTÓN LIMPIAR HISTORIAL ---------- */
    if (currentSectionKey === 'historial') {
      const clearHistoryWrap = document.createElement('div');
      clearHistoryWrap.style.cssText = `
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 14px 0 8px;
      `;

      const clearHistoryBtn = document.createElement('button');
      clearHistoryBtn.type = 'button';
      clearHistoryBtn.textContent = '🧹 limpiar';
      clearHistoryBtn.title = 'Borrar todo el historial';
      clearHistoryBtn.style.cssText = `
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.07);
        color: var(--text-muted, #aaa);
        border-radius: 8px;
        padding: 5px 10px;
        font-size: .78rem;
        line-height: 1.2;
        cursor: pointer;
      `;
      clearHistoryBtn.onclick = () => clearHistory();

      clearHistoryWrap.appendChild(clearHistoryBtn);
      container.appendChild(clearHistoryWrap);
    }
  }
}


/* =========================================================
   BÚSQUEDA
   - sin tildes / con tildes
   - ñ / n
   - errores B/V y C/S/Z
   - letras intercambiadas
   - coincidencias parciales
   - tolerancia a errores de escritura
   ========================================================= */

/* =========================================================
   BÚSQUEDA
   - sin tildes / con tildes
   - ñ / n
   - errores B/V y C/S/Z
   - letras intercambiadas
   - coincidencias parciales
   - tolerancia a errores de escritura
   - optimizada con caché de consultas y metadatos
   ========================================================= */

function normalizeSearchText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function normalizeSearchCompact(value) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]/g, '');
}

function getSearchVariants(value) {
  const base = normalizeSearchCompact(value);
  if (!base) return [];

  const variants = new Set([base]);

  const replaceChars = (from, replacement) => {
    let variant = base;
    for (const char of from) {
      variant = variant.split(char).join(replacement);
    }
    variants.add(variant);
  };

  // B/V
  replaceChars(['v'], 'b');
  replaceChars(['b'], 'v');

  // C/S/Z
  replaceChars(['c', 'z'], 's');
  replaceChars(['s', 'z'], 'c');
  replaceChars(['c', 's'], 'z');

  // C/K/Q
  replaceChars(['c', 'q'], 'k');
  replaceChars(['k', 'q'], 'c');

  return [...variants];
}

function getSearchQueryData(query) {
  const normalized = normalizeSearchText(query);
  const compact = normalizeSearchCompact(query);

  if (!compact) {
    return {
      normalized,
      compact,
      variants: []
    };
  }

  const cached = SEARCH_QUERY_CACHE.get(compact);

  if (cached) {
    return cached;
  }

  const data = {
    normalized,
    compact,
    variants: getSearchVariants(compact)
  };

  if (SEARCH_QUERY_CACHE.size >= SEARCH_QUERY_CACHE_MAX) {
    const firstKey = SEARCH_QUERY_CACHE.keys().next().value;
    if (firstKey) SEARCH_QUERY_CACHE.delete(firstKey);
  }

  SEARCH_QUERY_CACHE.set(compact, data);
  return data;
}

function buildSearchTextData(value) {
  const text = normalizeSearchText(value);
  const compact = normalizeSearchCompact(value);

  return {
    text,
    compact,
    variants: getSearchVariants(compact)
  };
}

function buildSearchMeta(item, groupTitle = '') {
  if (!item || typeof item !== 'object') return null;

  const cached = SEARCH_META_CACHE.get(item);

  if (cached && cached.groupTitle === groupTitle) {
    return cached;
  }

  const meta = {
    item,
    groupTitle,
    title: buildSearchTextData(item.titulo),
    year: buildSearchTextData(item.ano),
    director: buildSearchTextData(item.director),
    saga: buildSearchTextData(
      item.saga ||
      item.genero ||
      item.categoria ||
      groupTitle
    ),
    temporadas: []
  };

  const temporadas = Array.isArray(item.temporadas)
    ? item.temporadas
    : [];

  for (const temp of temporadas) {
    const temporadaTitulo = buildSearchTextData(temp.titulo);
    const temporadaNumero = buildSearchTextData(temp.numeroTemporada);

    const episodios = [];

    for (const ep of (Array.isArray(temp.episodios) ? temp.episodios : [])) {
      episodios.push({
        title: buildSearchTextData(ep.titulo),
        number: buildSearchTextData(ep.numeroEpisodio)
      });
    }

    meta.temporadas.push({
      title: temporadaTitulo,
      number: temporadaNumero,
      episodes: episodios
    });
  }

  SEARCH_META_CACHE.set(item, meta);
  return meta;
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  let prev = Array.from(
    { length: b.length + 1 },
    (_, i) => i
  );

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

function damerauDistance(a, b) {
  if (a === b) return 0;

  const matrix = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );

      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        matrix[i][j] = Math.min(
          matrix[i][j],
          matrix[i - 2][j - 2] + 1
        );
      }
    }
  }

  return matrix[a.length][b.length];
}

function getMaxSearchDistance(queryLength) {
  return queryLength <= 3
    ? 1
    : queryLength <= 6
      ? 2
      : 3;
}

/*
  Compara texto ya normalizado.
  El gran ahorro aquí es que las variantes del catálogo se calculan
  una sola vez por elemento y no en cada pulsación/búsqueda.
*/
function fuzzyTextMatch(textData, queryData) {
  if (!textData?.variants?.length || !queryData?.variants?.length) {
    return 0;
  }

  const queryLength = queryData.compact.length;
  const maxDistance = getMaxSearchDistance(queryLength);

  let best = Infinity;

  for (const textVariant of textData.variants) {
    for (const queryVariant of queryData.variants) {
      if (textVariant === queryVariant) {
        return 1000;
      }

      if (
        textVariant.startsWith(queryVariant) ||
        textVariant.includes(queryVariant)
      ) {
        return 900;
      }

      /*
        Para palabras completas priorizamos la comparación directa.
        Esto es bastante más barato que comparar cada ventana del título.
      */
      const words = textVariant.split(/\s+/).filter(Boolean);

      for (const word of words) {
        if (
          Math.abs(word.length - queryVariant.length) <= maxDistance
        ) {
          const distance = damerauDistance(word, queryVariant);

          if (distance < best) {
            best = distance;
          }

          if (best === 0) return 900;
        }
      }

      /*
        Solo hacemos comparación por ventanas cuando realmente puede
        existir una coincidencia aproximada dentro del título.
      */
      if (
        queryVariant.length >= 4 &&
        textVariant.length >= queryVariant.length
      ) {
        for (
          let i = 0;
          i <= textVariant.length - queryVariant.length;
          i++
        ) {
          const fragment = textVariant.slice(
            i,
            i + queryVariant.length
          );

          const distance = damerauDistance(
            fragment,
            queryVariant
          );

          if (distance < best) {
            best = distance;
          }

          if (best === 0) return 900;
          if (best <= 1 && queryVariant.length >= 6) break;
        }
      }
    }
  }

  if (best <= maxDistance) {
    return Math.max(120, 500 - best * 100);
  }

  return 0;
}

function fuzzyTitleMatch(title, query) {
  return fuzzyTextMatch(
    buildSearchTextData(title),
    getSearchQueryData(query)
  );
}

function fuzzySearchFieldMatch(text, query) {
  return fuzzyTextMatch(
    buildSearchTextData(text),
    getSearchQueryData(query)
  );
}

function getSearchScore(item, query, groupTitle = '') {
  const queryData =
    typeof query === 'object'
      ? query
      : getSearchQueryData(query);

  if (!queryData.compact || !item) return 0;

  const meta = buildSearchMeta(item, groupTitle);
  if (!meta) return 0;

  const q = queryData.normalized;
  const qCompact = queryData.compact;

  let score = 0;

  const titulo = meta.title;
  const director = meta.director;
  const saga = meta.saga;

  const titleFuzzy = fuzzyTextMatch(titulo, queryData);

  score = Math.max(score, titleFuzzy);

  if (titulo.compact === qCompact) {
    score = Math.max(score, 1000);
  } else if (titulo.compact.startsWith(qCompact)) {
    score = Math.max(score, 800);
  } else if (titulo.compact.includes(qCompact)) {
    score = Math.max(score, 600);
  }

  if (
    meta.year.text &&
    meta.year.text.includes(q)
  ) {
    score = Math.max(score, 500);
  }

  if (director.compact === qCompact) {
    score = Math.max(score, 450);
  } else if (director.compact.includes(qCompact)) {
    score = Math.max(score, 400);
  } else {
    score = Math.max(
      score,
      fuzzyTextMatch(director, queryData) * 0.85
    );
  }

  if (saga.compact === qCompact) {
    score = Math.max(score, 350);
  } else if (saga.compact.includes(qCompact)) {
    score = Math.max(score, 300);
  } else {
    score = Math.max(
      score,
      fuzzyTextMatch(saga, queryData) * 0.75
    );
  }

  for (const temp of meta.temporadas) {
    if (
      temp.number.text === q ||
      temp.number.compact === qCompact
    ) {
      score = Math.max(score, 280);
    } else if (
      temp.title.text.includes(q) ||
      temp.title.compact.includes(qCompact)
    ) {
      score = Math.max(score, 260);
    } else {
      score = Math.max(
        score,
        fuzzyTextMatch(temp.title, queryData) * 0.65
      );
    }

    for (const ep of temp.episodes) {
      if (ep.title.text === q) {
        score = Math.max(score, 250);
      } else if (
        ep.title.text.includes(q) ||
        ep.number.text === q ||
        ep.number.compact === qCompact
      ) {
        score = Math.max(score, 230);
      } else {
        score = Math.max(
          score,
          fuzzyTextMatch(ep.title, queryData) * 0.60
        );
      }
    }
  }

  return score;
}

function addSearchResult(results, item, sectionKey, groupTitle = '') {
  if (!item) return;

  const score = getSearchScore(
    item,
    results.queryData,
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
  const queryData = getSearchQueryData(query);

  if (!queryData.compact) {
    showInitialScreen();
    return;
  }

  const results = {
    query: queryData.normalized,
    queryData,
    items: []
  };

  /*
    El buscador mantiene su propia fuente de datos.
    Esto evita que liberarCatalogosInactivos() borre categorías
    que todavía deben participar en una búsqueda global.
  */
  const catalogos = {
    ...GLOBAL_SEARCH_CATALOG,
    favoritos: getFavorites()
  };

  const sectionKeys = [
    'peliculas',
    'sagas',
    'series',
    'anime',
    'videos',
    'favoritos'
  ];

  for (const sectionKey of sectionKeys) {
    const items = catalogos[sectionKey] || [];

    if (!items.length) continue;

    const esEstructuraGrupos = items.some(
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
            .includes(queryData.normalized);

        for (const peli of (
          Array.isArray(grupo.peliculas)
            ? grupo.peliculas
            : []
        )) {
          const score = getSearchScore(
            peli,
            queryData,
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
    queryData.normalized
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
        <strong>"${escapeHtml(query)}"</strong>.
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
    `🔎 Resultados para <strong>"${escapeHtml(query)}"</strong>
     <span style="color:var(--text-muted);font-size:.9rem;">
       (${results.length})
     </span>`;

  container.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'grid-container';

  const seen = new Set();
  const fragment = document.createDocumentFragment();

  for (const result of results) {
    const item = result.item;
    const key =
      result.sectionKey + '::' + String(getItemId(item) || '');

    if (seen.has(key)) continue;
    seen.add(key);

    fragment.appendChild(
      createCardElement(item)
    );
  }

  grid.appendChild(fragment);
  container.appendChild(grid);
}

let searchRequestId = 0;
let searchDebounceTimer = null;

async function prepararBusquedaGlobal() {
  /*
    El buscador conserva sus propios catálogos para no depender
    de LOCAL_CATALOG, que puede liberar secciones para ahorrar memoria.
    TV Live sigue fuera por ser la fuente más pesada.
  */
  const secciones = [
    'peliculas',
    'sagas',
    'series',
    'anime',
    'videos'
  ];

  const pendientes = secciones.filter(
    sectionKey =>
      !Array.isArray(GLOBAL_SEARCH_CATALOG[sectionKey])
  );

  if (!pendientes.length) return;

  await Promise.allSettled(
    pendientes.map(async sectionKey => {
      const data = await cargarSeccionRemota(
        sectionKey,
        false,
        false
      );

      if (Array.isArray(data)) {
        GLOBAL_SEARCH_CATALOG[sectionKey] = data;
      }
    })
  );
}

async function ejecutarBusqueda(query, requestId) {
  if (requestId !== searchRequestId) return;

  const normalized = normalizeSearchText(query);

  if (!normalized) {
    if (currentSectionKey === 'inicio') {
      showInitialScreen();
    } else {
      renderCatalog(
        LOCAL_CATALOG[currentSectionKey] || []
      );
    }
    return;
  }

  await prepararBusquedaGlobal();

  if (requestId !== searchRequestId) return;

  filterGlobalCatalog(query);
}

function filterCatalog() {
  const search = $('searchInput');
  const query = search?.value || '';

  searchRequestId++;
  const requestId = searchRequestId;

  clearTimeout(searchDebounceTimer);

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
      `🎥 ${escapeHtml(peli.director)}`;

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
    serie.portada ||
    serie.poster ||
    serie.miniatura ||
    '';

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
      `🎥 ${escapeHtml(serie.director)}`;

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
        📁 Temporada ${escapeHtml(temp.numeroTemporada)}

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
    temp.poster ||
    temp.miniatura ||
    currentSerieData?.portada ||
    currentSerieData?.poster ||
    currentSerieData?.miniatura ||
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
    `📅 T${escapeHtml(temp.numeroTemporada)} (${
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
        ${escapeHtml(ep.titulo)}

        <span style="
          font-size:.8rem;
          color:var(--text-muted);
          font-weight:normal;
          float:right;
        ">
          ${escapeHtml(ep.duracion || '')}
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
    ep.poster ||
    ep.miniatura ||
    temp.portada ||
    temp.poster ||
    temp.miniatura ||
    currentSerieData?.portada ||
    currentSerieData?.poster ||
    currentSerieData?.miniatura ||
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

  if (tieneModal && window.history.state?.modal === true) {
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
