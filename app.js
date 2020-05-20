const auth =
  "563492ad6f917000010000011c280c95160745dc89b98290fc068a54";

const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
const more = document.querySelector(".more");
let page = 1;
let fetchLink;
let currentSearch;

//event listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
more.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}

const fetchApi = async (url) => {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
};

const generatePhotos = (data) => {
  data.photos.map((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <img src=${photo.src.large}></img>
    <div class="gallery-info">
    <p>${photo.photographer}</p>
    <a href=${photo.src.original}>Download</a>
    </div>
    `;
    gallery.appendChild(galleryImg);
  });
};

const curatedPhotos = async () => {
  fetchLink =
    "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);
  generatePhotos(data);
};
const searchPhotos = async (query) => {
  clear();
  let loader = `<div id="spinner" class="show"></div>`;
  document.querySelector(".gallery").innerHTML = loader;
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  document.querySelector(".gallery").innerHTML = "";
  generatePhotos(data);
};

const clear = () => {
  gallery.innerHTML = "";
  searchInput.value = "";
};

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePhotos(data);
}

curatedPhotos();
