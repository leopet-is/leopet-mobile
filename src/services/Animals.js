async function requestAnimals(url, token) {
  let response;
  try {
    response = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Please check your internet connection and try again', { cause: error });
  }

  const responseText = await response.text();
  let payload = {};
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error('The server returned an invalid animal response.');
      }
    }
  }

  if (!response.ok) {
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : `Unable to load animals (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return payload;
}

export async function getAnimals(props, { apiUrl, token }) {
  const { q, page = 0, limit = 20, selectedSpecie, manada } = props;
  const url = new URL('/animal', apiUrl);
  if (q) url.searchParams.append('q', q);
  if (selectedSpecie && selectedSpecie.toLowerCase() !== 'todos') {
    url.searchParams.append('especie', selectedSpecie.toUpperCase());
  }
  if (manada != null) url.searchParams.append('manada', String(manada));
  url.searchParams.append('page', String(page + 1));
  url.searchParams.append('limit', String(limit));

  const payload = await requestAnimals(url, token);
  if (!Array.isArray(payload?.result)) {
    throw new Error('The server response did not include the animal list.');
  }
  return payload.result;
}

export async function getAnimalsCatalog({ especie, fundacionId }, { apiUrl, token }) {
  const animals = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const path = fundacionId
      ? `/animal/app/fundacion/${encodeURIComponent(fundacionId)}`
      : '/animal/app';
    const url = new URL(path, apiUrl);
    if (!fundacionId && especie && especie !== 'TODOS') {
      url.searchParams.append('tipoAnimal', especie);
    }
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', String(limit));

    const payload = await requestAnimals(url, token);
    if (!Array.isArray(payload?.result)) {
      throw new Error('The server response did not include the animal list.');
    }

    animals.push(...payload.result);
    const responseTotalPages = Number(payload.totalPages);
    totalPages =
      Number.isFinite(responseTotalPages) && responseTotalPages > 0
        ? responseTotalPages
        : payload.result.length === limit
          ? page + 1
          : page;
    page += 1;
  }

  return animals;
}

export async function getAnimalsApp(props, { apiUrl, token }) {
  const { page, limit = 20 } = props;
  const url = new URL('/animal/app', apiUrl);
  url.searchParams.append('page', page + 1);
  url.searchParams.append('limit', limit);

  let response;
  try {
    response = await fetch(url, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
  } catch (error) {
    throw new Error('Please check your internet connection and try again', { cause: error });
  }

  if (response.status >= 400 && response.status < 600) {
    const { error } = await response.json();
    throw error;
  }
  const { result } = await response.json();
  return result;
}

export async function getAnimalsFundacionApp(props, { apiUrl, token }) {
  const { page, limit = 20, id_fundacion } = props;
  if (id_fundacion == null) {
    throw new Error('Se requiere el ID de la fundación para consultar sus animales.');
  }
  const url = new URL(`/animal/app/fundacion/${encodeURIComponent(id_fundacion)}`, apiUrl);
  url.searchParams.append('page', page + 1);
  url.searchParams.append('limit', limit);

  let response;
  try {
    response = await fetch(url, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
  } catch (error) {
    throw new Error('Please check your internet connection and try again', { cause: error });
  }

  if (response.status >= 400 && response.status < 600) {
    const { error } = await response.json();
    throw error;
  }
  const { result } = await response.json();
  return result;
}
