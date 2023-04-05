import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayAPI from './pixabay-api';
import cardMarkup from './cardMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

formEl.addEventListener('submit', onFormElSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);
let galleryLightbox = new SimpleLightbox('.gallery .card-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

function onFormElSubmit(event) {
  event.preventDefault();
  pixabayAPI.query = event.target.elements.searchQuery.value;
  pixabayAPI.page = 1;
  loadMoreBtn.classList.remove('hidden');

  if (pixabayAPI.query === '') {
    Notify.warning('You entered an empty request, please check your input');
    return;
  }

  pixabayAPI
    .fetchPhotos()
    .then(({ data }) => {
      pixabayAPI.hitsCounter = pixabayAPI.hits;
      galleryEl.innerHTML = cardMarkup(data.hits);
      galleryLightbox.refresh();
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtn() {
  pixabayAPI.page += 1;
  pixabayAPI
    .fetchPhotos()
    .then(({ data }) => {
      if (data.totalHits / pixabayAPI.hitsCounter <= 1) {
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.classList.add('hidden');
      }
      galleryEl.insertAdjacentHTML('beforeend', cardMarkup(data.hits));
      galleryLightbox.refresh();
    })
    .catch(error => console.log(error));
}

// loadMoreBtn.classList.add('hidden');
// pixabayAPI.hits = pixabayAPI.hitsCounter - data.totalHits;
// console.log(`hits: ${pixabayAPI.hits}`);
// pixabayAPI.hitsCounter += pixabayAPI.hits;

// console.log(data);

// console.log(`totalHits: ${data.totalHits}`);
// console.log(`hits: ${pixabayAPI.hits}`);
// console.log(`counter: ${pixabayAPI.hitsCounter}`);
// console.log(data.hits);
