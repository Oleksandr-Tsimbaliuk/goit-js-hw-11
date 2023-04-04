export default function createCardMarkup(elements) {
  return elements
    .map(element => {
      return `
  <div class="photo-card">
  <img src="${element.webformatURL}" alt="" loading="lazy" width="320" />
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
