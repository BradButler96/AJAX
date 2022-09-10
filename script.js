"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $episodesList = $("#episodes-list");
const $searchForm = $("#search-form");
const $searchQuery = $("#search-query")
const showList = [];
let episodeList;

async function getShowsByTerm(searchVal) {
    searchVal = $($searchQuery).val()
    const res = await axios.get('https://api.tvmaze.com/search/shows?q=' + searchVal);
    
    for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].show.image !== null) {
            let show = {
                id: res.data[i].show.id,
                name: res.data[i].show.name,
                summary: res.data[i].show.summary,
                image: res.data[i].show.image.medium
            }
            showList.push(show);
        } else {
            let show = {
                id: res.data[i].show.id,
                name: res.data[i].show.name,
                summary: res.data[i].show.summary,
                image: 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
            }
            showList.push(show);
        }
    }
}

function populateShows(shows) {
    $showsList.empty();

    shows = showList;

    for (let show of shows) {
      const $show = $(

        `<div data-show-id="${show.id}" class="card" style="display: block; width: 35rem; margin: 0.5rem;">

          <img class="card-img-top" src="${show.image}" alt="Card image cap">

          <div class="card-body">
            <h5 class="text-primary">${show.name}</h5>

            <div id="${show.id}-summary"><small>${show.summary}</small></div>

            <button 
            class="btn btn-outline-primary btn-sm Show-getEpisodes" 
            style="margin-bottom: 0.75rem;" 
            onclick="
            getEpisodesOfShow(${show.id})

            
            ">Episodes</button>

            <section  id="${show.id}-episodes-area" style="display: none">
              <h5 class="text-primary">Episodes</h5> 
              <ul id="${show.id}-episodes-list">
              </ul>
            </section>  
          </div>
        </div>`
        );
    $showsList.append($show);  
  }
}

async function searchForShowAndDisplay() {
    const term = $("#searchForm-term").val();
    const shows = await getShowsByTerm(term);
  
    // $episodesArea.hide();
    populateShows(shows);
}
  
$searchForm.on("submit", async function (evt) {
    evt.preventDefault();
    await searchForShowAndDisplay();
});
  
   async function getEpisodesOfShow(id) { 
    episodeList = [];
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    const episodes = res.data;

    for (let episode of episodes) {
      let episodeObj = {
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number:episode.number
      }
      episodeList.push(episodeObj);
    }
    populateEpisodes(id, episodeList)
}
  
function populateEpisodes(showID, episodes) { 
  $(`#${showID}-episodes-area`).toggle();
  // Display episode area

  let show = $(`#${showID}-episodes-list`)

  for (let episode of episodes) {
    const $episodes = $(
      `<li id="${episode.id}">
        ${episode.name} (S: ${episode.season} E: ${episode.number})
      </li>`
    );
    // Create li containing episode info
    show.append($episodes);
    // append episode li to episode list ul
  }
}
