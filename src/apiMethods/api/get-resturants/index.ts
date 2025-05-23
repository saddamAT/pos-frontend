//import { API_URL } from '../../../../config'
import axios from 'axios'
// import cookie from 'cookie'

export default async (req: any, res: any) => {
  //   console.log(req, 'req------')

  if (req.method === 'GET') {
    // const cookies = cookie.parse(req.headers.cookie ?? '')

    // const { auth_token, csrftoken } = cookies

    // const access = cookies.access ?? false

    // console.log(cookies, 'cookies-----------')

    // if (access === false) {
    //   return res.status(401).json({
    //     error: 'User is not authorized to make this request'
    //   })
    // }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
        // Authorization: `Token ${auth_token}`
      }
    }

    try {
      // Assuming you have an API endpoint to fetch customer addresses
      const apiResponse = await axios.get('http://127.0.0.1:8000/api/whatseat/restaurants/', config)

      // console.log(apiResponse, 'apiResponse')

      if (apiResponse?.status === 200) {
        // Assuming the response contains an array of customer addresses
        const ResturantResponse = apiResponse.data

        return res.status(apiResponse.status).json(ResturantResponse)
      } else {
        return res.status(apiResponse?.status).json({
          error: 'Error fetching resturants '
        })
      }
    } catch (error: any) {
      // Handle API request errors
      console.log('Error in getting resturants', error.response)

      return res.status(500).json({ error: error })
    }
  } else if (req.method === 'POST') {
    // const cookies = cookie.parse(req.headers.cookie ?? '')

    // console.log(cookies, 'cookies-----------')

    // const { auth_token, csrftoken } = cookies

    // console.log(auth_token, 'auth_token')
    // console.log(csrftoken, 'csrftoken')

    // const access = cookies.access ?? false

    // if (access === false) {
    //   return res.status(401).json({
    //     error: 'User is not authorized to make this request'
    //   })
    // }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Authorization: `Token ${auth_token}`
      }
    }

    const data = JSON.stringify(req.body)

    // console.log(config, data, 'config')

    try {
      // Assuming you have an API endpoint to fetch customer addresses
      const apiResponse = await axios.post('http://127.0.0.1:8000/api/whatseat/restaurants/', data, config)

      // console.log(apiResponse, 'apiResponse')
      const addresses = apiResponse.data

      return res.status(apiResponse.status).json(addresses)
    } catch (error: any) {
      // console.log(error?.response?.data, 'error---------56')

      // Handle API request errors

      return res.status(500).json(error?.response?.data)
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`
    })
  }
}
