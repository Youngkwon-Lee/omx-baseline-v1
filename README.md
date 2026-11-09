# OMX baseline v1 — robot imitation-learning demonstration dataset

**Publication:** This GitHub repository is **public**. The project owner reported on 2026-11-09 that the contributing team agreed to publish this OMX demonstration archive. This records the owner's report, **not an independently checked consent or IP-rights agreement**. A formal dataset reuse license has **not yet been selected**. Public access alone does not grant unrestricted redistribution, modification or commercial-use rights.

## Dataset description

The archive was provided by a team member. Its `meta/info.json` records:

| Field | Value |
| --- | --- |
| Robot | `omx_follower` |
| Episodes | 50 |
| Frames | 14,644 |
| Nominal video/data rate | 30 FPS |
| Action and observation state | Six `float32` joint-position channels each |
| Video streams | `observation.images.top`, `observation.images.wrist` |
| Video metadata | 320×240, AV1, `yuv420p` |
| LeRobot dataset `codebase_version` | `v3.0` |
| Other formats | Parquet, episode/task metadata, summary statistics |

The ZIP contains exactly seven files beneath the dataset root: `meta/info.json`, `meta/tasks.parquet`, `meta/stats.json`, `meta/episodes/chunk-000/file-000.parquet`, `data/chunk-000/file-000.parquet`, and two camera MP4s. This collection is **distinct** from the KOSA ROSbag diagnostic episodes.

## Archive identity and verification

- **Name:** `omx_baseline_v1_20261109_161022-20261109T072845Z-1-001.zip`
- **Size:** 243,286,625 bytes
- **SHA-256:** `749f5208874cfd1e1f2e98539a39d962464f401023f3b423963246593bfaa250`
- **Git storage:** Git LFS. The checked-in small ZIP pointer is not the ZIP itself.
- **Checked 2026-11-09:** The ICT local ZIP passed `unzip -t` and its computed SHA-256 exactly matched the GitHub LFS pointer. Google Drive and private Hugging Face copies have the same name and byte size, but their remote bytes were **not independently downloaded and rehashed**.

### Retrieve and verify

```bash
git clone https://github.com/Youngkwon-Lee/omx-baseline-v1.git
cd omx-baseline-v1
git lfs pull
sha256sum omx_baseline_v1_20261109_161022-20261109T072845Z-1-001.zip
unzip -t omx_baseline_v1_20261109_161022-20261109T072845Z-1-001.zip
```

Compare the SHA-256 above before extracting. Preserve the original ZIP unchanged.

## Research results and limits

The [2026-11-09 ICT ACT training record](experiments/2026-11-09-ict-act.md) describes LeRobot 0.6.1 ACT training with 45 training episodes, 5 held-out episodes, batch size 4 and 1,000 steps on a Quadro RTX 5000. The final reported held-out loss was **0.3713**, evaluated on up to 200 samples. The ICT run's `001000` checkpoint and `training_step.json` were independently found/read.

This is **offline validation loss, not a physical robot task success rate**. Model weights, optimizer state and the training environment are not contained in this public repository. Task definition, action units, capture synchronization, episode quality, train-only normalization and independent evaluation require further validation.

## Publication versus permission

- Team publication agreement: reported by the project owner on 2026-11-09. Original individual rights/consent and any third-party/bystander permissions have not been independently documented here.
- **Dataset license: not yet specified.** No MIT, Apache or Creative Commons terms should be assumed.
- For external reuse, derivatives, commercial applications or model redistribution, confirm terms with the maintainer and relevant contributors.
- The archive contains camera videos. Review for people, screens, logos and incidental information before further distribution.
- Publication and offline ACT training do **not** authorize robot hardware deployment.

## Source-of-truth separation

This public GitHub repository stores the large data through Git LFS and the research receipt; the broader code and safety SSOT remains [physical-ai-lab](https://github.com/Youngkwon-Lee/physical-ai-lab). The two original Hugging Face dataset mirrors are **private staging copies** until their visibility is independently changed and verified. Do not overwrite them or treat same-size archives as independently hash-verified.

**Next release steps:** Agree on a specific reuse license, approve a provenance/dataset card and a video privacy review, verify public artifact access from an independent client, and decide whether the team Hugging Face staging repository or a distinct public release should be the canonical dataset endpoint.
