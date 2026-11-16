// Chart of weeks with commits to professional open source projects, used on /work/
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import { csv } from "https://cdn.jsdelivr.net/npm/d3-fetch@3/+esm";
import { autoType } from "https://cdn.jsdelivr.net/npm/d3-dsv@3/+esm";
import { min, max, range } from "https://cdn.jsdelivr.net/npm/d3-array@3/+esm";
import { timeYear, timeWeek } from "https://cdn.jsdelivr.net/npm/d3-time@3/+esm";

const [languages, data] = await Promise.all([
  csv("/data/projects-lang.csv", autoType),
  csv("/data/git-commits-work.csv", autoType),
]);
const languagesByProject = new Map(languages.map(d => [d.project, d.language]));

data.forEach(d => {
  d.date = new Date(d.date);
  d.week = timeWeek.floor(d.date);
});

const minWeek = timeWeek.floor(min(data, d => d.date));
const maxWeek = timeWeek.floor(max(data, d => d.date));

// Total commits per project per week
const commitsByWeek = new Map();
data.forEach(d => {
  const key = `${d.project}|${d.week.toISOString()}`;
  commitsByWeek.set(key, (commitsByWeek.get(key) || 0) + d.num_commits);
});
const weekData = Array.from(commitsByWeek, ([key, num_commits]) => {
  const [project, week] = key.split("|");
  return { project, week: new Date(week), num_commits, language: languagesByProject.get(project) };
});

// Projects ordered by first commit, most recent at the top
const projectFirstCommit = {};
data.forEach(d => {
  if (!projectFirstCommit[d.project] || d.week < projectFirstCommit[d.project]) {
    projectFirstCommit[d.project] = d.week;
  }
});
const projectsSorted = Object.keys(projectFirstCommit).sort(
  (a, b) => projectFirstCommit[b] - projectFirstCommit[a]
);

const yearStarts = range(minWeek.getFullYear(), maxWeek.getFullYear() + 1, 1).map(
  year => timeYear.floor(new Date(year, 0, 1))
);

const div = document.querySelector("#work-chart");
const chart = Plot.plot({
  color: { legend: true },
  marks: [
    Plot.dot(weekData, {
      x: "week",
      y: "project",
      fill: "language",
      fillOpacity: 0.5,
      r: 3,
      title: d => `Project: ${d.project}\nWeek: ${d.week.toISOString().split("T")[0]}\nCommits: ${d.num_commits}`
    }),
    Plot.ruleX(yearStarts, { stroke: "black", strokeWidth: 1, strokeOpacity: 0.5 })
  ],
  x: {
    type: "utc",
    domain: [yearStarts[0], maxWeek],
    ticks: yearStarts.filter(d => d.getFullYear() % 2 === 0),
    label: null,
  },
  y: { label: null, domain: projectsSorted },
  marginLeft: 110,
  marginTop: 30,
  width: Math.max(div.clientWidth, 700),
  height: projectsSorted.length * 28 + 60,
});
div.append(chart);
