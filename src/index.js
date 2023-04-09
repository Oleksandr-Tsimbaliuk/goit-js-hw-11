import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import cardMarkup from './cardMarkup';
import PixabayAPI from './pixabay-api';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const checkBox = document.querySelector('input[type="checkbox"]');
const loaderEllips = document.querySelector('.loader-ellips');

const pixabayAPI = new PixabayAPI();
let isDataRecived = false;
let galleryLightbox = new SimpleLightbox('.gallery .card-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

checkBox.addEventListener('change', checkBoxSelected);
formEl.addEventListener('submit', onFormElSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onFormElSubmit(event) {
  event.preventDefault();
  pixabayAPI.query = event.target.elements.searchQuery.value;
  pixabayAPI.setFirstPage();

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    ceckTotalHits(data);

    if (!pixabayAPI.query) {
      galleryEl.innerHTML = '';
      loadMoreBtn.style.display = 'none';
      loaderEllips.style.display = 'none';
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
  if (isDataRecived) {
    return;
  }

  isDataRecived = true;
  pixabayAPI.setNextPage();
  pixabayAPI.hitsCounter += pixabayAPI.hits;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    ceckTotalHits(data);

    galleryEl.insertAdjacentHTML('beforeend', cardMarkup(data.hits));
    smoothScroll();
    galleryLightbox.refresh();

    isDataRecived = false;
  } catch (error) {
    console.log(error);
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function checkBoxSelected() {
  window.addEventListener('scroll', onWindowScroll);
}

function onWindowScroll() {
  loadMoreBtn.classList.add('hidden');
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 10 &&
    checkBox.checked &&
    !isDataRecived
  ) {
    onLoadMoreBtn();
  }
  if (!checkBox.checked) {
    window.removeEventListener('scroll', onWindowScroll);
    loaderEllips.style.display = 'none';
    loadMoreBtn.style.display = 'block';
  }
  if (checkBox.checked) {
    loaderEllips.style.display = 'block';
    loadMoreBtn.style.display = 'none';
  }
}

function ceckTotalHits(data) {
  if (data.totalHits / pixabayAPI.hitsCounter <= 1) {
    loadMoreBtn.style.display = 'none';
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

//  console.log(`totalHits: ${data.totalHits}`);
//  console.log(`hits: ${pixabayAPI.hits}`);
//  console.log(`counter: ${pixabayAPI.hitsCounter}`);
//  console.log(data.hits);
