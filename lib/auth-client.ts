export async function getAuthHeaders(user: any, isSandboxMode: boolean): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (isSandboxMode) {
    headers['Authorization'] = 'Bearer sandbox-token-123';
  } else if (user && typeof user.getIdToken === 'function') {
    try {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      console.error('Failed to retrieve Firebase ID Token:', e);
    }
  } else if (user && user.uid) {
    // Fallback for custom sandbox users that might not have getIdToken function
    headers['Authorization'] = 'Bearer sandbox-token-123';
  }
  return headers;
}
