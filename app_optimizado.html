'use strict';

/* =========================================================
   JEISSONXP - APP.JS
   JavaScript principal del catálogo
   ========================================================= */

/* ---------- CONFIGURACIÓN ---------- */

const REPOSITORIOS_URLS = {
  sagas: "https://jeissonxp182.github.io/player/sagas.json",
  peliculas: "https://jeissonxp182.github.io/player/peliculas.json",
  series: "https://jeissonxp182.github.io/player/series.json",
  anime: "https://jeissonxp182.github.io/player/anime.json",
  videos: "https://jeissonxp182.github.io/player/videos.json",
  tv: "https://iptv-org.github.io/iptv/index.m3u"
};

/* ---------- ESTADO ---------- */

let LOCAL_CATALOG = {
  sagas: [],
  peliculas: [],
  series: [],
  anime: [],
  videos: [],
  tv: [],
  favoritos: []
};

let currentSectionKey = 'sagas';
let targetHtmlUrl = '';
let currentSerieData = null;
let currentSeasonData = null;


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
  try {
    return JSON.parse(localStorage.getItem('jxp_favorites')) || [];
  } catch {
    return [];
  }
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

  localStorage.setItem(
    'jxp_favorites',
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
   CARGA DE SECCIONES
   ========================================================= */

async function cargarSeccionRemota(sectionKey) {
  const container = $('catalogContainer');

  if (sectionKey === 'favoritos') {
    const favoritos = getFavorites();

    LOCAL_CATALOG.favoritos = favoritos;

    renderCatalog(favoritos);
    updateSocialMeta(favoritos);

    return favoritos;
  }

  if (
    LOCAL_CATALOG[sectionKey] &&
    LOCAL_CATALOG[sectionKey].length
  ) {
    renderCatalog(LOCAL_CATALOG[sectionKey]);
    updateSocialMeta(LOCAL_CATALOG[sectionKey]);

    return LOCAL_CATALOG[sectionKey];
  }

  container.innerHTML = `
    <p style="
      text-align:center;
      color:var(--text-muted);
      margin-top:50px;
      font-size:1.1rem;
    ">
      Cargando contenido...
    </p>
  `;

  try {
    const respuesta = await fetch(
      REPOSITORIOS_URLS[sectionKey]
    );

    if (!respuesta.ok) {
      throw new Error(
        'No se pudo conectar con el repositorio'
      );
    }

    let data;

    if (sectionKey === 'tv') {
      const textoM3U = await respuesta.text();
      data = parsearM3U(textoM3U);
    } else {
      data = await respuesta.json();
    }

    LOCAL_CATALOG[sectionKey] = data;

    renderCatalog(data);
    updateSocialMeta(data);

    return data;

  } catch (error) {
    console.error(
      'Error al cargar la sección:',
      error
    );

    container.innerHTML = `
      <p style="
        text-align:center;
        color:var(--text-muted);
        margin-top:50px;
        font-size:1.1rem;
      ">
        Próximamente más contenido en esta sección 🚀
      </p>
    `;

    return null;
  }
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

function loadSection(sectionKey) {
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

  loadSection(sectionKey);
}


/* =========================================================
   INICIO Y ENLACES DIRECTOS
   ========================================================= */

window.addEventListener(
  'DOMContentLoaded',
  async () => {

    const urlParams =
      new URLSearchParams(
        window.location.search
      );

    const targetId =
      urlParams.get('peli') ||
      urlParams.get('episodio') ||
      urlParams.get('id');

    if (!targetId) {
      loadSection('sagas');
      return;
    }

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

      loadSection('sagas');
    }
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

    if (currentSectionKey === 'favoritos') {

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
          Próximamente más contenido en esta sección 🚀
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
    favoritos: '⭐'
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

function getSearchScore(item, query, groupTitle = '') {
  const q = normalizeSearchText(query);
  if (!q || !item) return 0;

  let score = 0;

  const titulo = normalizeSearchText(item.titulo);
  const ano = normalizeSearchText(item.ano);
  const director = normalizeSearchText(item.director);
  const saga = normalizeSearchText(
    item.saga ||
    item.genero ||
    item.categoria ||
    groupTitle
  );

  // Título: máxima prioridad.
  if (titulo === q) {
    score = Math.max(score, 1000);
  } else if (titulo.startsWith(q)) {
    score = Math.max(score, 800);
  } else if (titulo.includes(q)) {
    score = Math.max(score, 600);
  }

  // Año.
  if (ano && ano.includes(q)) {
    score = Math.max(score, 500);
  }

  // Director.
  if (director === q) {
    score = Math.max(score, 450);
  } else if (director.includes(q)) {
    score = Math.max(score, 400);
  }

  // Saga / género / categoría.
  if (saga === q) {
    score = Math.max(score, 350);
  } else if (saga.includes(q)) {
    score = Math.max(score, 300);
  }

  // Temporadas y episodios.
  const temporadas = Array.isArray(item.temporadas)
    ? item.temporadas
    : [];

  for (const temp of temporadas) {
    const numeroTemporada = normalizeSearchText(
      temp.numeroTemporada
    );

    const tituloTemporada = normalizeSearchText(
      temp.titulo
    );

    const temporadaText = normalizeSearchText(
      `temporada ${temp.numeroTemporada ?? ''} ${temp.titulo ?? ''}`
    );

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
      const epNumber = normalizeSearchText(
        ep.numeroEpisodio
      );

      const episodeText = normalizeSearchText(
        `episodio ${ep.numeroEpisodio ?? ''} ${ep.titulo ?? ''}`
      );

      if (epTitle === q) {
        score = Math.max(score, 250);
      } else if (
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

function filterCatalog() {
  const query =
    $('searchInput')?.value || '';

  const normalizedQuery =
    normalizeSearchText(query);

  const items =
    LOCAL_CATALOG[currentSectionKey] || [];

  if (!normalizedQuery) {
    renderCatalog(items);
    return;
  }

  const esEstructuraGrupos =
    items.some(
      item =>
        item?.peliculas &&
        Array.isArray(item.peliculas)
    );

  /* ---------- GRUPOS ---------- */

  if (esEstructuraGrupos) {
    const filtered =
      items
        .map(grupo => {
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

          const peliculas =
            (Array.isArray(grupo.peliculas)
              ? grupo.peliculas
              : []
            )
              .map(peli => ({
                item: peli,
                score: getSearchScore(
                  peli,
                  normalizedQuery,
                  groupTitle
                )
              }))
              .filter(result =>
                result.score > 0 || groupMatches
              )
              .sort((a, b) =>
                b.score - a.score ||
                String(a.item.titulo || '')
                  .localeCompare(
                    String(b.item.titulo || ''),
                    'es',
                    { sensitivity: 'base' }
                  )
              )
              .map(result => result.item);

          return {
            ...grupo,
            peliculas
          };
        })
        .filter(
          grupo =>
            grupo.peliculas.length > 0
        );

    renderCatalog(filtered);
    return;
  }

  /* ---------- LISTA NORMAL ---------- */

  const filtered =
    items
      .map(item => ({
        item,
        score: getSearchScore(
          item,
          normalizedQuery
        )
      }))
      .filter(result =>
        result.score > 0
      )
      .sort((a, b) =>
        b.score - a.score ||
        String(a.item.titulo || '')
          .localeCompare(
            String(b.item.titulo || ''),
            'es',
            { sensitivity: 'base' }
          )
      )
      .map(result => result.item);

  renderCatalog(filtered);
}


/* =========================================================
   MODAL DE PELÍCULA / VIDEO
   ========================================================= */

function openModal(peli) {
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

    history.replaceState(
      null,
      '',
      `?id=${encodeURIComponent(peli.id)}`
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
    history.replaceState(
      null,
      '',
      `?id=${encodeURIComponent(serie.id)}`
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
    history.replaceState(
      null,
      '',
      `?episodio=${encodeURIComponent(epId)}`
    );
  }


  playEpBtn.onclick = () => {

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
  $('movieModal').style.display =
    'none';

  const tempContainer =
    $('modalTemporadasContainer');

  if (tempContainer) {
    tempContainer.style.display =
      'block';
  }

  currentSerieData = null;
  currentSeasonData = null;

  history.replaceState(
    null,
    '',
    window.location.pathname
  );
}
