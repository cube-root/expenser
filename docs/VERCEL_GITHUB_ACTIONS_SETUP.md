# Vercel production deployment from GitHub Actions

This public repository deploys production releases only through the manually triggered
`Release and deploy` GitHub Actions workflow. The application is not published to npm, and the
workflow does not create GitHub Release assets.

## 1. Create or import the Vercel project

Create the project in Vercel and configure the production environment variables listed in
`.env.example`. Add the production Auth.js callback URL to the Google OAuth client as described in
`docs/GOOGLE_CLOUD_SETUP.md`.

Under **Project Settings → Build and Deployment → Node.js Version**, select **24.x**. The repository
also declares `engines.node` as `24.x`, so GitHub Actions, Vercel builds, and Vercel Functions use
the same supported runtime. This replaces stale Node 16 settings that prevent new deployments.

If the repository is connected to Vercel's Git integration, disable its automatic production
deployment for `main` when this workflow should be the only deployment path. Otherwise a release
push and this workflow can create two production deployments.

## 2. Create a Vercel access token

1. Sign in to Vercel using the account that owns the project.
2. Open **Account Settings → Tokens**, or visit <https://vercel.com/account/tokens>.
3. Select **Create Token**.
4. Use a descriptive name such as `expenser-github-production`.
5. Scope the token to only the personal account or team that owns this project.
6. Choose an expiration period and create the token.
7. Copy it immediately. Do not put it in `.env`, source code, workflow YAML, issues, or logs.

Rotate the token periodically and immediately revoke it if it may have been exposed.

## 3. Find the Vercel organization and project IDs

From a trusted local checkout, authenticate and link the existing project:

```bash
npx vercel login
npx vercel link
```

Vercel writes `.vercel/project.json`. Copy these values:

```json
{
  "orgId": "value-for-VERCEL_ORG_ID",
  "projectId": "value-for-VERCEL_PROJECT_ID"
}
```

The `.vercel` directory is ignored by Git and must remain uncommitted. The IDs identify the deploy
target; the access token is the sensitive credential. This project stores all three as GitHub
environment secrets for consistent handling.

## 4. Create the protected GitHub environment

1. Open the GitHub repository.
2. Go to **Settings → Environments → New environment**.
3. Name it exactly `production`.
4. Restrict deployment branches to `main`.
5. For a public repository, adding a required reviewer is recommended so a release cannot access
   the Vercel token until someone approves the production job.
6. Under **Environment secrets**, add:

   | Secret | Value |
   |---|---|
   | `VERCEL_TOKEN` | Token created in step 2 |
   | `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

Never store these values as plaintext in the repository. Secrets are not supplied to workflows
from forked pull requests.

## 5. Allow the workflow to create the version commit and tag

Open **Settings → Actions → General → Workflow permissions** and select **Read and write
permissions**. The built-in `GITHUB_TOKEN` is used only to push the release-it version commit and
`vX.Y.Z` tag; no separate GitHub personal access token is required.

If a branch ruleset prevents GitHub Actions from pushing to `main`, explicitly allow the release
workflow or GitHub Actions app to bypass that rule. Keep normal pull-request protections enabled.

## 6. Run a production release

1. Merge the release changes into `main` and ensure the branch is green.
2. Open **Actions → Release and deploy**.
3. Select **Run workflow**.
4. Choose `patch`, `minor`, or `major`.
5. Approve the `production` environment when prompted.

The workflow checks that all Vercel secrets exist before release-it changes Git. It then validates
the application, bumps the version, pushes the commit and tag, and finally runs
`vercel deploy --prod --yes`. If validation or the Git push fails, deployment does not run.

## Token incident response

If the token is exposed:

1. Revoke it immediately from Vercel Account Settings → Tokens.
2. Create a replacement with the narrowest suitable account/team scope.
3. Replace only the `VERCEL_TOKEN` environment secret in GitHub.
4. Review recent Vercel deployments and GitHub Actions runs.
