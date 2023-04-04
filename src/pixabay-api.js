import axios from 'axios';
// https://pixabay.com/api/?key={ KEY }&q=yellow+flowers&image_type=photo

export default class PixabayAPI {
  #API_KEY = '33457552-f72b8f2d874a669f815eb264f';
  #BASE_URL = 'https://pixabay.com/api/';
  // OPTIONS ='q=cat&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=5';

  query = '';
  image_type = 'photo';
  orientation = 'horizontal';
  safesearch = true;
  page = 1;
  hits = 40;
  hitsCounter = this.hits;

  fetchPhotos() {
    const url = `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
      this.query
    }&image_type=${this.image_type}
    &orientation=${this.orientation}&safesearch=${this.safesearch}&page=${
      this.page
    }
    &per_page=${this.hits}`;
    return axios.get(url);
  }
}

// fetchPhotos() {
//   const url = `${this.#BASE_URL}?key=${this.#API_KEY}&${this.OPTIONS}`;
//   return axios.get(url, {
//     params: {
//       query: this.query,
//       page: this.page,
//       per_page: this.count,
//       key: this.#API_KEY,
//     },
//   });
// }
