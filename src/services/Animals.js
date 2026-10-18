export async function getAnimals(props, { apiUrl, token }) {
  const { q, page, limit = 20, selectedSpecie, manada } = props;
  const url = new URL('/animal/get/animals', apiUrl);
  if (q) {
    url.searchParams.append('q', q);
  }

  url.searchParams.append('page', page + 1);
  url.searchParams.append('limit', limit);
  let response;
  let payload = {};
  if (selectedSpecie && selectedSpecie.toLowerCase() !== 'todos' && !manada) {
    payload.especie = selectedSpecie.toUpperCase();
  }
  if (manada) {
    payload.manada = manada;
  }
  try {
    response = await fetch(url, {
      headers: {
        authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error('Please check your internet connection and try again');
  }

  if (response.status >= 400 && response.status < 600) {
    const { error } = await response.json();
    throw error;
  }
  const { result } = await response.json();
  return result;
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
    throw new Error('Please check your internet connection and try again');
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
    throw new Error('Please check your internet connection and try again');
  }

  if (response.status >= 400 && response.status < 600) {
    const { error } = await response.json();
    throw error;
  }
  const { result } = await response.json();
  return result;
}
