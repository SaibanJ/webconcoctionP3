"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { SearchSchema, RegistrationSchema, TransferSchema, HostingSchema } from "@/lib/schemas"
import type { ContactInfo } from "@/app/utils/namecheap"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "./checkout-form"

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

type Step = "SEARCH" | "RESULTS" | "REGISTER" | "TRANSFER" | "HOSTING" | "COMPLETE" | "PAYMENT"
type DomainMode = "REGISTER" | "TRANSFER"
type DomainResult = {
  domain: string
  available: boolean
  price: string
  suggestion: DomainMode | null
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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DomainWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan: any; // TODO: Define a proper type for initialPlan
}

export function DomainWizard({ isOpen, onClose, initialPlan }: DomainWizardProps) {
  const [step, setStep] = useState<Step>("SEARCH")
  const [mode, setMode] = useState<DomainMode>("REGISTER")
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<DomainResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && initialPlan) {
      hostingForm.setValue("plan", initialPlan.id);
    }
  }, [isOpen, initialPlan]);

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

  const transferForm = useForm<z.infer<typeof TransferSchema>>({
    resolver: zodResolver(TransferSchema),
    defaultValues: {
      years: 1,
      epp: "",
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

    const domainsToCheck = mode === "TRANSFER"
      ? [values.searchTerm]
      : values.selectedTlds.map((tld) => `${values.searchTerm}${tld}`)

    try {
      const response = await fetch("/api/namecheap/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: domainsToCheck }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to check availability.")

      const processedResults = await Promise.all(data.data.map(async (r: any) => {
        const tld = r.$.Domain.split(".").pop()
        let price = "N/A";
        if (r.$.Available === "true") {
            try {
                const pricingResponse = await fetch('/api/stripe/payment-intent', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ domain: r.$.Domain, years: 1, calculatePrice: true, domainAction: mode }),
                });
                const pricingData = await pricingResponse.json();
                console.log(`Pricing data for ${r.$.Domain}:`, pricingData); // Debugging line
                if (pricingResponse.ok) {
                    price = (pricingData.price / 100).toFixed(2);
                }
            } catch (e) {
                console.error("Failed to fetch price for", r.$.Domain, e);
            }
        }

        return {
          domain: r.$.Domain,
          available: r.$.Available === "true",
          price,
          suggestion: mode === "REGISTER" && r.$.Available === "false"
            ? "TRANSFER"
            : mode === "TRANSFER" && r.$.Available === "true"
              ? "REGISTER"
              : null
        }
      }));

      setResults(processedResults)
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

    // Transition to HOSTING step
    setStep("HOSTING")
    setIsLoading(false)
  }

  const onTransferSubmit = async (values: z.infer<typeof TransferSchema>) => {
    if (!selectedDomain) return
    setIsLoading(true)
    setError("")

    // Transition to HOSTING step
    setStep("HOSTING")
    setIsLoading(false)
  }

  const onCreateHostingSubmit = async (values: z.infer<typeof HostingSchema>) => {
    if (!selectedDomain) return
    setIsLoading(true)
    setError("")

    try {
      const registrantInfo = mode === "REGISTER" ? registrationForm.getValues("registrantInfo") : transferForm.getValues("registrantInfo");

      // Create or get user ID
      const userResponse = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrantInfo),
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error || "Failed to create/get user.");
      }
      const userId = userData.userId;

      const payload: any = {
        domain: selectedDomain.domain,
        years: mode === "REGISTER" ? registrationForm.getValues("years") : transferForm.getValues("years"),
        userId: userId,
        hostingPlan: values.plan,
        domainAction: mode,
        initialPlan: initialPlan, // Add initialPlan to the payload
        registrantInfo: registrantInfo,
        hostingUsername: values.hostingUsername,
        hostingPassword: values.hostingPassword,
      };

      if (mode === "TRANSFER") {
        payload.eppCode = transferForm.getValues("epp");
      }

      console.log("Payload sent to Stripe payment-intent:", payload); // Debugging line

      const response = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent.");
      }
      setClientSecret(data.clientSecret);
      setStep("PAYMENT");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const reset = () => {
    setStep("SEARCH")
    setMode("REGISTER")
    setSearchTerm("")
    setResults([])
    setIsLoading(false)
    setError("")
    setSelectedDomain(null)
    searchForm.reset()
    registrationForm.reset()
    transferForm.reset()
    hostingForm.reset()
    onClose();
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
        <CardTitle className="text-2xl">{mode === "REGISTER" ? "Find your perfect domain" : "Transfer existing domain"}</CardTitle>
        <CardDescription>Enter a name {mode === "REGISTER" ? "and select extensions " : ""}to check availability.</CardDescription>
      </CardHeader>
      <div className="mb-4 px-6">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) {
                setMode(value as DomainMode);
              }
            }}
            className="justify-center"
          >
            <ToggleGroupItem value="REGISTER" aria-label="Register domain">Register</ToggleGroupItem>
            <ToggleGroupItem value="TRANSFER" aria-label="Transfer domain">Transfer</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
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
                      <Input
                        placeholder={mode === "REGISTER" ? "e.g., my-awesome-idea" : "e.g., example.com"}
                        {...field}
                        className="text-lg h-12"
                      />
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
            {mode === "REGISTER" && (
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
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  )

  const renderResultsStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Domain Availability</CardTitle>
        <CardDescription>Here are the results for "{searchTerm}" ({mode === "REGISTER" ? "Registration" : "Transfer"} search).</CardDescription>
      </CardHeader>
      <div className="mb-4 px-6">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) {
                setMode(value as DomainMode);
                searchForm.handleSubmit(onSearchSubmit)();
              }
            }}
            className="justify-center"
          >
            <ToggleGroupItem value="REGISTER" aria-label="Register domain">Register</ToggleGroupItem>
            <ToggleGroupItem value="TRANSFER" aria-label="Transfer domain">Transfer</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.domain}
              className={cn(
                "flex flex-col p-3 rounded-md border",
                result.available ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
                result.suggestion ? "border-amber-300" : ""
              )}
            >
              <div className="flex items-center justify-between">
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
                </div>
              </div>

              {result.suggestion && (
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      {result.suggestion === "TRANSFER"
                        ? "This domain is already registered. Would you like to transfer it instead?"
                        : "This domain is available for registration. Would you like to register it instead?"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-300 text-amber-800"
                    onClick={() => {
                      setSelectedDomain(result)
                      setMode(result.suggestion as DomainMode)
                      setStep(result.suggestion)
                    }}
                  >
                    {result.suggestion === "TRANSFER" ? "Transfer" : "Register"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {((mode === "REGISTER" && result.available) || (mode === "TRANSFER" && !result.available)) && (
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedDomain(result)
                      setStep(mode)
                    }}
                  >
                    {mode === "REGISTER" ? "Register" : "Transfer"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("SEARCH")}>
          Search Again
        </Button>
        <div className="text-sm text-muted-foreground">
          Current mode: <span className="font-semibold">{mode === "REGISTER" ? "Registration" : "Transfer"}</span>
        </div>
      </CardFooter>
    </Card>
  )

  const renderRegisterStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Registering {selectedDomain?.domain}</CardTitle>
        <CardDescription>Please provide your contact information for registration.</CardDescription>
      </CardHeader>
      <div className="mb-4 px-6">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) {
                setMode(value as DomainMode);
                setStep(step);
              }
            }}
            className="justify-center"
          >
            <ToggleGroupItem value="REGISTER" aria-label="Register domain">Register</ToggleGroupItem>
            <ToggleGroupItem value="TRANSFER" aria-label="Transfer domain">Transfer</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
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

  const renderTransferStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Transferring {selectedDomain?.domain}</CardTitle>
        <CardDescription>Please provide the EPP/Auth code and your contact information.</CardDescription>
      </CardHeader>
      <div className="mb-4 px-6">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) {
                setMode(value as DomainMode);
                setStep(step);
              }
            }}
            className="justify-center"
          >
            <ToggleGroupItem value="REGISTER" aria-label="Register domain">Register</ToggleGroupItem>
            <ToggleGroupItem value="TRANSFER" aria-label="Transfer domain">Transfer</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <Form {...transferForm}>
        <form onSubmit={transferForm.handleSubmit(onTransferSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={transferForm.control}
              name="epp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EPP/Auth Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the authorization code from your current registrar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={transferForm.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renewal Period</FormLabel>
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
                  control={transferForm.control}
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
                  control={transferForm.control}
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
                control={transferForm.control}
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
                control={transferForm.control}
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
                control={transferForm.control}
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
                  control={transferForm.control}
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
                  control={transferForm.control}
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
                  control={transferForm.control}
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
                  control={transferForm.control}
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
              control={transferForm.control}
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Complete Transfer
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
                              <RadioGroupItem
                                value={plan.id}
                                className="sr-only"
                                disabled={plan.id !== initialPlan.id} // Disable if not the initial plan
                              />
                            </FormControl>
                            <div className={cn(
                                "items-center rounded-md border-2 border-muted p-4 hover:border-accent transition-colors",
                                plan.id !== initialPlan.id && "opacity-50 cursor-not-allowed" // Grey out if not the initial plan
                            )}>
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

  const renderPaymentStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
        <CardDescription>
          You are purchasing {selectedDomain?.domain} for {registrationForm.getValues("years")} year(s).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        )}
      </CardContent>
    </Card>
  );


  const renderError = () =>
    error && (
      <div className="w-full max-w-2xl mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );

  const renderStep = () => {
    switch (step) {
      case "SEARCH":
        return renderSearchStep()
      case "RESULTS":
        return renderResultsStep()
      case "REGISTER":
        if (mode !== "REGISTER") setMode("REGISTER")
        return renderRegisterStep()
      case "TRANSFER":
        if (mode !== "TRANSFER") setMode("TRANSFER")
        return renderTransferStep()
      case "HOSTING":
        return renderHostingStep()
      case "COMPLETE":
        return renderCompleteStep()
      case "PAYMENT":
        return renderPaymentStep()
      default:
        return renderSearchStep()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Domain and Hosting Setup</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          {renderStep()}
          {renderError()}
        </div>
      </DialogContent>
    </Dialog>
  )
}