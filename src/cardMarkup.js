export default function createCardMarkup(elements) {
  return elements
    .map(element => {
      return `
  <div class="photo-card">
  <a class = "card-link" href="${element.largeImageURL}" ><img class = "card-img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" width = "480" /></a>
  <div class="info">
    <p class="info-item">
    <b>Likes:</b>
    <b>${element.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:</b>
      <b>${element.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:</b>
      <b>${element.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      <b>${element.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
}
