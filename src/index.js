import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayAPI from './pixabay-api';
import cardMarkup from './cardMarkup';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const pixabayAPI = new PixabayAPI();

formEl.addEventListener('submit', onFormElSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onFormElSubmit(event) {
  event.preventDefault();
  pixabayAPI.query = event.target.elements.searchQuery.value;
  pixabayAPI.page = 1;
  loadMoreBtn.classList.remove('hidden');

  if (pixabayAPI.query === '') {
    Notify.warning('Вы ввели пустой запрос, проверьте правильность ввода');
    return;
  }

  pixabayAPI.fetchPhotos().then(({ data }) => {
    pixabayAPI.hitsCounter = pixabayAPI.hits;

    console.log(data);

    console.log(`totalHits: ${data.totalHits}`);
    console.log(`hits: ${pixabayAPI.hits}`);
    console.log(`counter: ${pixabayAPI.hitsCounter}`);
    console.log(data.hits);

    galleryEl.innerHTML = cardMarkup(data.hits);
  });
}

function onLoadMoreBtn() {
  pixabayAPI.page += 1;
  pixabayAPI.hitsCounter += pixabayAPI.hits;

  pixabayAPI.fetchPhotos().then(({ data }) => {
    if (data.totalHits / pixabayAPI.hitsCounter <= 1) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    console.log(`totalHits: ${data.totalHits}`);
    console.log(`hits: ${pixabayAPI.hits}`);
    console.log(`counter: ${pixabayAPI.hitsCounter}`);
    console.log(data.hits);

    galleryEl.insertAdjacentHTML('beforeend', cardMarkup(data.hits));
  });
}
