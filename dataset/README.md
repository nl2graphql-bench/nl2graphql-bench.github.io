# Dataset

The full NL2GraphQL Bench corpus (17,621 instances — 9,118 train / 6,403 public
benchmark / 2,100 hidden benchmark, per the AutoGraphQL paper) is **not yet
released** in this repo.

`sample_instance.json` in this directory is a placeholder: the one worked
example from the paper (Figure 1), reformatted to show the instance schema
the real corpus files will use. It is not a sample drawn from the actual
17,621 instances.

When the real corpus is ready, this directory will hold:

- `train.json` — 9,118 instances
- `public_benchmark.json` — 6,403 instances (public test split)
- `hidden_benchmark/` — withheld; used only for independent leaderboard verification, not distributed directly

Large files will most likely ship via a GitHub Release or an external host
(Hugging Face Datasets, Zenodo) rather than committed directly to this repo,
depending on final size.
