"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { SearchSchema, RegistrationSchema, HostingSchema } from "@/lib/schemas"
import type { ContactInfo } from "@/app/utils/namecheap"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Search, CheckCircle, XCircle, ArrowRight, PartyPopper, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = "SEARCH" | "RESULTS" | "REGISTER" | "HOSTING" | "COMPLETE"
type DomainResult = {
  domain: string
  available: boolean
  price: string
}

const initialContactInfo: ContactInfo = {
  firstName: "John",
  lastName: "Doe",
  address1: "123 Innovation Drive",
  city: "Techville",
  stateProvince: "CA",
  postalCode: "90210",
  country: "US",
  phone: "+1.5551234567",
  emailAddress: "john.doe@example.com",
}

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
]

const hostingPlans = [
  { id: "webcrtae_basic", name: "Basic", description: "Perfect for getting started." },
  { id: "webcrtae_pro", name: "Pro", description: "For growing businesses." },
  { id: "webcrtae_elite", name: "Elite", description: "For power users & agencies." },
]

export function DomainWizard() {
  const [step, setStep] = useState<Step>("SEARCH")
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<DomainResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)

  const searchForm = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { searchTerm: "", selectedTlds: [".com"] },
  })

  const registrationForm = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      years: 1,
      registrantInfo: initialContactInfo,
      whoisguard: true,
    },
  })

  const hostingForm = useForm<z.infer<typeof HostingSchema>>({
    resolver: zodResolver(HostingSchema),
    defaultValues: { hostingUsername: "", hostingPassword: "", plan: "webcrtae_basic" },
  })

  const onSearchSubmit = async (values: z.infer<typeof SearchSchema>) => {
    setIsLoading(true)
    setError("")
    setResults([])
    setSearchTerm(values.searchTerm)

    const domainsToCheck = values.selectedTlds.map((tld) => `${values.searchTerm}${tld}`)

    try {
      const response = await fetch("/api/namecheap/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: domainsToCheck }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to check availability.")
      setResults(
        data.data.map((r: any) => ({ domain: r.$.Domain, available: r.$.Available === "true", price: "12.99" })),
      )
      setStep("RESULTS")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (values: z.infer<typeof RegistrationSchema>) => {
    if (!selectedDomain) return
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/namecheap/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain.domain,
          years: values.years,
          registrantInfo: values.registrantInfo,
          enableWhoisguard: values.whoisguard,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to register domain.")
      const baseUsername = selectedDomain.domain.split(".")[0]
      const sanitizedUsername = baseUsername
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 16)

      hostingForm.reset({
        hostingUsername: sanitizedUsername,
        hostingPassword: "",
        plan: "webcrtae_basic",
      })

      setStep("HOSTING")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const onCreateHostingSubmit = async (values: z.infer<typeof HostingSchema>) => {
    if (!selectedDomain) return
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/whm/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain.domain,
          username: values.hostingUsername,
          password: values.hostingPassword,
          plan: values.plan,
          contactemail: registrationForm.getValues("registrantInfo.emailAddress"),
        }),
      })
      const data = await response.json()
      // The backend now sends a proper status code and a JSON error object.
      if (!response.ok) {
        // data.error will contain the detailed message from the backend
        throw new Error(data.error || "Failed to create hosting account.")
      }
      setStep("COMPLETE")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setStep("SEARCH")
    setSearchTerm("")
    setResults([])
    setIsLoading(false)
    setError("")
    setSelectedDomain(null)
    searchForm.reset()
    registrationForm.reset()
    hostingForm.reset()
  }

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    let pass = ""
    for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
    hostingForm.setValue("hostingPassword", pass, { shouldValidate: true })
  }

  const renderSearchStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Find your perfect domain</CardTitle>
        <CardDescription>Enter a name and select extensions to check availability.</CardDescription>
      </CardHeader>
      <Form {...searchForm}>
        <form onSubmit={searchForm.handleSubmit(onSearchSubmit)}>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={searchForm.control}
                name="searchTerm"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="e.g., my-awesome-idea" {...field} className="text-lg h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={isLoading} className="h-12 w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
            <FormField
              control={searchForm.control}
              name="selectedTlds"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Select TLDs:</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex-wrap justify-start"
                    >
                      {[".com", ".net", ".org", ".io", ".ai", ".dev"].map((tld) => (
                        <ToggleGroupItem key={tld} value={tld}>
                          {tld}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
    </Card>
  )

  const renderResultsStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Domain Availability</CardTitle>
        <CardDescription>Here are the results for "{searchTerm}".</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.domain}
              className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                result.available ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20 opacity-60",
              )}
            >
              <div className="flex items-center gap-3">
                {result.available ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">{result.domain}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("font-semibold", result.available ? "text-green-700" : "text-red-700")}>
                  {result.available ? `$${result.price}/yr` : "Taken"}
                </span>
                {result.available && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedDomain(result)
                      setStep("REGISTER")
                    }}
                  >
                    Register <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setStep("SEARCH")}>
          Search Again
        </Button>
      </CardFooter>
    </Card>
  )

  const renderRegisterStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Registering {selectedDomain?.domain}</CardTitle>
        <CardDescription>Please provide your contact information for registration.</CardDescription>
      </CardHeader>
      <Form {...registrationForm}>
        <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={registrationForm.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year} Year{year > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Registrant Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={registrationForm.control}
                  name="registrantInfo.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registrationForm.control}
                  name="registrantInfo.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={registrationForm.control}
                name="registrantInfo.emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registrationForm.control}
                name="registrantInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registrationForm.control}
                name="registrantInfo.address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={registrationForm.control}
                  name="registrantInfo.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registrationForm.control}
                  name="registrantInfo.stateProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={registrationForm.control}
                  name="registrantInfo.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registrationForm.control}
                  name="registrantInfo.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={registrationForm.control}
              name="whoisguard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Free WhoisGuard Privacy Protection</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep("RESULTS")}>
              Back to Results
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Complete Registration
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )

  const renderHostingStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Set Up Hosting for {selectedDomain?.domain}</CardTitle>
        <CardDescription>Choose a plan and create a cPanel hosting account.</CardDescription>
      </CardHeader>
      <Form {...hostingForm}>
        <form onSubmit={hostingForm.handleSubmit(onCreateHostingSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={hostingForm.control}
              name="plan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Select a Hosting Plan</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {hostingPlans.map((plan) => (
                        <FormItem key={plan.id}>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value={plan.id} className="sr-only" />
                            </FormControl>
                            <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                              <h4 className="font-semibold mb-1">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <FormField
                control={hostingForm.control}
                name="hostingUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>cPanel Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={hostingForm.control}
                name="hostingPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>cPanel Password</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={generatePassword}>
                        Generate
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep("COMPLETE")}>
              Skip
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Hosting Account
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )

  const renderCompleteStep = () => (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <PartyPopper className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl mt-4">Setup Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-lg text-muted-foreground">
          Your domain <span className="font-semibold text-primary">{selectedDomain?.domain}</span> is registered.
        </p>
        {hostingForm.getValues("hostingUsername") && (
          <p className="text-lg text-muted-foreground">
            Hosting account{" "}
            <span className="font-semibold text-primary">{hostingForm.getValues("hostingUsername")}</span> has been
            created with the{" "}
            <span className="font-semibold text-primary">
              {hostingPlans.find((p) => p.id === hostingForm.getValues("plan"))?.name}
            </span>{" "}
            plan.
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={reset}>Start Over</Button>
      </CardFooter>
    </Card>
  )

  const renderError = () =>
    error && (
      <div className="w-full max-w-2xl mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    )

  const renderStep = () => {
    switch (step) {
      case "SEARCH":
        return renderSearchStep()
      case "RESULTS":
        return renderResultsStep()
      case "REGISTER":
        return renderRegisterStep()
      case "HOSTING":
        return renderHostingStep()
      case "COMPLETE":
        return renderCompleteStep()
      default:
        return renderSearchStep()
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {renderStep()}
      {renderError()}
    </div>
  )
}
