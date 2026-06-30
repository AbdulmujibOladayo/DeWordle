# Contributing to DeWordle

Thanks for contributing to the Soroban migration.

## 📋 Critical First Step: Review Repository Maps
Before starting any work, **all contributors must review these two critical maps**:

1. **[Repository Surface Map](./docs/REPO_SURFACE_MAP.md)** - Defines our canonical maintained surfaces, transitional codebases, and legacy code. This will guide you to the correct code paths for your contributions.
2. **[Code Ownership & Reviewer Map](./docs/CODE_OWNERSHIP_MAP.md)** - Identifies the primary maintainers and fallback reviewers for every maintained surface. Use this to understand who will review your PR and which track owns the code you're modifying.

## 🏃‍♂️ Second Critical Step: Set Up Your Local Sandbox
After confirming you're working on a maintained surface, follow the complete [Local Sandbox Walkthrough](./docs/LOCAL_SANDBOX_WALKTHROUGH.md) to spin up your local development environment. This guide includes:
- Step-by-step infrastructure setup (Postgres, Docker)
- Soroban contract validation and testing
- Backend indexer setup and health verification
- Frontend wallet sandbox usage
- Common pitfalls and recovery steps

## Workstream Model
Contributors are encouraged to work in parallel across our **maintained canonical surfaces**:
- Soroban contracts (`soroban/contracts`)
- Shared crates (`soroban/crates`)
- SDK (`soroban/sdk/ts`)
- Frontend wallet integration (`frontend/src/lib/stellar`)
- Backend indexer (`backend/src/indexer`)
- Documentation and testing (`docs/`, `soroban/tests`)
- CI/CD & infrastructure (`/.github/workflows/`, `/scripts/`)

## Setup & Validation Commands
Use the appropriate validation commands for your surface to ensure you're running the correct tests:

### Maintained Surfaces (Always Passing in CI)
```bash
# Install all dependencies
npm run install:all

# Soroban contracts and crates
cd soroban && cargo check --workspace && cargo test --workspace

# Backend indexer (maintained backend surface)
cd backend && npm run lint:ci && npm run test:ci -- src/indexer/

# Frontend wallet and Soroban integration
cd frontend && npm run lint:ci && npm run test:ci -- src/lib/stellar src/lib/soroban

# Documentation and script validation
node scripts/contributor-bootstrap.test.js
```

### Transitional Surfaces (Critical Fixes Only)
```bash
# Only use if you're working on critical bug fixes for transitional code
cd backend && npm run start:dev  # Legacy backend development
cd frontend && npm run dev       # Legacy frontend development
```

### Legacy Surfaces (DO NOT USE)
The `/onchain/` directory contains outdated legacy code and is no longer maintained. PRs targeting these surfaces will be automatically redirected.

## PR Requirements
- Keep scope narrow and issue-linked.
- Identify the correct track in your PR description using the ownership map
- Assign yourself as the PR author and request review from the primary track maintainers
- Add docs for new architecture or APIs in the `/docs/` directory
- Include tests where behavior changes - all PRs must pass CI
- Follow the PR template and complete the checklist

## Wave Readiness
Use `docs/WAVE_MIGRATION_ISSUE_CANDIDATES.md` and `docs/SOROBAN_GITHUB_STRATEGY.md` for issue slicing and labels. Monitor reviewer load using:
```bash
node scripts/reviewer-load-heatmap.js
```