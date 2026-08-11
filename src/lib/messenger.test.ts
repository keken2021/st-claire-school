import { describe, expect, it } from "vitest";
import {
  buildMessengerMessage,
  buildMessengerUrl,
  encodeRef,
} from "./messenger";
import { site } from "./site";

describe("buildMessengerMessage", () => {
  it("names the program the parent was looking at", () => {
    const message = buildMessengerMessage({
      program: "Ballet",
      source: "program_page",
    });

    expect(message).toContain("Ballet");
    expect(message).toContain("Hi St. Claire!");
  });

  it("asks about the waitlist when the class is full", () => {
    const message = buildMessengerMessage({
      program: "Ballet",
      source: "program_page",
      waitlist: true,
    });

    expect(message).toContain("waitlist for Ballet");
  });

  it("folds the finder answers into one readable sentence", () => {
    const message = buildMessengerMessage({
      program: "Piano",
      age: 6,
      experience: "none",
      when: "weekend",
      source: "finder_result",
    });

    expect(message).toContain("My child is 6 and no experience yet.");
    expect(message).toContain("Weekends work best for us.");
  });

  it("falls back to a general enquiry with no program context", () => {
    const message = buildMessengerMessage({ source: "footer" });

    expect(message).toContain("enrolling my child");
    expect(message).not.toContain("undefined");
  });

  it("omits the age sentence when age is absent or zero", () => {
    expect(buildMessengerMessage({ source: "hero" })).not.toMatch(
      /my child is/i,
    );
    expect(buildMessengerMessage({ source: "hero", age: 0 })).not.toMatch(
      /my child is/i,
    );
  });
});

describe("encodeRef", () => {
  it("keeps the source and program for attribution", () => {
    const ref = encodeRef({
      program: "Public Speaking",
      source: "finder_result",
    });

    expect(ref).toContain("s-finder_result");
    expect(ref).toContain("p-public-speaking");
  });

  it("marks waitlist inquiries", () => {
    expect(
      encodeRef({ program: "Ballet", source: "program_page", waitlist: true }),
    ).toContain("q-1");
  });

  it("carries no age or free text, only coarse context", () => {
    const ref = encodeRef({
      program: "Piano",
      age: 6,
      experience: "none",
      source: "finder_result",
    });

    expect(ref).not.toContain("6");
    expect(ref).not.toContain("none");
  });

  it("stays within the length m.me will accept", () => {
    const ref = encodeRef({ program: "x".repeat(500), source: "y".repeat(40) });

    expect(ref.length).toBeLessThanOrEqual(180);
  });
});

describe("buildMessengerUrl", () => {
  it("points at the school's page with an encoded ref", () => {
    const url = buildMessengerUrl({ program: "Piano", source: "program_page" });

    expect(url.startsWith(`https://m.me/${site.messengerHandle}?ref=`)).toBe(
      true,
    );
    expect(url).not.toContain(" ");
  });
});
