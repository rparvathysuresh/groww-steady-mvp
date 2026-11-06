import { describe, it, expect } from "vitest";
import Groq from "groq-sdk";

describe("Phase 0: Groq SDK Client Instantiation", () => {
  it("initializes Groq client with a valid or placeholder key", () => {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY || "gsk_test_placeholder_key",
    });
    expect(client).toBeDefined();
    expect(typeof client.chat.completions.create).toBe("function");
  });

  it("ensures GROQ_API_KEY is isolated and does not use NEXT_PUBLIC_ prefix", () => {
    // Secret keys must never be prefixed with NEXT_PUBLIC_
    expect(process.env.NEXT_PUBLIC_GROQ_API_KEY).toBeUndefined();
  });
});

