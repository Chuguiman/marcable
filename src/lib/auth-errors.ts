const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos",
  "invalid_credentials": "Correo o contraseña incorrectos",
  "Email not confirmed": "Debes verificar tu email antes de iniciar sesión",
  "User already registered": "Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?",
  "over_email_send_rate_limit": "Demasiados intentos. Espera unos minutos.",
  "over_request_rate_limit": "Demasiados intentos. Espera unos minutos.",
};

export function getAuthErrorMessage(error: { message?: string; code?: string }): string {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  if (error.message && ERROR_MESSAGES[error.message]) {
    return ERROR_MESSAGES[error.message];
  }
  return "Algo salió mal. Intenta de nuevo.";
}
