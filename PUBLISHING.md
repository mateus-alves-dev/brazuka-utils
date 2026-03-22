# Publishing Guide

This guide explains how to publish new versions of brazuka-utils to npm.

## Prerequisites

1. **npm Account**: You must have an account on [npmjs.com](https://www.npmjs.com/)
2. **npm Token**: Generate an automation token with `read` and `publish` permissions
3. **GitHub Secret**: Add the token to GitHub repository secrets as `NPM_TOKEN`

## One-Time Setup

### 1. Generate npm Token

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Navigate to Settings → Access Tokens
3. Click "Generate New Token" → Select "Automation"
4. Copy the generated token (you won't see it again)

### 2. Add GitHub Secret

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste the token from step 1
6. Click "Add secret"

## Publishing a New Version

Our project uses [Changesets](https://github.com/changesets/changesets) for semantic versioning.

### Step 1: Create a Changeset

Before opening a PR, create a changeset to describe your changes:

```bash
pnpm changeset
```

This will:
- Ask you which packages changed (select `brazuka-utils`)
- Ask for bump type: **patch** (bug fixes), **minor** (new features), or **major** (breaking changes)
- Ask you to describe the changes

Commit the changeset file (in `.changeset/`) to your PR.

### Step 2: Merge to Main

1. Open a PR with your changes + changeset
2. Tests will run automatically (CI workflow)
3. Once approved, merge the PR to `main`

### Step 3: Automated Publishing

The `publish.yml` workflow will automatically:

1. Create a "Version Packages" PR that bumps versions and updates CHANGELOG.md
2. Merge that PR → triggers the publish workflow
3. The workflow publishes the new version to npm automatically

**No manual npm publish needed!** The entire process is automated.

## Semantic Versioning

- **patch** (0.1.1 → 0.1.2): Bug fixes, internal refactors
- **minor** (0.1.1 → 0.2.0): New features, new functions, non-breaking additions
- **major** (0.1.1 → 1.0.0): Breaking API changes

## Workflow Files

- **`.github/workflows/ci.yml`**: Runs on every PR - linting, tests, build
- **`.github/workflows/publish.yml`**: Runs on merge to main - handles versioning and npm publishing

## Troubleshooting

### Workflow Fails with "npm ERR! 401 Unauthorized"

- Verify `NPM_TOKEN` is added to GitHub secrets
- Ensure the token has `publish` permission (not just `read`)
- Check that the secret name is exactly `NPM_TOKEN`

### Need to Publish Manually

```bash
# Build the library
pnpm build

# Publish to npm
npm publish dist/
```

## Questions?

Refer to:
- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
