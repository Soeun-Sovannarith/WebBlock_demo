---
name: investigate
description: Use for any bug, failing build, type error, or unexpected behaviour. Evidence-first debugging - reproduce, form one hypothesis, isolate, then fix.
argument-hint: <bug description or error>
---

Investigate: $ARGUMENTS

Follow these steps in order. Do NOT edit source code before step 3 is complete.

1. **Reproduce.** Find the exact command, route, or input that triggers it, and run it.
   Capture the real error output / stack trace. If you cannot reproduce it, stop and report
   what you tried — do not guess a fix.
2. **Hypothesis.** State one falsifiable cause, citing the specific log line, stack frame or file:line.
3. **Isolate.** Eliminate variables until one point of failure remains: check inputs, mock data
   shape vs `types.ts`, server vs client component boundary, `git diff` / `git log` for recent changes.
   Show the evidence that rules out the alternatives.
4. **Fix** only that cause, with the smallest change. No unrelated refactors.
5. **Prove.** Re-run the step-1 reproduction and show it now passes, then run `/verify`.

Report: reproduction, root cause (with evidence), fix, before/after output.
