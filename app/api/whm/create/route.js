import axios from 'axios';
import { NextResponse } from 'next/server';

// Load environment variables
const WHM_API_TOKEN = process.env.WHM_API_TOKEN;
const WHM_USERNAME = process.env.WHM_USERNAME;
const WHM_HOST = process.env.WHM_HOST;

export async function POST(request) {
  try {
    // Parse the request body
    const { username, domain, password, plan, contactemail } = await request.json();

    // Make request to WHM API
    const response = await axios.get(`${WHM_HOST}/json-api/createacct`, {
      headers: {
        Authorization: `whm ${WHM_USERNAME}:${WHM_API_TOKEN}`,
      },
      params: {
        username,
        domain,
        password,
        plan,
        contactemail,
      },
    });

    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}