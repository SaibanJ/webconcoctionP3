import axios from "axios"
import { NextResponse } from "next/server"

// Load environment variables
const WHM_API_TOKEN = process.env.WHM_API_TOKEN
const WHM_USERNAME = process.env.WHM_USERNAME
const WHM_HOST = process.env.WHM_HOST

export async function POST(request) {
  // Log entry point
  console.log("WHM Create Account API route hit.")

  // Check for missing environment variables
  if (!WHM_API_TOKEN || !WHM_USERNAME || !WHM_HOST) {
    console.error("WHM environment variables are missing.")
    return NextResponse.json({ error: "Server configuration error: WHM credentials not set." }, { status: 500 })
  }

  try {
    // Parse the request body
    const { username, domain, password, plan, contactemail } = await request.json()
    console.log("Received data for account creation:", { username, domain, plan, contactemail })

    // Construct the API URL and parameters
    const whmApiUrl = `${WHM_HOST}/json-api/createacct`
    const params = {
      "api.version": 1, // It's good practice to specify the API version
      username,
      domain,
      password,
      plan,
      contactemail,
    }

    console.log(`Making request to WHM API at: ${whmApiUrl}`)
    console.log("With params:", { ...params, password: "***" }) // Don't log the password

    // Make request to WHM API
    const response = await axios.get(whmApiUrl, {
      headers: {
        Authorization: `whm ${WHM_USERNAME}:${WHM_API_TOKEN}`,
      },
      params,
    })

    // Log the full response from WHM
    console.log("Received response from WHM:", JSON.stringify(response.data, null, 2))

    // Check the WHM response for success
    if (response.data.metadata && response.data.metadata.result === 1) {
      // Success
      console.log("Account created successfully on WHM.")
      return NextResponse.json(response.data)
    } else {
      // WHM returned an error
      const reason = response.data.metadata?.reason || "Unknown error from WHM."
      console.error("WHM API returned an error:", reason)
      return NextResponse.json(
        { error: `WHM Error: ${reason}` },
        { status: 400 }, // Use 400 for a client-side error (e.g., bad plan name)
      )
    }
  } catch (error) {
    // Handle network errors or other exceptions from axios
    console.error("An error occurred while calling the WHM API:", error)

    let errorMessage = "An unexpected error occurred."
    let status = 500

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("WHM API Error Response Data:", error.response.data)
      console.error("WHM API Error Response Status:", error.response.status)
      errorMessage = error.response.data?.error || `WHM server responded with status ${error.response.status}`
      status = error.response.status
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from WHM API:", error.request)
      errorMessage = "Could not connect to the WHM server. Please check the host and network configuration."
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message
    }

    return NextResponse.json({ error: errorMessage }, { status })
  }
}
