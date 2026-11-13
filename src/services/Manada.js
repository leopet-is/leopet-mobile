async function requestManada(url, { token, method = 'GET', body }) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    throw new Error('No pudimos conectarnos. Revisa tu conexión a internet e inténtalo de nuevo.', {
      cause: error,
    });
  }

  const responseText = await response.text();
  let payload = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      if (response.ok) payload = responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : 'No se pudo completar la operación con la manada.';
    const requestError = new Error(`${message} (HTTP ${response.status})`);
    requestError.status = response.status;
    throw requestError;
  }

  return payload;
}

export async function createManada(manada, { apiUrl, token }) {
  const nombre = manada.nombre.trim();
  const monto = String(manada.monto).trim();
  const options = { apiUrl, token };
  const existingManadas = await getAllManadas(options);
  const existingIds = new Set(
    existingManadas
      .map((item) => item.id ?? item.id_manada ?? item.manadaId)
      .filter((id) => id != null)
      .map(String),
  );
  const url = new URL('/manada', apiUrl);

  const recoverCreatedManada = async (requestError) => {
    let updatedManadas;
    try {
      updatedManadas = await getAllManadas(options);
    } catch (recoveryError) {
      throw new Error(
        `El servidor respondió con un error y no se pudo verificar si la manada se guardó. ${requestError.message} ${recoveryError.message}`,
        { cause: requestError },
      );
    }

    const createdManadas = updatedManadas.filter((item) => {
      const id = item.id ?? item.id_manada ?? item.manadaId;
      return id != null && !existingIds.has(String(id)) && item.nombre === nombre;
    });

    if (createdManadas.length === 0) {
      throw new Error(
        `El servidor no confirmó la creación de la manada. ${requestError.message}`,
        { cause: requestError },
      );
    }
    if (createdManadas.length > 1) {
      throw new Error(
        'Se encontraron varias manadas nuevas con ese nombre y no fue posible determinar cuál actualizar.',
        { cause: requestError },
      );
    }

    const createdManada = createdManadas[0];
    const createdManadaId =
      createdManada.id ?? createdManada.id_manada ?? createdManada.manadaId;
    try {
      await actualizarManada({ id: createdManadaId, nombre, monto }, options);
    } catch (updateError) {
      throw new Error(
        `La manada se creó, pero no se pudo guardar el monto. ${updateError.message}`,
        { cause: updateError },
      );
    }

    return { ...createdManada, nombre, monto };
  };

  let payload;
  try {
    payload = await requestManada(url, {
      token,
      method: 'POST',
      body: { nombre, monto },
    });
  } catch (requestError) {
    if (requestError.status && requestError.status < 500) {
      throw requestError;
    }
    return recoverCreatedManada(requestError);
  }

  const createdManada = payload?.manada;
  const createdManadaId =
    createdManada?.id ?? createdManada?.id_manada ?? createdManada?.manadaId;
  if (!createdManada || createdManadaId == null) {
    return recoverCreatedManada(
      new Error('La respuesta del servidor no incluyó la manada creada.'),
    );
  }

  if (String(createdManada.monto ?? '').trim() !== monto) {
    try {
      await actualizarManada({ id: createdManadaId, nombre, monto }, options);
    } catch (updateError) {
      throw new Error(
        `La manada se creó, pero no se pudo guardar el monto. ${updateError.message}`,
        { cause: updateError },
      );
    }
    return { ...createdManada, nombre, monto };
  }

  return createdManada;
}

export async function getManadas(props, { apiUrl, token }) {
  const { q, page = 0, limit = 20 } = props;
  const url = new URL('/manada', apiUrl);
  if (q) url.searchParams.append('q', q);
  url.searchParams.append('page', String(page + 1));
  url.searchParams.append('limit', String(limit));

  const payload = await requestManada(url, { token });
  if (!Array.isArray(payload?.result)) {
    throw new Error('La respuesta del servidor no incluyó la lista de manadas.');
  }
  return payload.result;
}

async function getAllManadas(options) {
  const manadas = [];
  const limit = 20;
  let page = 0;
  let result;

  do {
    result = await getManadas({ page, limit }, options);
    manadas.push(...result);
    page += 1;
  } while (result.length === limit);

  return manadas;
}

export async function apadrinar({ animalId, manadaId }, { apiUrl, token }) {
  if (manadaId == null) {
    throw new Error('El servidor no devolvió el identificador de la manada.');
  }

  const url = new URL(`/manada/${manadaId}/animals`, apiUrl);
  return requestManada(url, {
    token,
    method: 'POST',
    body: { animalId: [Number(animalId)] },
  });
}

export async function agregarAnimalesManada({ animalIds, manadaId }, { apiUrl, token }) {
  if (manadaId == null) {
    throw new Error('No se encontró el identificador de la manada.');
  }
  if (!Array.isArray(animalIds) || animalIds.length === 0) {
    throw new Error('Selecciona al menos un animal para agregar.');
  }

  const ids = animalIds.map(Number);
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error('La selección incluye un identificador de animal inválido.');
  }

  const url = new URL(`/manada/${manadaId}/animals`, apiUrl);
  return requestManada(url, {
    token,
    method: 'POST',
    body: { animalId: ids },
  });
}

export async function getAnimalesManada(manadaId, { apiUrl, token }) {
  if (manadaId == null) {
    throw new Error('No se encontró el identificador de la manada.');
  }

  const animals = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = new URL('/animal', apiUrl);
    url.searchParams.append('manada', String(manadaId));
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', String(limit));

    const payload = await requestManada(url, { token });
    if (!Array.isArray(payload?.result)) {
      throw new Error('La respuesta del servidor no incluyó los animales de la manada.');
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

export async function actualizarManada(manada, { apiUrl, token }) {
  const manadaId = manada.id ?? manada.id_manada ?? manada.manadaId;
  if (manadaId == null) {
    throw new Error('No se encontró el identificador de la manada a actualizar.');
  }

  const url = new URL(`/manada/${manadaId}`, apiUrl);
  return requestManada(url, {
    token,
    method: 'PUT',
    body: {
      nombre: manada.nombre.trim(),
      monto: String(manada.monto).trim(),
    },
  });
}

export async function deleteAnimalsManadaApp({ manadaId, animalId }, { apiUrl, token }) {
  const url = new URL(`/manada/${manadaId}/animals/${animalId}`, apiUrl);
  return requestManada(url, { token, method: 'DELETE' });
}

export async function deleteAllAnimalsManadaApp({ manadaId }, { apiUrl, token }) {
  const url = new URL(`/manada/${manadaId}`, apiUrl);
  return requestManada(url, { token, method: 'DELETE' });
}
