import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { domain, username, password, plan } = await request.json();

    if (!domain || !username || !password || !plan) {
      return NextResponse.json({ error: "Missing required cPanel account details" }, { status: 400 });
    }

    const whmUsername = process.env.WHM_USERNAME;
    const whmAccessHash = process.env.WHM_ACCESS_HASH;
    const whmHost = process.env.WHM_HOST;

    if (!whmUsername || !whmAccessHash || !whmHost) {
      throw new Error("WHM configuration error: Missing environment variables (WHM_USERNAME, WHM_ACCESS_HASH, WHM_HOST).");
    }

    const authHeader = `whm ${whmUsername}:${whmAccessHash}`;
    const url = `https://${whmHost}:2087/json-api/createacct?api.version=1&username=${username}&domain=${domain}&password=${password}&plan=${plan}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: authHeader,
      },
      // Disable SSL verification for development/testing if needed, but enable in production
      // httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });

    const result = response.data.metadata;

    if (result.result === 1) {
      return NextResponse.json({ success: true, message: result.reason });
    } else {
      return NextResponse.json({ success: false, error: result.reason }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating cPanel account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}