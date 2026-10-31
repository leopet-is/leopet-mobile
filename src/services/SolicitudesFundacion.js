export async function getSolicitudesFundacion(props, { apiUrl, token }) {
  const { q, page = 1, limit = 10, estado } = props;
  const url = new URL('/admin/solicitudes', apiUrl);
  if (q) url.searchParams.append('q', q);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);
  if (estado) url.searchParams.append('estado', estado);

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    throw new Error('Please check your internet connection and try again', { cause: error });
  }
  if (response.status >= 400 && response.status < 600) {
    const { error } = await response.json();
    throw error;
  }
  const { result, total, totalPages, page: currentPage, limit: currentLimit } = await response.json();
  return { solicitudes: result, totalRows: total, totalPages, page: currentPage, limit: currentLimit };
}

export async function getSolicitudFundacionById(solicitudId, { apiUrl, token }) {
  const url = new URL(`/admin/solicitudes/${solicitudId}`, apiUrl);
  let response;
  try {
    response = await fetch(url, { method: 'GET', headers: { authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } });
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

export async function approveSolicitudFundacion(solicitudId, { apiUrl, token }) {
  const url = new URL(`/admin/solicitudes/${solicitudId}/aprobar`, apiUrl);
  let response;
  try {
    response = await fetch(url, { method: 'PUT', headers: { authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } });
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

export async function rejectSolicitudFundacion(solicitudId, notas_admin, { apiUrl, token }) {
  const url = new URL(`/admin/solicitudes/${solicitudId}/rechazar`, apiUrl);
  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: { authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas_admin }),
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

export async function getSolicitudesReadyForCreation({ apiUrl, token }) {
  const url = new URL('/admin/solicitudes/ready-for-creation', apiUrl);
  let response;
  try {
    response = await fetch(url, { method: 'GET', headers: { authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } });
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
