import axios from 'axios';

export default class PixabayAPI {
  #API_KEY = '33457552-f72b8f2d874a669f815eb264f';
  #BASE_URL = 'https://pixabay.com/api/';

  page = 1;
  query = null;

  hits = 40;
  hitsCounter = this.hits;

  async fetchPhotos() {
    try {
      return await axios.get(this.#BASE_URL, {
        params: {
          q: this.query,
          page: this.page,
          per_page: this.hits,
          key: this.#API_KEY,
          orientation: 'horizontal',
          image_type: 'photo',
          safesearch: true,
        },
      });
    } catch (error) {}
  }

  setNextPage() {
    this.page += 1;
  }

  setFirstPage() {
    this.page = 1;
  }
}
