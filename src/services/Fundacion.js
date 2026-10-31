export async function getFundacion(props, { apiUrl, token }) {
  const { q, page, limit = 20 } = props;
  const url = new URL('/fundacion', apiUrl);
  if (q) {
    url.searchParams.append('q', q);
  }
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

export async function updateFundacion(payload, { apiUrl, token }) {
  const url = new URL('/fundacion/update', apiUrl);
  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        'authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

export async function deleteFundacionService(fundacionId, { apiUrl, token }) {
  const url = new URL('/fundacion/delete', apiUrl);
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fundacionId }),
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
