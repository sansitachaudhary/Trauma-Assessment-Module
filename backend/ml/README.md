# SAHYOG AI — Experimental ML Pipeline

## Scope and safety

The optional `/api/v1/ml/predict` endpoint runs a research classifier for the
DAIC-WOZ `PHQ8_Binary` label. The output is not a trauma or PTSD diagnosis, a
clinical risk assessment, or a replacement for trained human review.

ML predictions are returned to the caller only. They are not written to
`Assessment.svi`, complaint `rule_based_score`, or another assessment field.
Those fields remain part of the separate rule-based workflow and must not be
interpreted as ML output.

## Dataset and provenance

The local metadata contains the official DAIC-WOZ train and development split
files. The prepared training file has 107 unique participant rows, matches the
107 IDs in the official training metadata, and has no participant overlap with
the 35-person development split. The current prepared file has PHQ8_Binary
label counts of 77 class-0 and 30 class-1 training participants; the development
metadata has 23 class-0 and 12 class-1 participants.

The repository does not contain a dataset license, signed access agreement,
or record of approval for this specific use. The official
[DAIC-WOZ data page](https://dcapswoz.ict.usc.edu/) says access requires an
application and signed submission, and distribution is limited to academic and
other non-profit researchers because of consent constraints. Verify the
project's approval and permitted uses before sharing or redistributing any
dataset, derived participant-level output, or model.

The transcript and prepared-data directories are excluded from Git. Do not add
restricted transcripts, participant-level predictions, or identifiers to
source control, test output, or logs.

## Training and evaluation evidence

`training/train.py` defines a word TF-IDF (1–2 grams) and Logistic Regression
pipeline (`max_iter=1000`, random seed 42, class weight `balanced` by default).
It uses an 80/20 stratified row split, evaluates before refitting on all rows,
and does not include development participants in the final fit when given the
prepared training file described above. Since that file has one row per
participant, the split separates participants for this dataset. The generic
training function does not itself enforce participant grouping or validate
the dataset's source.

`evaluation/compare_dev_models.py` compares candidate models on the development
split. That means the development split has been used for model comparison and
is not an untouched final test set. The stored development comparison is a
historical comparison and is not a reproducible metric report for the current
artifact. There is no separate untouched test set or artifact-linked metric
manifest in the repository. Do not claim current-model performance from those
files.

The `.joblib` artifact is a local, Git-ignored file. No repository-side
provenance manifest ties it to a dataset hash, training command, hyperparameters,
or evaluation results; its embedded metadata has not been independently
verified. The source training code documents the pipeline, but the exact
training run for the local artifact cannot be verified from repository metadata
alone.

## Running the pipeline

- Prepare participant-only transcripts using
  `preprocessing/prepare_dataset.py`.
- Train with `training/train.py` using an approved dataset split.
- Evaluate only after confirming the data provenance and participant split.
- Do not emit participant IDs or per-participant predictions in console output.
- Keep ML predictions separate from rule-based complaint and assessment
  scores.

All model outputs are experimental research artifacts. They are not clinically
validated and must not be used autonomously for decisions about care,
intervention, or case closure.
