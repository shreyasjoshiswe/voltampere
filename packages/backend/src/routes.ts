import { Prisma, PrismaClient } from '@prisma/client';
import { runSimulation } from '@voltampere/simulation';
import express, { type Request, type Response } from 'express';
import * as E from 'fp-ts/Either';
import { validateSimulationConfig } from './validation';

const prisma = new PrismaClient();

export const router: express.Router = express.Router();

router.post('/simulations', async (req: Request, res: Response) => {
  const validationResult = validateSimulationConfig(req.body);

  if (E.isLeft(validationResult)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.left,
    });
  }

  const config = validationResult.right;

  try {
    const simulation = await prisma.simulation.create({
      data: config,
    });

    res.status(201).json(simulation);
  } catch (error) {
    console.error('Error creating simulation:', error);
    res.status(500).json({ error: 'Failed to create simulation' });
  }
});

router.get('/simulations', async (req: Request, res: Response) => {
  try {
    const simulations = await prisma.simulation.findMany({
      include: { results: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(simulations);
  } catch (error) {
    console.error('Error fetching simulations:', error);
    res.status(500).json({ error: 'Failed to fetch simulations' });
  }
});

router.get('/simulations/:id', async (req: Request, res: Response) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id },
      include: { results: true },
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    res.json(simulation);
  } catch (error) {
    console.error('Error fetching simulation:', error);
    res.status(500).json({ error: 'Failed to fetch simulation' });
  }
});

router.put('/simulations/:id', async (req: Request, res: Response) => {
  const validationResult = validateSimulationConfig(req.body);

  if (E.isLeft(validationResult)) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.left,
    });
  }

  const config = validationResult.right;

  try {
    const simulation = await prisma.simulation.update({
      where: { id: req.params.id },
      data: config,
    });

    res.json(simulation);
  } catch (error) {
    console.error('Error updating simulation:', error);
    res.status(404).json({ error: 'Simulation not found' });
  }
});

router.delete('/simulations/:id', async (req: Request, res: Response) => {
  try {
    await prisma.simulation.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting simulation:', error);
    res.status(404).json({ error: 'Simulation not found' });
  }
});

router.post('/simulations/:id/run', async (req: Request, res: Response) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id },
    });

    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }

    const config = {
      numChargepoints: simulation.numChargepoints,
      arrivalMultiplier: simulation.arrivalMultiplier,
      carConsumption: simulation.carConsumption,
      chargingPower: simulation.chargingPower,
    };

    const results = runSimulation(config);

    const simulationResult = await prisma.simulationResult.upsert({
      where: { simulationId: simulation.id },
      update: {
        totalEnergyKwh: results.totalEnergyKwh,
        theoreticalMaxKw: results.theoreticalMaxKw,
        actualMaxKw: results.actualMaxKw,
        concurrencyFactor: results.concurrencyFactor,
        chargingEvents: results.chargingEvents,
        powerProfile: results.powerProfile ?? Prisma.JsonNull,
      },
      create: {
        simulationId: simulation.id,
        totalEnergyKwh: results.totalEnergyKwh,
        theoreticalMaxKw: results.theoreticalMaxKw,
        actualMaxKw: results.actualMaxKw,
        concurrencyFactor: results.concurrencyFactor,
        chargingEvents: results.chargingEvents,
        powerProfile: results.powerProfile ?? Prisma.JsonNull,
      },
    });

    res.json({
      simulation,
      results: simulationResult,
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    res.status(500).json({ error: 'Failed to run simulation' });
  }
});
