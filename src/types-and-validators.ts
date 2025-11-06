import * as z from "zod/mini";

// Generate with chatgpt: https://chatgpt.com/share/690cac7d-a654-8006-83a0-8185f407bee4

// single range schema
const TimeRangeSchema = z
  .object({
    start: z.number().int().check(z.gte(0)), // non‐negative integer timestamp
    end: z.number().int().check(z.gte(0)), // non‐negative integer timestamp
    value: z.string(),
  })
  .check((r) => r.start < r.end, {
    message: "range start must be strictly less than end",
    path: ["end"],
  });

// array of ranges
const TimeRangesSchema = z
  .array(TimeRangeSchema)
  .check(
    (arr) => {
      // non‐overlap check
      const sorted = [...arr].sort((a, b) => a.start - b.start);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i - 1].end > sorted[i].start) return false;
      }
      return true;
    },
    {
      message: "time ranges must not overlap (previous end ≤ next start)",
    },
  )
  .check(
    (arr) => {
      // sorted‐by‐start check (optional)
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1].start > arr[i].start) return false;
      }
      return true;
    },
    {
      message: "array must be sorted by start ascending",
    },
  );
