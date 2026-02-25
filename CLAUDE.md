# HarmonySet Project Rules

1. Never say "done" based on code alone. Fetch the Vercel preview URL and describe exactly what you see rendering before reporting back.
2. When given a Stitch reference, match it exactly. Do not interpret or simplify.
3. Make one change at a time. Do not touch anything outside the scope of the current instruction.
4. When fixing a visual issue, do not change colors, layout, or structure of anything outside the specific element being fixed.
5. If unsure about a size, use percentage-based sizing relative to the container — never guess fixed pixels.

## Quality Gates

After completing any code changes, before reporting that you're done, you MUST:

1. Run `npm run build` (or `next build`) to catch compile-time errors, type errors, and import issues.
2. Check the terminal output for any warnings or errors and fix them before proceeding.
3. If the dev server is running, open the browser console equivalent by checking for hydration mismatches — specifically audit any component that uses `Math.random()`, `Date.now()`, trigonometric functions (`Math.cos`, `Math.sin`), or any value that could differ between server and client renders. Round all floating-point SVG coordinates to 2 decimal places.
4. Never mix CSS `animation` shorthand with individual animation properties (`animationDelay`, `animationDuration`, etc.) on the same element — always use longhand properties exclusively.
5. Verify there are no console errors by running `curl -s http://localhost:3000` and checking the HTML output renders correctly.
6. Do NOT tell me the task is complete until all of the above pass cleanly.