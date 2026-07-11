---
name: bilingual_plan_rules
description: Strict rules for generating Implementation Plans, Walkthroughs, Interactive Approvals, and other technical artifacts in English and Myanmar (Burmese) format.
category: core
---

# Bilingual Artifacts & Prompts Format

When writing an Implementation Plan, a Walkthrough document, or any detailed technical proposal artifact, you MUST write it using a paragraph-level bilingual format.

1. Provide the entire English text for a paragraph or section first.
2. Immediately below the English paragraph, provide the complete Burmese (Myanmar) translation of that entire paragraph, formatted in italics.
3. NEVER translate sentence-by-sentence line-by-line. Always group the English text into a full paragraph, then follow with the Myanmar paragraph.

## Interactive Human Approvals (ask_question / Modals)

Whenever requesting human approval using interactive tools (e.g., `ask_question`), the prompt and the options MUST follow these strict rules:
1. **Bilingual Display**: The question and the options must be presented bilingually (English + Myanmar) so the user fully understands the action.
2. **Tech Terms strictly in English**: All technical terminology, tool names, slash commands (e.g., `/update-docs`), branch names, and specific tech jargon must remain in English and should NOT be translated into Burmese.

This rule applies to all AI agents when producing `implementation_plan.md`, `walkthrough.md`, any technical roadmap artifacts, and any interactive UI dialogs.
