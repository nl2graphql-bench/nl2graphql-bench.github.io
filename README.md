# nl2graphql-bench.github.io

Source for the [NL2GraphQL Bench leaderboard](https://nl2graphql-bench.github.io/).

A static site: plain HTML, CSS and JavaScript, no build step and no framework.
GitHub Pages serves `main` directly, so a merge to `main` publishes.

## Layout

| path | what |
|---|---|
| `index.html` | the whole page; every section lives here |
| `js/data.js` | leaderboard rows, corpus composition, category and domain distributions |
| `js/app.js` | renders the tables, filters, category breakdown and the compare view |
| `css/style.css` | all styling, with the design tokens on `:root` |
| `dataset/sample_instance.json` | one worked example, linked from the dataset section |
| `AutoGraphQL.pdf` | the paper |
| `.github/ISSUE_TEMPLATE/` | the leaderboard submission form |

## Running it locally

```bash
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>. Opening `index.html` as a `file://` URL also
mostly works, but serving it over HTTP matches what Pages does.

## Changing the leaderboard

Numbers come from `js/data.js`, not from a database. `LEADERBOARD_ENTRIES` is a
list of objects, one per row:

```js
{
  id: "llama-3.1-8b-a",
  model: "Llama-3.1-8B-Instruct",
  setting: "Fine-tuned · LoRA A (lr 1e-4)",
  params: "8B", paramsB: 8,
  sizeBucket: "small",        // "small" (<20B) or "large" (>=20B / closed)
  weightClass: "open",        // "open" or "closed"
  aliases: 31.97, directives: 20.08, extFragments: 28.50,
  inlineFragments: 28.65, filters: 67.60, pagination: 71.75,
  mutations: 87.45, overall: 42.57,
}
```

All seven category keys are required; the category breakdown and the compare
radar both read them. Rows render in the order given, so keep the list sorted by
`overall` descending.

The current values are transcribed from the paper's tables, which the file states
at the top. They are not regenerated from a scoring run.

## Related repositories

| | |
|---|---|
| [index](https://github.com/nl2graphql-bench/index) | start here: links every component |
| [datasets](https://github.com/nl2graphql-bench/datasets) | training set and public benchmark, MIT |
| [generation](https://github.com/nl2graphql-bench/generation) | AutoGraphQL, the framework that built the corpus |
| [evaluation](https://github.com/nl2graphql-bench/evaluation) | RGEval, the scorer behind the numbers here |

## Submitting a model

Open a [Leaderboard submission](https://github.com/nl2graphql-bench/nl2graphql-bench.github.io/issues/new?template=leaderboard_submission.yml)
issue. The form asks for the model name, weight class, parameter count, method,
per-category scores on the public benchmark, a predictions file, a link to code
or weights or a paper, and a contact address.

Score with [evaluation](https://github.com/nl2graphql-bench/evaluation) so your
number and ours are produced the same way. We then score the submission against
the 2,100-instance hidden benchmark before posting a headline figure.

The hidden benchmark is not released. It is what submissions are scored against,
so if it were public a model could be tuned on it and the score would mean
nothing.

## License

MIT, see `LICENSE`. `NOTICE` records that the licence and copyright notice carry
forward from the StepZen NL2GQL project.
