import { createHall } from './createHall.js';
import { hallConfig } from './hallConfig.js';
import { pricesConfig } from './pricesConfig.js';
import { movies } from './movies.js';
import { schedule } from './schedule.js';
import { sales } from './sales.js';

document.addEventListener('DOMContentLoaded', () => {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (!csrf) {
    console.warn('CSRF-token не найден');
    return;
  }
  createHall(csrf);
  hallConfig(csrf);
  pricesConfig(csrf);
  movies(csrf);
  schedule(csrf);
  sales(csrf);
});
