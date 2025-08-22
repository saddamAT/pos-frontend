import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import type { DefaultUser } from 'next-auth'
import { UserBusinessesType } from '@/api/interface/businessInterface'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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
    selectedBusiness?: UserBusinessesType // Optional and nullable
  }

  interface Session {
    user: User
    accessToken: string
    userBusinesses?: UserBusinessesType[]
    selectedBusiness?: UserBusinessesType
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number
    email: string
    first_name: string
    last_name: string
    user_type: string
    city: string
    country: string
    mobile: string
    name: string
    address: string
    status: string
    accessToken: string
    postalCode: string
    deleted: boolean
    isLoggedIn: boolean
    userBusinesses?: UserBusinessesType[]
    selectedBusiness?: UserBusinessesType // Optional and nullable
  }
}

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

        try {
          const response = await axios.post(`${API_URL}/account/login/`, {
            email: credentials.email,
            password: credentials.password
          })

          const { user, token } = response.data

          const userBusinesssRes = await fetch(`${API_URL}/whatseat/business/user/${user?.id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`
            }
          })

          const userBusinesssData = await userBusinesssRes.json()

          // console.log(userBusinesssData, 'userBusinesssData')

          if (user && user.id && user.email) {
            return {
              id: user.id,
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
              token: token,
              mobile: user.mobile,
              name: user.name,
              address: user.address,
              userBusinesses: userBusinesssData ?? []
            }
          }

          return null
        } catch (error: any) {
          console.error('Login failed:', error?.response?.data || error.message)
          return null
        }
      }
    })
  ],

  pages: {
    signIn: 'en/login'
  },

  session: {
    strategy: 'jwt'
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // token.id = user.id
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
        token.selectedBusiness = user.userBusinesses?.[0] // ✅ Use `undefined` if no businesses
      }
      // console.log(token.userBusinesses, 'token.userBusinesses------')

      if (trigger === 'update') {
        if (session?.selectedBusiness) {
          // console.log(session?.selectedBusiness, 'selectedBusiness------->')
          token.selectedBusiness = session.selectedBusiness
        }
        if (session?.userBusinesses) {
          token.userBusinesses = session.userBusinesses
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id!
        session.user.email = token.email
        session.user.first_name = token.first_name
        session.user.last_name = token.last_name
        session.user.user_type = token.user_type
        session.user.mobile = token.mobile
        session.user.name = token.name
        session.user.address = token.address
        session.user.city = token.city
        session.user.country = token.country
        session.user.status = token.status
        session.user.postalCode = token.postalCode
        session.user.deleted = token.deleted
        session.accessToken = token.accessToken
        session.user.isLoggedIn = token.isLoggedIn
        session.user.userBusinesses = token.userBusinesses
        session.user.selectedBusiness = token.selectedBusiness
      }

      return session
    }
  }
}

export default NextAuth(authOptions)
