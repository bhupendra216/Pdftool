# Ask PDF AI evaluation

The browser test `src/labs/ask-pdf-ai/fixtures.browser.test.ts` generates three small PDFs in memory using invented text and pdf-lib. No model is loaded by CI.

## Fixture 1: Northwind Grove leave policy

Pages: 1–2. Facts: annual leave is 15 days; emergency leave is 3 days; carry-over is capped at 5 days; planned leave requests are due 7 days in advance; emergency requests may be made the same day.

| # | Question | Expected page(s) or response |
|---|---|---|
| 1 | How many annual leave days are available, and how early should a planned request be sent? | Pages 1–2 |
| 2 | What is the price of a normal day off? | Not found; the document gives no price or cost |
| 3 | How many emergency days are available? | Page 1 |
| 4 | What is the maximum balance that can roll over? | Page 1 |
| 5 | When is an ordinary vacation request due? | Page 2 |
| 6 | Can an urgent request be submitted on the day it is needed? | Page 2 |
| 7 | What is the carry-forward cap in days? | Page 1 |
| 8 | Compare the annual and emergency leave allowances. | Page 1 |
| 9 | Who should receive the request? | Page 2 |
| 10 | Does the policy state a fee for taking leave? | Not found |

## Fixture 2: Willow Research quarterly report

Pages: 1–3. Page 2 contains a table-like text section: Cedar has 12 samples and 4 clear results; Lake has 18 samples and 9 clear results; Ridge has 10 samples and 6 clear results. Page 3 says Cedar added 8 samples in autumn and recommends a Lake follow-up next spring.

| # | Question | Expected page(s) or response |
|---|---|---|
| 1 | How many samples were collected at Lake? | Page 2 |
| 2 | What was the clear-result count at Ridge? | Page 2 |
| 3 | Which site had the highest number of samples? | Page 2 |
| 4 | How many clear results did Cedar record? | Page 2 |
| 5 | What was the price or cost of the Lake follow-up? | Not found |
| 6 | How many extra Cedar samples were added in autumn? | Page 3 |
| 7 | Which site is recommended for another study, and in what season? | Page 3 |
| 8 | How many samples were there at Cedar before the autumn addition? | Page 2 |
| 9 | How many total Cedar samples were recorded after the autumn addition? | Pages 2–3 |
| 10 | Compare Lake's sample count with Ridge's. | Page 2 |

## Fixture 3: Orchard Relay public note

Pages: 1–2. Facts: the project meeting was on 14 May; the project tracks seedling survival by garden bed and publishes a short monthly note.

| # | Question | Expected page(s) or response |
|---|---|---|
| 1 | When was the meeting? | Page 1 |
| 2 | What does Orchard Relay track? | Page 2 |
| 3 | How often is a public note published? | Page 2 |
| 4 | What price was paid for the project? | Not found |
| 5 | What date was the meeting held? | Page 1 |
| 6 | Does the note name a project director? | Not found |
| 7 | What unit or grouping is used to track seedling survival? | Page 2 |
| 8 | What was the attendance at the meeting? | Not found |
| 9 | Does this document state a budget or cost? | Not found |
| 10 | What month did the project meeting take place? | Page 1 |

## Manual evaluation notes

Run each answer mode separately: keyword search first, then smart search after opting in, then generation on a WebGPU device. Compare cited pages with the expected pages; do not score an answer correct unless the supporting passage is visible and the page citation is valid.
