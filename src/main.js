import { pixabayApi } from './js/pixabay-api.js';
import { renderGallery, displayErrorMessage } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load more';
loadMoreButton.style.display = 'none';
document.body.appendChild(loadMoreButton);

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
    });
    return;
  }

  loader.style.display = 'block';
  currentQuery = query;
  currentPage = 1;

  try {
    const data = await pixabayApi(query, currentPage);
    gallery.innerHTML = '';
    renderGallery(data.hits);
    loader.style.display = 'none';

    if (data.totalHits > currentPage * 15) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
    }

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    window.scrollBy({
      top: gallery.getBoundingClientRect().top - window.innerHeight,
      behavior: 'smooth',
    });
  } catch (error) {
    loader.style.display = 'none';
    displayErrorMessage(
      'An error occurred while fetching data. Please try again later.'
    );
    console.error('Error fetching data: ', error);
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;

  try {
    const data = await pixabayApi(currentQuery, currentPage);
    renderGallery(data.hits);

    const firstImageCard = gallery.querySelector('.photo-card');
    if (firstImageCard) {
      const cardHeight = firstImageCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (data.totalHits <= currentPage * 15) {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    displayErrorMessage(
      'An error occurred while fetching additional data. Please try again later.'
    );
  }
});
