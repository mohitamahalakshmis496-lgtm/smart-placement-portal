export function toFriendlyMessage(error, fallback = 'Something went wrong.') {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.response?.data?.error) {
    return error.response.data.error
  }

  if (error?.message) {
    return error.message
  }

  return fallback
}