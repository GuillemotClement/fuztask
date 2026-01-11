import { Context, Next } from 'hono'
import { auth } from '../libs/better_auth/auth'

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    })

    if (!session?.user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Ajouter l'utilisateur au contexte
    c.set('user', session.user)
    c.set('userId', session.user.id)
    
    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

// récupère l'id de l'user depuis le context
export const getUserId = (c: Context): string => {
  const userId = c.get('userId')
  if (!userId) {
    throw new Error('User not authenticated')
  }
  return userId
}
