export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Webconcoction Domain Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Domain Availability</h2>
          <p className="mb-4">Check if your desired domain names are available for registration.</p>
          <p className="text-sm text-gray-600 mb-4">
            Use the API endpoint: <code className="bg-gray-100 p-1 rounded">POST /api/namecheap/check</code>
          </p>
          <div className="text-sm bg-gray-100 p-3 rounded">
            <pre>{`{
  "domains": ["example.com", "example.net"]
}`}</pre>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Domain Registration</h2>
          <p className="mb-4">Register a new domain with complete contact information.</p>
          <p className="text-sm text-gray-600 mb-4">
            Use the API endpoint: <code className="bg-gray-100 p-1 rounded">POST /api/namecheap/register</code>
          </p>
          <div className="text-sm bg-gray-100 p-3 rounded">
            <pre>{`{
  "domain": "example.com",
  "years": 1,
  "registrantInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Anytown",
    "stateProvince": "CA",
    "postalCode": "12345",
    "country": "US",
    "phone": "+1.1234567890",
    "emailAddress": "john@example.com"
  }
}`}</pre>
          </div>
        </div>
      </div>
    </main>
  );
}