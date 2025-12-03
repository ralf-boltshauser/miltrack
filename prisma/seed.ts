import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Swiss names for persons
const swissNames = [
  "Müller", "Schmid", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker",
  "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf",
  "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger", "Hofmann",
  "Hartmann", "Lange", "Schmitt", "Werner", "Schmitz", "Krause", "Meier",
  "Lehmann", "Schmid", "Schulze", "Maier", "Köhler", "Herrmann", "König",
  "Walter", "Mayer", "Huber", "Kaiser", "Fuchs", "Peters", "Lang", "Scholz",
  "Möller", "Weiß", "Jung", "Hahn", "Schubert", "Vogel", "Friedrich", "Günther",
  "Frank", "Berger", "Winkler", "Roth", "Beck", "Lorenz", "Baumann", "Franke",
  "Albrecht", "Schuster", "Simon", "Ludwig", "Böhm", "Winter", "Kraus", "Martin",
  "Schumacher", "Krämer", "Vogt", "Stein", "Jäger", "Otto", "Sommer", "Groß",
  "Seidel", "Heinrich", "Brandt", "Haas", "Schreiber", "Graf", "Schulte", "Dietrich",
  "Ziegler", "Kuhn", "Kühn", "Pohl", "Engel", "Horn", "Busch", "Bergmann",
  "Thomas", "Voigt", "Sauer", "Arnold", "Wolff", "Pfeiffer", "Langer", "Günther"
];

async function main() {
  console.log("Starting seed...");

  // Create company
  const company = await prisma.company.create({
    data: {
      name: "Jassbach KP 2",
    },
  });
  console.log(`Created company: ${company.name}`);

  // Create 2 platoons
  const platoon1 = await prisma.platoon.create({
    data: {
      name: "Zug 1",
      companyId: company.id,
    },
  });

  const platoon2 = await prisma.platoon.create({
    data: {
      name: "Zug 2",
      companyId: company.id,
    },
  });
  console.log(`Created platoons: ${platoon1.name}, ${platoon2.name}`);

  // Create 10 persons per platoon with random Swiss names
  const persons1 = [];
  const persons2 = [];
  const usedNames = new Set<string>();

  // Helper to get a unique name
  const getUniqueName = (): string => {
    let name: string;
    do {
      name = swissNames[Math.floor(Math.random() * swissNames.length)];
    } while (usedNames.has(name));
    usedNames.add(name);
    return name;
  };

  // Create persons for platoon 1
  for (let i = 0; i < 10; i++) {
    const person = await prisma.person.create({
      data: {
        name: getUniqueName(),
        platoonId: platoon1.id,
      },
    });
    persons1.push(person);
  }

  // Create persons for platoon 2
  for (let i = 0; i < 10; i++) {
    const person = await prisma.person.create({
      data: {
        name: getUniqueName(),
        platoonId: platoon2.id,
      },
    });
    persons2.push(person);
  }
  console.log(`Created ${persons1.length + persons2.length} persons`);

  // Create trainings
  const trainings = [
    { name: "Fahrerausbildung", maxPoints: null },
    { name: "Fahrerprüfung", maxPoints: null },
    { name: "San Ausbildung", maxPoints: null },
    { name: "Erste Hilfe", maxPoints: null },
    { name: "ABC Ausbildung", maxPoints: null },
    { name: "300 Meter", maxPoints: 90 },
    { name: "Gefechtsschiessen", maxPoints: null },
    { name: "Persönliche Waffe", maxPoints: null },
    { name: "FTA 5 inkl. punkte", maxPoints: 120 },
    { name: "Wachdienst", maxPoints: null },
  ];

  const createdTrainings = [];
  for (const training of trainings) {
    const created = await prisma.training.create({
      data: {
        name: training.name,
        maxPoints: training.maxPoints,
      },
    });
    createdTrainings.push(created);
  }
  console.log(`Created ${createdTrainings.length} trainings`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

