import { createHall } from './createHall.js';
import { hallConfig } from './hallConfig.js';
import { priceConfig } from './priceConfig.js';
import { movie } from './movie.js';
import { schedule } from './schedule.js';
import { sales } from './sales.js';

document.addEventListener('DOMContentLoaded', () => {
    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    if (!csrf) return console.warn('CSRF-token не найден');

    fetch('/admin/api/all-data')
        .then(response => response.json())
        .then(data => {
            createHall(csrf, data);
            hallConfig(csrf, data);
            priceConfig(csrf, data);
            movie(csrf, data);
            schedule(csrf, data);
        });
    sales(csrf);
});
