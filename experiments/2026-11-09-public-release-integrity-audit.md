# OMX baseline v1 public-release integrity and checkpoint audit — 2026-11-09

## Result: metadata integrity verified; license, full privacy audit, and offsite checkpoint backup pending

This document records only independently inspected metadata and bounded QC; it contains no video stills, row-level motions, credentials, or private model weights. Dataset public visibility is not equivalent to data-use rights or robot safety approval.

### Public ZIP identity

- Public GitHub: https://github.com/Youngkwon-Lee/omx-baseline-v1 (Git LFS pointer on `main`).
- Public Hugging Face team release: https://huggingface.co/datasets/omx-baseline-team/omx-baseline-v1-20261109-public
- Hugging Face public repository revision at inspection: `91b10fb7a83c9eb7673155df57fb011b52908090`; public repo's **official LFS metadata SHA-256** is `749f5208874cfd1e1f2e98539a39d962464f401023f3b423963246593bfaa250`, 243,286,625 bytes.
- GitHub ZIP LFS pointer SHA-256 is the same value. ICT WSL directly hashed the local 243,286,625-byte `dataset.zip` and obtained the same SHA-256; `unzip -tq` reported no ZIP errors.
- Original private Hugging Face team and personal copies remain private. Cloud Google Drive backup file ID `1Pod4-XpJNLo17-V-rGfk-wgMoKkBugmD` reports the same filename and byte size and was listed `not_shared`. **Google Drive bytes were not re-downloaded and hashed.** Do not label that mirror independently content-verified.
- The public Hugging Face ZIP object is content-addressed by its LFS SHA; its complete bytes were not independently downloaded and hashed in a second client, so describe this as an **LFS metadata hash match**, not a second stream-hash.

### Direct ICT Parquet and camera metadata QC (read-only, no decoding of full video)

| Check | Direct result |
| --- | --- |
| `meta/info.json` reported episodes/frames/FPS | 50 / 14,644 / 30 |
| Parquet data rows | 14,644 |
| Episode metadata rows | 50 |
| Task metadata rows | 1 |
| Distinct episode indices in data | 50 |
| Rows per episode | 274–298 |
| Frame indices within each episode | contiguous from zero |
| Timestamp finiteness and monotonicity | pass in every episode |
| Median/max successive timestamp interval | 33.3333 / 33.3338 ms |
| `action` and `observation.state` | each `(14644,6)`, finite all, NaN count 0 |
| Top/Wrist camera video metadata | each AV1, 320×240, 14,644 frames, 30 FPS, 488.1333 s |

These are dataset-structure checks. **Action physical units, calibrated robot control semantics, camera/state exposure synchronization, representative task completion, data rights, and model effectiveness are not certified.** Full video decoding/quality review was not performed.

### Bounded visual privacy triage

A temporary contact sheet was generated on the authorized ICT host from **five positions in each of two camera streams** (2%, 20%, 45%, 70%, 95%; ten sampled frames total). The sampled frames showed a robot workspace, black-and-white workspace markers, and a blue target object; **no faces or personal-data screen content were visibly apparent in this limited sample**. This does not establish privacy clearance for the other video frames or prove release consent. Contact sheet and script were **task-only** and are not published in this repository. Full contributor/third-party/bystander rights and representative media review remain necessary.

### ACT research checkpoint (source data separate from real KOSA ROSbag diagnostic captures)

- Source experiment record: [2026-11-09 ICT ACT](2026-11-09-ict-act.md). Reported setup: LeRobot 0.6.1, 45 train / 5 held-out episodes, batch size 4, 1,000 steps on Quadro RTX 5000; published held-out loss at 1,000 steps **0.3713**, not a robot success rate. Loss was **not rerun** during this release QC.
- ICT checkpoint `001000` directly examined: `training_step.json` step `1000`; model weight file **206,699,736 bytes**, **234 tensors / 51,668,614 tensor values**, all metadata-only examination with `safetensors.safe_open` (not a tensor-value check).
- ICT checkpoint model `model.safetensors` SHA-256: `4ff5c35d627235c435d9672409d5b960250211b2ffebfcaff1f5a23e37d16aa2`.
- `config.json` SHA-256: `3264a0acb67edee92eaf58998847980513aded707a1e74a67bd91083494d35cb`.
- `train_config.json` SHA-256: `4191ee407108cbfa660d2b18b6a90fa61dc85c04fa04f3d90814bba966004b97`.
- `training_step.json` SHA-256: `441dfc8a44cc9768c846458e643485e013d0593538290c37192c29cfbb7a6b48`.
- Step 500 model SHA-256 is distinct: `661361d9393671428cec5083d1a75ecbf33f09de740f34e7b42bf64ae5ed733f`.
- **Offsite weight/optimizer backup NOT completed.** ICT device has the files, but an existing secure Mac→ICT SSH route was not reachable and neither connected Drive upload API nor Hugging Face CLI was authorized to read and upload the ICT-local binary. Do not claim the destination has model bytes.
- Private Google Drive **destination folder only** created and verified empty: https://drive.google.com/drive/folders/1tznmid_FUywb2Tc4y0090_fiIqsEU2zo (under the existing Physical AI Lab exchange `runs/` folder). Inheriting private/unshared metadata was verified at creation. This is staging, not backup completion.

### Publication and governance HOLD

- Project owner reported team publication agreement on 2026-11-09; individual rights and third-party video permissions were not independently audited.
- No explicit reuse license has been selected. GitHub/Hugging Face public visibility does **not** constitute licensing for reuse, training, resale, or model redistribution.
- The private model checkpoint must stay separate from public dataset and be backed up to a verified nonpublic destination with a complete checksum manifest (model, preprocessing, optimizer/training state) before it can be called durable.
- Physical OMX robot safety fault latch and camera time-alignment investigation are **separate** issues. No physical robot actuation, dataset-to-robot policy deployment, or system safety approval was performed by this audit.

### Reproduction and evidence boundary

Environment: existing ICT Windows/WSL Ubuntu 24.04 and established LeRobot research Python environment (PyArrow 26.0.1, PyAV 15.1.0, NumPy 2.2.6). All original data and checkpoints were read-only. A task-only contact-sheet image and scripts were created separately for internal inspection and must not be treated as public dataset artifacts. Verify fresh exact inputs before reusing these conclusions.
