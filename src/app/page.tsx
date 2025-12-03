import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Willkommen bei <span className="text-primary">MilTrack</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
              Die professionelle Lösung zur Verwaltung und Nachverfolgung von
              militärischen Ausbildungen für Ihr Unternehmen
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/sign-up">
                  Jetzt starten
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link href="/sign-in">Anmelden</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Warum MilTrack?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Alles, was Sie brauchen, um die Ausbildungen Ihrer Mitarbeiter
              effizient zu verwalten und zu dokumentieren
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Personenverwaltung</CardTitle>
                <CardDescription className="text-base">
                  Verwalten Sie alle Mitarbeiter und deren Ausbildungsstände
                  zentral und übersichtlich
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-primary/10">
                  <Target className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Ausbildungsverfolgung
                </CardTitle>
                <CardDescription className="text-base">
                  Dokumentieren Sie alle Ausbildungen und behalten Sie den
                  Überblick über Fortschritte und Abschlüsse
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-primary/10">
                  <BarChart3 className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Analysen & Berichte</CardTitle>
                <CardDescription className="text-base">
                  Erhalten Sie detaillierte Einblicke in Ausbildungsstatistiken
                  und Fortschrittsberichte
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-primary/10">
                  <Shield className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Sicher & Zuverlässig</CardTitle>
                <CardDescription className="text-base">
                  Ihre Daten sind sicher gespeichert und entsprechen höchsten
                  Sicherheitsstandards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-primary/10">
                  <CheckCircle2 className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Einfache Verwaltung</CardTitle>
                <CardDescription className="text-base">
                  Intuitive Benutzeroberfläche für schnelle und einfache
                  Verwaltung aller Ausbildungsdaten
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm bg-primary/10">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Skalierbar</CardTitle>
                <CardDescription className="text-base">
                  Perfekt für kleine Teams bis hin zu großen Organisationen mit
                  vielen Mitarbeitern
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Bereit loszulegen?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl opacity-90">
              Starten Sie noch heute und optimieren Sie die Verwaltung Ihrer
              militärischen Ausbildungen
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                <Link href="/sign-up">
                  Kostenlos registrieren
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
