import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, code } = req.body

      // Fetch data from the backend
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      })

      if (!apiRes.ok) {
        const errorText = await apiRes.text()

        throw new Error(errorText)
      }

      const data = await apiRes.json()

      // Set user data in localStorage
      res.status(200).json({
        success: true,
        token: data.token,
        user: data.user // Assuming the API returns user data as `user`
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
