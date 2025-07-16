import { DomainWizard } from "@/components/domain-wizard"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Webconcoction
        </h1>
        <p className="text-lg text-muted-foreground mt-2">Your digital presence, crafted instantly lol.</p>
      </div>
      <DomainWizard />
    </main>
  )
}
