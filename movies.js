import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

const url = new URL("https://www.omdbapi.com/");
url.searchParams.append("t", "Game of Thrones");
url.searchParams.append("season", "8");
url.searchParams.append("apikey", process.env.APIKEY);

console.log(url.href);

/** @type {OmdbData} */
const data = await fetch(url)
  .then((res) => res.json())
  .catch(console.error)
  .then((data) => data)
  .catch(console.error);

let html = `<head>
<style>
table {
  font-family: sans-serif;
}
table, td, th {
  border: 1px solid black;
  border-collapse: collapse;
}
thead {
  background-color: lightgray;
}
th,td {
  font-size: 18px;
  padding: 0.25em;
}
</style>
<head>
<body>
  <table>
    <caption>${data.Title} - Season ${data.Season}</caption>
    <thead>
      <tr>
        <th>Title</th>
        <th>Released</th>
        <th>Episode</th>
        <th>IMDb Rating</th>
        <th>IMDb ID</th>
      </tr>
    </thead>
    <tbody>`;

html += data.Episodes.map((ep) => {
  console.log(`#${ep.Episode}: ${ep.Title}`);
  const row = `
      <tr>
        <td>${ep.Title}</td>
        <td>${ep.Released}</td>
        <td>${ep.Episode}</td>
        <td>${ep.imdbRating}</td>
        <td><a href="https://www.imdb.com/title/${ep.imdbID}" rel="noopener noreferrer" target="_blank">${ep.imdbID}</a></td>
      </tr>`;
  return row;
}).join("");

html += `
    </tbody>
  </table>
  <pre>
  ${JSON.stringify(data, null, 2)}
  </pre>
</body>`;

app.get("/", (req, res) => {
  res.send(html);
});

app.all("*", (req, res) => res.status(404).end());
app.listen(PORT, () => console.log("http://localhost:" + PORT));

/**
 * @typedef {Object} OmdbData
 * @property {string} Title
 * @property {string} Season
 * @property {string} totalSeasons
 * @property {OmdbEpisode[]} Episodes
 *
 * @typedef {Object} OmdbEpisode
 * @property {string} Title
 * @property {string} Released
 * @property {string} Episode
 * @property {string} imdbRating
 * @property {string} imdbID
 */
