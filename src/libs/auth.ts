// import NextAuth, { type NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import axios from 'axios'
// import type { DefaultUser } from 'next-auth'
// import { UserBusinessesType } from '@/api/interface/businessInterface'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// declare module 'next-auth' {
//   interface User extends DefaultUser {
//     id: number
//     email: string
//     first_name: string
//     last_name: string
//     user_type: string
//     city: string
//     country: string
//     status: string
//     token: string
//     postalCode: string
//     mobile: string
//     name: string
//     address: string
//     deleted: boolean
//     isLoggedIn: boolean
//     userBusinesses?: UserBusinessesType[]
//     selectedBusiness?: UserBusinessesType // Optional and nullable
//   }

//   interface Session {
//     user: User
//     accessToken: string
//     userBusinesses?: UserBusinessesType[]
//     selectedBusiness?: UserBusinessesType
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id?: number
//     email: string
//     first_name: string
//     last_name: string
//     user_type: string
//     city: string
//     country: string
//     mobile: string
//     name: string
//     address: string
//     status: string
//     accessToken: string
//     postalCode: string
//     deleted: boolean
//     isLoggedIn: boolean
//     userBusinesses?: UserBusinessesType[]
//     selectedBusiness?: UserBusinessesType // Optional and nullable
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null

//         try {
//           const response = await axios.post(`${API_URL}/account/login/`, {
//             email: credentials.email,
//             password: credentials.password
//           })

//           const { user, token } = response.data

//           const userBusinesssRes = await fetch(`${API_URL}/whatseat/business/user/${user?.id}/`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Token ${token}`
//             }
//           })

//           const userBusinesssData = await userBusinesssRes.json()

//           if (user && user.id && user.email) {
//             return {
//               id: user.id,
//               first_name: user.first_name,
//               last_name: user.last_name,
//               email: user.email,
//               user_type: user.user_type,
//               city: user.city,
//               country: user.country,
//               status: user.status,
//               postalCode: user.postalCode,
//               deleted: user.deleted,
//               isLoggedIn: user.isLoggedIn,
//               token: token,
//               mobile: user.mobile,
//               name: user.name,
//               address: user.address,
//               userBusinesses: userBusinesssData ?? []
//             }
//           }

//           return null
//         } catch (error: any) {
//           console.error('Login failed:', error?.response?.data || error.message)
//           return null
//         }
//       }
//     })
//   ],

//   pages: {
//     signIn: 'en/login'
//   },

//   session: {
//     strategy: 'jwt'
//   },

//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async jwt({ token, user, trigger, session }) {
//       if (user) {
//         // token.id = user.id
//         token.id = Number(user.id)
//         token.name = user.name
//         token.email = user.email
//         token.first_name = user.first_name
//         token.last_name = user.last_name
//         token.user_type = user.user_type
//         token.city = user.city
//         token.country = user.country
//         token.status = user.status
//         token.mobile = user.mobile
//         token.address = user.address
//         token.postalCode = user.postalCode
//         token.deleted = user.deleted
//         token.accessToken = user.token
//         token.isLoggedIn = user.isLoggedIn
//         token.userBusinesses = user.userBusinesses
//         token.selectedBusiness = user.userBusinesses?.[0] // ✅ Use `undefined` if no businesses
//       }
//       // console.log(token.userBusinesses, 'token.userBusinesses------')

//       if (trigger === 'update') {
//         if (session?.selectedBusiness) {
//           // console.log(session?.selectedBusiness, 'selectedBusiness------->')
//           token.selectedBusiness = session.selectedBusiness
//         }
//         if (session?.userBusinesses) {
//           token.userBusinesses = session.userBusinesses
//         }
//       }

//       return token
//     },

//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id!
//         session.user.email = token.email
//         session.user.first_name = token.first_name
//         session.user.last_name = token.last_name
//         session.user.user_type = token.user_type
//         session.user.mobile = token.mobile
//         session.user.name = token.name
//         session.user.address = token.address
//         session.user.city = token.city
//         session.user.country = token.country
//         session.user.status = token.status
//         session.user.postalCode = token.postalCode
//         session.user.deleted = token.deleted
//         session.accessToken = token.accessToken
//         session.user.isLoggedIn = token.isLoggedIn
//         session.user.userBusinesses = token.userBusinesses
//         session.user.selectedBusiness = token.selectedBusiness
//       }

//       return session
//     }
//   }
// }

// export default NextAuth(authOptions)

import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

/* =========================
   Minimal local types
   (Adjust to match your API models if needed)
   ========================= */
export type Outlet = {
  id: number
  name?: string
  business: number
  active?: boolean
  [key: string]: any
}

export type UserBusinessesType = {
  id: number
  name?: string
  // Your API may expose one of these arrays; we’ll probe safely.
  outlets?: Outlet[]
  branches?: Outlet[]
  user_outlets?: Outlet[]
  user_business?: Outlet[]
  [key: string]: any
}

/* =========================
   Env + API URL
   ========================= */
const API_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

/* =========================
   next-auth module augmentation
   ========================= */
import type { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: number
    email: string
    first_name: string
    last_name: string
    user_type: string
    city: string
    country: string
    status: string
    token: string
    postalCode: string
    mobile: string
    name: string
    address: string
    deleted: boolean
    isLoggedIn: boolean
    userBusinesses?: UserBusinessesType[]
    selectedBusiness?: UserBusinessesType | null
    selectedOutlet?: Outlet | null
  }

  interface Session {
    user: User
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number
    email?: string
    first_name?: string
    last_name?: string
    user_type?: string
    city?: string
    country?: string
    mobile?: string
    name?: string
    address?: string
    status?: string
    accessToken?: string
    postalCode?: string
    deleted?: boolean
    isLoggedIn?: boolean
    userBusinesses?: UserBusinessesType[]
    selectedBusiness?: UserBusinessesType | null
    selectedOutlet?: Outlet | null
  }
}

/* =========================
   Helpers: pick default selection
   ========================= */
function extractOutlets(business: UserBusinessesType | undefined | null): Outlet[] {
  if (!business) return []
  if (Array.isArray(business.outlets)) return business.outlets
  if (Array.isArray((business as any).branches)) return (business as any).branches
  if (Array.isArray((business as any).user_outlets)) return (business as any).user_outlets
  if (Array.isArray((business as any).user_business)) return (business as any).user_business
  return []
}

/**
 * From the list of userBusinesses:
 *  - pick the FIRST business that actually has at least one outlet
 *  - pick that business's FIRST outlet
 */
function pickDefaultSelection(userBusinesses?: UserBusinessesType[]) {
  if (!Array.isArray(userBusinesses) || userBusinesses.length === 0) {
    return { selectedBusiness: null as UserBusinessesType | null, selectedOutlet: null as Outlet | null }
  }

  const firstWithOutlets = userBusinesses.find(b => extractOutlets(b).length > 0) ?? null

  if (!firstWithOutlets) {
    // No outlets anywhere; keep first business as default, outlet = null
    return {
      selectedBusiness: userBusinesses[0] ?? null,
      selectedOutlet: null
    }
  }

  const outlets = extractOutlets(firstWithOutlets)
  return {
    selectedBusiness: firstWithOutlets,
    selectedOutlet: outlets[0] ?? null
  }
}

/* =========================
   NextAuth config
   ========================= */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 1) Login
        const loginRes = await fetch(`${API_URL}/account/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        })

        if (!loginRes.ok) {
          const detail = await loginRes.text().catch(() => '')
          throw new Error(detail || 'Invalid email or password')
        }

        const { user, token } = await loginRes.json()
        // console.log(user,'loggedIn User');

        if (!user?.id || !user?.email) return null

        // 2) Fetch user businesses
        let userBusinesses: UserBusinessesType[] = []
        try {
          const ubRes = await fetch(`${API_URL}/whatseat/business/user/${user.id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`
            }
          })
          if (ubRes.ok) {
            userBusinesses = await ubRes.json()
          }
        } catch {
          // keep as []
        }

        // 3) Default = first outlet of the first business with outlets
        const { selectedBusiness, selectedOutlet } = pickDefaultSelection(userBusinesses)

        return {
          id: Number(user.id),
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_type: user.user_type,
          city: user.city,
          country: user.country,
          status: user.status,
          postalCode: user.postalCode,
          deleted: user.deleted,
          isLoggedIn: user.isLoggedIn,
          token,
          mobile: user.mobile,
          name: user.name,
          address: user.address,

          userBusinesses,
          selectedBusiness: selectedBusiness ?? null,
          selectedOutlet: selectedOutlet ?? null
        }
      }
    })
  ],

  pages: {
    signIn: '/en/login'
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: copy user -> token
      if (user) {
        token.id = Number(user.id)
        token.name = user.name
        token.email = user.email
        token.first_name = user.first_name
        token.last_name = user.last_name
        token.user_type = user.user_type
        token.city = user.city
        token.country = user.country
        token.status = user.status
        token.mobile = user.mobile
        token.address = user.address
        token.postalCode = user.postalCode
        token.deleted = user.deleted
        token.accessToken = user.token
        token.isLoggedIn = user.isLoggedIn
        token.userBusinesses = user.userBusinesses
        token.selectedBusiness = user.selectedBusiness ?? null
        token.selectedOutlet = user.selectedOutlet ?? null
      }

      // Allow runtime updates: useSession().update({ selectedBusiness, selectedOutlet, userBusinesses })
      if (trigger === 'update' && session) {
        if ('selectedBusiness' in session) {
          token.selectedBusiness = (session as any).selectedBusiness ?? null

          // If business changed and outlet not explicitly provided, auto-pick its first outlet
          if (!('selectedOutlet' in session)) {
            const outlets = extractOutlets((session as any).selectedBusiness) ?? []
            token.selectedOutlet = outlets[0] ?? null
          }
        }

        if ('selectedOutlet' in session) {
          token.selectedOutlet = (session as any).selectedOutlet ?? null
        }

        if ('userBusinesses' in session) {
          token.userBusinesses = (session as any).userBusinesses ?? token.userBusinesses
        }
      }

      return token
    },

    async session({ session, token }) {
      if (!session.user) return session

      session.user.id = token.id ?? 0
      session.user.email = token.email ?? ''
      session.user.first_name = token.first_name ?? ''
      session.user.last_name = token.last_name ?? ''
      session.user.user_type = token.user_type ?? ''
      session.user.mobile = token.mobile ?? ''
      session.user.name = token.name ?? ''
      session.user.address = token.address ?? ''
      session.user.city = token.city ?? ''
      session.user.country = token.country ?? ''
      session.user.status = token.status ?? ''
      session.user.postalCode = token.postalCode ?? ''
      session.user.deleted = Boolean(token.deleted)
      session.user.isLoggedIn = Boolean(token.isLoggedIn)

      session.accessToken = token.accessToken ?? ''
      session.user.userBusinesses = token.userBusinesses ?? []

      // Expose both defaults to UI
      session.user.selectedBusiness = token.selectedBusiness ?? null
      session.user.selectedOutlet = token.selectedOutlet ?? null

      return session
    }
  }
}

/* =========================
   Route export (App Router)
   ========================= */
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// For Pages Router, instead use:
// export default NextAuth(authOptions)
