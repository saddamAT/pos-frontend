// Import necessary modules

import axios from 'axios'
// import cookie from 'cookie'

export default async (req: any, res: any) => {
  // console.log(req, 'dddddddddd')
  if (req.method === 'DELETE') {
    // console.log(req.method, req.body, 'req method')

    // Parse cookies to extract JWT access token
    // const cookies = cookie.parse(req.headers.cookie ?? '')
    // const access = cookies.access ?? false

    // const { auth_token, csrftoken } = cookies

    // Check if user is authorized
    // if (access === false) {
    //   return res.status(401).json({
    //     error: 'User is not authorized to make this request'
    //   })
    // }

    const id = req.body

    // console.log('id = ', id)

    try {
      // Extract the address ID from the request body

      // Set up the API request config
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
          // Authorization: `Token ${auth_token}`
        }
      }

      // Make the DELETE request to the API endpoint
      const apiResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/whatseat/orders/${id}/`, config)

      // console.log("Deleted")
      // Check the response status and handle accordingly
      if (apiResponse?.status === 200) {
        return res.status(apiResponse.status).json({
          message: 'Order deleted successfully'
        })
      } else {
        return res.status(apiResponse?.status).json({
          error: 'Error deleting Order'
        })
      }
    } catch (error: any) {
      // Handle API request errors
      console.log('Error:', error.response.data)

      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    // Handle invalid HTTP methods
    res.setHeader('Allow', ['DELETE'])

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`
    })
  }
}
