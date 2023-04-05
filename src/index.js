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

async function onFormElSubmit(event) {
  event.preventDefault();
  pixabayAPI.query = event.target.elements.searchQuery.value;
  pixabayAPI.setFirstPage();

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (!pixabayAPI.query) {
      galleryEl.innerHTML = '';
      loadMoreBtn.classList.add('hidden');
      throw new Error();
    }

    if (data.hits.length !== 0) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (data.hits.length === 0) {
      galleryEl.innerHTML = '';
      loadMoreBtn.classList.add('hidden');
      throw new Error();
    }

    event.target.elements.searchQuery.value = '';
    loadMoreBtn.classList.remove('hidden');
    pixabayAPI.hitsCounter = pixabayAPI.hits;
    galleryEl.innerHTML = cardMarkup(data.hits);
    galleryLightbox.refresh();
  } catch (error) {
    console.log(error);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function onLoadMoreBtn() {
  pixabayAPI.setNextPage();
  pixabayAPI.hitsCounter += pixabayAPI.hits;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (data.totalHits / pixabayAPI.hitsCounter <= 1) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('hidden');
    }

    galleryEl.insertAdjacentHTML('beforeend', cardMarkup(data.hits));
    galleryLightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}
