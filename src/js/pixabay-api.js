import axios from 'axios';

export async function pixabayApi(query, page = 1) {
  const API_KEY = '47065428-a0220427b8b9e139f136fc7ca';
  const ORIGIN_URL = 'https://pixabay.com/api/';
  const url = `${ORIGIN_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=15`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
