# MilTrack

A professional military training tracking and management system designed to streamline the administration and documentation of training records for military organizations.

## Overview

MilTrack is a comprehensive solution for managing military training programs, tracking individual progress, and maintaining detailed records across companies, platoons, and personnel. Built with a focus on usability, security, and maintainability, MilTrack helps military organizations efficiently manage their training operations.

## Live Demo

Experience MilTrack in action with our production demo:

- **[Company Commander View](https://miltrack.mvps.ch/company/cmiqieqem0000hkozs0cevj9p)** - See the high-level overview with company-wide statistics, platoon progress, and training analytics
- **[Lieutenant View](https://miltrack.mvps.ch/platoon/cmiqieqhw0001hkozbg65ydzf)** - Explore the mobile-first platoon management interface with Excel-like training tracking

## Project Philosophy

### User-Centered Design

Before writing a single line of code, we conducted extensive interviews with stakeholders—including company commanders, lieutenants, and sergeants—to deeply understand their needs, workflows, and pain points. This research-driven approach ensured that every feature addresses real-world requirements rather than assumptions.

### Thoughtful Technology Choices

We carefully selected our tech stack based on three core principles: **speed**, **security**, and **maintainability**. Every technology decision was made with these criteria in mind, not just following trends or "vibe coding" with the latest tools.

### Database Architecture

The database structure was designed with a clear **single source of truth** and **well-defined stakeholders** for each part of the application:

- **Organizational Hierarchy**: Company → Platoon → Person
- **Training Structure**: Training → TrainingInstance → TrainingTrack
- **Clear Ownership**: Each entity has explicit relationships and responsibilities
- **Data Integrity**: Cascading deletes and proper indexing ensure consistency

This architecture ensures that data flows logically and each stakeholder (Company Commander, Lieutenant, Sergeant) interacts with the appropriate parts of the system.

### Mobile-First Design

Recognizing that lieutenants and other field officers often work on mobile devices, MilTrack was built with a **mobile-first approach**. The interface is optimized for small screens while maintaining full functionality on desktop.

### Excel-Like Interface for Adoption

To reduce adoption friction, we've included an **Excel-like spreadsheet view** for platoon management. This familiar interface allows officers to quickly view and update training statuses in a format they're already comfortable with, making the transition to digital tools seamless.

## Features

- **Personnel Management**: Centralized management of all personnel and their training statuses
- **Training Tracking**: Comprehensive documentation of all trainings with progress monitoring
- **Analytics & Reports**: Detailed insights into training statistics and progress reports
- **Role-Based Access**: Support for different user types (Company Commander, Lieutenant, Sergeant)
- **Mobile-Optimized**: Responsive design that works seamlessly on all devices
- **Excel-Like Views**: Familiar spreadsheet interface for quick data entry and review
- **Secure & Reliable**: Built with security best practices and data integrity in mind

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **UI**: React 19, Tailwind CSS, Radix UI
- **Charts**: Recharts
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd miltrack
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other configuration
```

4. Set up the database:
```bash
pnpm prisma generate
pnpm prisma db push
pnpm prisma seed
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
miltrack/
├── prisma/           # Database schema and migrations
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utilities and configurations
│   └── hooks/        # Custom React hooks
└── public/           # Static assets
```

## Database Schema

The application uses a hierarchical structure:

- **Company**: Top-level organizational unit
- **Platoon**: Sub-unit within a company
- **Person**: Individual personnel member
- **Training**: Training definition template
- **TrainingInstance**: Specific instance of a training with due dates
- **TrainingTrack**: Individual completion record linking a person to a training instance

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm seed` - Seed the database with sample data

