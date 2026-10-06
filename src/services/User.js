export async function login(props, { apiUrl }) {
  const { correo, contrasenia } = props;

  const url = new URL('/auth/login', apiUrl);

  console.log(url.toString());

  let response;

  try {
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
  }  catch (error) {
  throw new Error(
    'Please check your internet connection and try again',
    { cause: error }
  );
}

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Login failed');
  }
  
  const { result } = await response.json();

  return {
    ...result,
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