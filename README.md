# Voltampere

A TypeScript monorepo for simulating and analyzing EV charging station power demands and energy consumption.

https://github.com/user-attachments/assets/9786a275-98b3-4115-a5a8-59196c88388b

## Structure

```
voltampere
├── packages
│   ├── backend     # Express + Prisma API
│   ├── frontend    # React + Vite + Tailwind UI
│   ├── shared      # types, constants, utils
│   └── simulation  # Sim engine
├── devenv.nix
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL (for backend)

### Or Just Use devenv (recommended)

- nix with devenv

## Quick Setup

### Install Deps

#### Using `devenv`

```bash
devenv shell
pnpm install
```

#### Manual

```bash
pnpm install
```

### Setup DB

```bash
createdb voltampere
```

Copy `env` variables:

```bash
cp .env.example .env
```

Migrations:

```bash
cd packages/backend
pnpm prisma:migrate
pnpm prisma:generate
```

### Build Shared Packages

```bash
cd packages/simulation
pnpm build
```
and

```bash
cd packages/shared
pnpm build
```

## Usage

### CLI Simulation (Task 1)

```bash
pnpm sim
```

or

```bash
cd packages/simulation
pnpm start
```

### Fullstack App (Tasks 2a + 2b)

#### Start Backend

```bash
cd packages/backend
pnpm dev
```

Runs on http://localhost:3000

#### Start Frontend

```bash
cd packages/frontend
pnpm dev
```

Runs on http://localhost:5173

#### Using the Application

Open http://localhost:5173
Configure sim params:
- Number of Chargepoints (1 to 30)
- Arrival Multiplier (0.2 to 2.0)
- Car Consumption (kWh/100km)
- Charging Power (kW)
Click "Run Simulation"

#### NOTE: Remember to rebuild after changes

```bash
cd packages/simulation
pnpm build
```

Then restart the backend server.

Also:

```bash
pnpm build
pnpm validate
```

Validation is stochastic so expect a couple of failed runs:

```
❯ pnpm validate

> @voltampere/simulation@1.0.0 validate /Users/<username>/Lab/voltampere/packages/simulation
> tsx src/validate.ts

Pass Theoretical max is correct
  Expected: 220
  Actual: 220

Pass Actual max is in expected range
  Expected: 77-121 kW
  Actual: 77.00 kW

Pass Concurrency factor is in expected range
  Expected: 35-55%
  Actual: 35.0%

Pass Total energy is positive
  Expected: > 0
  Actual: 53550.00 kWh

Pass Charging events recorded
  Expected: > 0
  Actual: 4770

All validation tests passed!
```

## Config

Environment variables in `.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voltampere
PORT=3000
```

## Endpoints

- `POST /api/simulations` - Create a simulation configuration
- `GET /api/simulations` - List all simulations
- `GET /api/simulations/:id` - Get specific simulation
- `PUT /api/simulations/:id` - Update simulation configuration
- `DELETE /api/simulations/:id` - Delete simulation
- `POST /api/simulations/:id/run` - Run simulation and store results

## Visualizations

- Exemplary Day Chart shows power demand patterns across 24 hours and peak hours.
- Annual Power Profile displays daily peak power consumption across the entire year, with actual vs theoretical max cap
