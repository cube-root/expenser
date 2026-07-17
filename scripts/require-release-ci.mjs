if (process.env.GITHUB_ACTIONS !== 'true') {
  console.error('Production releases must run from the GitHub Actions release workflow.');
  process.exit(1);
}
