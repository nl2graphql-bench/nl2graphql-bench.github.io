# Dataset

The full AutoGraphQL corpus contains 17,621 instances: 9,118 training,
6,403 public benchmark, and 2,100 hidden benchmark. The paper commits to
releasing the training and public-benchmark splits (15,521 instances) under
the MIT License, but those files are **not yet present** in this repository.

`sample_instance.json` in this directory is a placeholder: the one worked
example from the paper (Figure 1), reformatted to show the instance schema
the real corpus files will use. It is not a sample drawn from the actual
17,621 instances.

When the public release is ready, this directory (or a linked release host) will provide:

- `train.json` — 9,118 instances
- `public_benchmark.json` — 6,403 instances (public test split)

The 2,100-instance hidden benchmark will remain private and will not be added
to this repository.

Large files will most likely ship via a GitHub Release or an external host
(Hugging Face Datasets, Zenodo) rather than committed directly to this repo,
depending on final size.
