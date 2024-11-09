//config
const APIKey = "a518c27f689264120fee0a0b16a8cb34";

const imgApi = "https://image.tmdb.org/t/p/w1280";

const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query= `;

// connect to the html elements and bring them inside JS objects
const form = document.getElementById("search-form");

const query = document.getElementById("search-input");

const result = document.getElementById("result");

// functions for logic processing
let page = 1;
let isSearching = false;

// get the JSON data to be dispayed on initial page load
// 1. fetch()  2. axios() methods
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Something went wrong. Check url or server status");
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

//show the results based on the fetch operation
async function fetchAndShowResult(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    showResults(data.results); // we have to define this function
  }
}

// create the movie cards to display
function createMovieCard(movie) {
  // destructure the movie object
  const { poster_path, original_title, release_date, overview } = movie; // in this line we can access the title, date, etc instead of writing it out one by one
  //movie.release_date
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg "; //taking and assigning default image if the image is not availalbe in the server poster_path

  // reduce the size of the movie title if it is too big
  const truncatedTitle =
    original_title.length > 15
      ? original_title.slice(0, 15) + "..."
      : original_title;

  // check if release date info is present or not
  const formattedDate = release_date || "No release date availalbe";

  // building the movie card html
  const cardTemplate = `
    <div class="column">
        <div class="card">
            <a class="card-media" href="./img-01.jpeg">
                <img src="${imagePath}" alt="${original_title}" width="100%" />
            </a>
            <div class="card-content">
                <div class="card-header">
                    <div class="left-content">
                        <h3 style="font-weight: 600">${truncatedTitle}</h3>
                        <span style="color: #12efec">${formattedDate}</span>
                    </div>
                    <div class="right-content">
                        <a href="${imagePath}" target="_blank" class="card-btn"> See Cover </a>
                    </div>
                </div>
                <div class="info">
                    ${overview || "No overview available..."}
                </div>
            </div>
        </div>
    </div>
  `;
  return cardTemplate;
}

// clear any content for search purposes
function cleaResult() {
  result.innerHTML = ""; //the moment we set it to empty......
}

// display reuslts on the page
function showResults(item) {
  const newContent = item.map(createMovieCard).join("");
  result.innterHTML += newContent || "<p> No results found. Search again. </p>";
}

// Load more results
async function loadMoreResults(params) {
  if (isSearching) {
    return;
  }
  page++;
  const searchTerm = query.value;
  const url = searchTerm
    ? `${searchURL}${searchTerm}&page={page}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=%{page}`;

  await fetchAndShowResult(url);
}

//create a function that detects the end of a given page for the scrollbar
function detectEnd() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMoreResults();
  }
}

// handle the search operation itself
// The form element -- this is an endpoint to the server side operations
// e is the event parameter

async function handleSearchEvent(e) {
  console.log(`debug: inside the handle search function`);

  // what to do when a form is submitted
  e.preventDefault(); // every time you click on the submit button in respect to the form it will reset the whole page, if you dont want to reset the form then include this code
  const searchTerm = query.value.trim();
  console.log(`Input term by the user ${searchTerm}`);

  if (searchTerm) {
    isSearching = True;
    cleaResult();
    const newURL = `${searchURL}${searchTerm}&page=${page}`;
    await fetchAndshowResults(newURL);
    query.value = ""; // will reset the input field if the user wants to provide a new search into the input field
  }
}

// create event listeners and associate them to the function logic to be executed when detected on the page
// note - while specifying/calling the function here, we do nt include the first brackets.
// function calls

form.addEventListener("submit", handleSearch);
window.addEventListener("Scroll", detectEnd);
window.addEventListener("resize", detectEnd);

// init function for the whole UI - similar to the main function of our program
async function init() {
  clearResults();

  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=%{page}`;
  isSearching = False;
  await fetchAndshowResult(url);
}

//start your program on page load

init();
