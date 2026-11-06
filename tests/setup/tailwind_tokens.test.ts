import { describe, it, expect } from "vitest";
import tailwindConfig from "../../tailwind.config";

describe("Phase 0: Design System Token Validation", () => {
  it("defines required Groww Steady color tokens", () => {
    const colors = tailwindConfig.theme?.extend?.colors as Record<string, any>;
    expect(colors).toBeDefined();

    // Primary Teal (#00D09C)
    expect(colors.primary.DEFAULT).toBe("#00D09C");
    expect(colors.primary.dark).toBe("#00B386");

    // Dark Navy (#1E222B)
    expect(colors.navy.DEFAULT).toBe("#1E222B");

    // Canvas Surface (#F9FAFB)
    expect(colors.surface.canvas).toBe("#F9FAFB");
    expect(colors.surface.card).toBe("#FFFFFF");

    // Border Stroke (#E5E7EB)
    expect(colors.border.subtle).toBe("#E5E7EB");

    // Finance Gain/Loss colors
    expect(colors.finance.gain).toBe("#00B386");
    expect(colors.finance.loss).toBe("#EB5757");
  });

  it("configures the mobile frame container max-width to 420px", () => {
    const maxWidth = tailwindConfig.theme?.extend?.maxWidth as Record<string, string>;
    expect(maxWidth["mobile-frame"]).toBe("420px");
  });
});

