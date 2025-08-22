import { authOptions } from '@/libs/auth'
import NextAuth from 'next-auth'

/*
 * As we do not have backend server, the refresh token feature has not been incorporated into the template.
 * Please refer https://next-auth.js.org/tutorials/refresh-token-rotation link for a reference.
 */

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
