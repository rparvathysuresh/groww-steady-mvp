import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import latestFallback from '../../../../evals/results/latest.json';
import { runEvaluationHarness } from '../../../../evals/runner';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

export async function GET() {
  try {
    const latestPath = path.resolve(process.cwd(), 'evals', 'results', 'latest.json');

    if (fs.existsSync(latestPath)) {
      try {
        const raw = fs.readFileSync(latestPath, 'utf-8');
        const data = JSON.parse(raw);
        return NextResponse.json(data);
      } catch (_) {
        // Fall back to bundled JSON
      }
    }

    return NextResponse.json(latestFallback);
  } catch (error: any) {
    console.error('Error fetching evaluation results, using bundled fallback:', error);
    return NextResponse.json(latestFallback);
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

