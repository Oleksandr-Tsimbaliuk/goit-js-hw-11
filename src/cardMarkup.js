export default function createCardMarkup(elements) {
  return elements
    .map(element => {
      return `
  <div class="photo-card">
  <a href="${element.largeImageURL}" class = "card-link"><img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" class = "card-img" width="320" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes${element.likes}</b>
    </p>
    <p class="info-item">
      <b>Views${element.views}</b>
    </p>
    <p class="info-item">
      <b>Comments${element.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${element.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
}
