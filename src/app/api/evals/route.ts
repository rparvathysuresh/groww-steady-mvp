import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { runEvaluationHarness } from '../../../../evals/runner';

export async function GET() {
  try {
    const latestPath = path.resolve(process.cwd(), 'evals', 'results', 'latest.json');

    if (fs.existsSync(latestPath)) {
      const data = JSON.parse(fs.readFileSync(latestPath, 'utf-8'));
      return NextResponse.json(data);
    }

    // If not found on disk, execute evaluation harness to generate fresh results
    const summary = await runEvaluationHarness();
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Error fetching evaluation results:', error);
    return NextResponse.json(
      { error: 'Failed to load evaluation results', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const summary = await runEvaluationHarness();
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Error running evaluation harness:', error);
    return NextResponse.json(
      { error: 'Evaluation run failed', details: error?.message },
      { status: 500 }
    );
  }
}

