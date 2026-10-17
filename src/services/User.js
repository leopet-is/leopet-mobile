export async function login(props, { apiUrl }) {
  const { correo, contrasenia } = props;
  let response;

  try {
    const url = new URL('/auth/login', apiUrl);
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: correo,
        password: contrasenia,
      }),
    });
  } catch (error) {
    throw new Error('No pudimos conectarnos. Revisa tu conexión a internet e inténtalo de nuevo.', { cause: error });
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('El correo o la contraseña son incorrectos.');
  }
  if (response.status === 406) {
    throw new Error('No pudimos validar tus datos. Revisa el correo y la contraseña e inténtalo de nuevo.');
  }
  if (response.status === 400) {
    throw new Error('Revisa los datos ingresados e inténtalo de nuevo.');
  }
  if (response.status === 429) {
    throw new Error('Has intentado iniciar sesión varias veces. Espera un momento e inténtalo de nuevo.');
  }
  if (response.status >= 500) {
    throw new Error('El servicio no está disponible en este momento. Inténtalo más tarde.');
  }
  if (!response.ok) {
    throw new Error('No se pudo iniciar sesión. Inténtalo de nuevo.');
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error('Recibimos una respuesta inesperada. Inténtalo de nuevo.', { cause: error });
  }
  if (!payload?.result || typeof payload.result !== 'object') {
    throw new Error('No se pudo completar el inicio de sesión. Inténtalo de nuevo.');
  }

  return {
    ...payload.result,
    apiUrl,
  };
}

export async function register({ user, fundation }, { apiUrl, token }) {
  const url = new URL('/auth/register', apiUrl);

  if (fundation) {
    user.role = 2;
    user.fundacionId = fundation.id;
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url.toString(), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(user),
    });
  } catch (error) {
    throw new Error('Por favor revisa tu conexión a internet e intenta de nuevo', { cause: error });
  }

  if (!response.ok) {
    let errorData; 
    
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(`Error del servidor: ${response.status}`);
    }
    
    const error = new Error('Error de validación');
    error.backendData = errorData; 
    throw error;
  }

  const data = await response.json();
  
  return {
    ...data,
    apiUrl,
  };
}