import { User } from 'firebase/auth';

export async function getAuthHeaders(user: User | null, isSandboxMode: boolean): Promise<Record<string, string>> {
  if (!user) return {};
  if (isSandboxMode) {
    return {
      'Authorization': 'Bearer sandbox-token-123',
    };
  }
  try {
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
    };
  } catch (e) {
    console.error('Failed to get auth token:', e);
    return {};
  }
}
