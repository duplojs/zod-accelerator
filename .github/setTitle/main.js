import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    pull_number: process.env.GITHUB_PULL_NUMBER,
    title: "[publish] " + process.env.VERSION,
})
