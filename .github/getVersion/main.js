import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})
async function getPRName(page=1){
    const pulls = await octokit.pulls.list({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        state: "closed",
        base: process.env.GITHUB_BRANCHE,
        sort: "created",
        direction: "desc",
        per_page: 30,
        page: page,
    });

    let list = pulls.data
    .filter(pull => pull.merged_at !== null)
    .map(pull => pull.title)
    .reverse();
    if(pulls.data.length === 30) list = [...await getPRName(page+1), ...list];
    return list;
}

let list = await getPRName();

let br = 0;
let feat = 0;
let fix = 0;
for(const title of list){
    if(title.startsWith("[fix]"))fix++;
    else if(title.startsWith("[feat]"))feat++;
    else if(title.startsWith("[break]")){
        feat = 0;
        fix = 0;
        br++;
    }
}

console.log(br + "." + feat + "." + fix);
