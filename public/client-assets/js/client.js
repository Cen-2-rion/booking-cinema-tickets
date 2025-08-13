document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.main');
    const days = document.querySelectorAll('.page-nav__day');

    fetch('/api/all-data')
        .then(response => response.json())
        .then(data => {
            dateNavigation();
            renderMovies(data);
        })
        .catch(err => {
            console.error('Ошибка загрузки данных:', err);
        });

    // Рендеринг фильмов и сеансов
    function renderMovies(data) {
        container.innerHTML = '';

        // Фильтруем по активным залам - с открытой продажей
        const openHalls = data.halls.filter(h => h.is_active).map(h => h.id);

        data.movies.forEach(movie => {
            const movieScreenings = data.screenings.filter(s => s.movie_id === movie.id && openHalls.includes(s.hall_id));

            if (movieScreenings.length === 0) return;

            const movieSection = document.createElement('section');
            movieSection.classList.add('movie');

            movieSection.innerHTML = `
                <div class="movie__info">
                    <div class="movie__poster">
                        <img class="movie__poster-image" alt="${movie.title} постер" src="${movie.poster_url}">
                    </div>
                    <div class="movie__description">
                        <h2 class="movie__title">${movie.title}</h2>
                        <p class="movie__synopsis">${movie.description}</p>
                        <p class="movie__data">
                            <span class="movie__data-duration">${movie.duration} минут</span>
                            <span class="movie__data-origin">${movie.country}</span>
                        </p>
                    </div>
                </div>
            `;

            const halls = [...new Set(movieScreenings.map(s => s.hall_id))];
            halls.forEach(hallId => {
                const hall = data.halls.find(h => h.id === hallId);
                if (!hall) return;

                const hallSection  = document.createElement('div');
                hallSection .classList.add('movie-seances__hall');
                hallSection .innerHTML = `<h3 class="movie-seances__hall-title">${hall.name}</h3>`;

                const screeningsList  = document.createElement('ul');
                screeningsList .classList.add('movie-seances__list');

                movieScreenings.filter(s => s.hall_id === hallId).forEach(s=> {
                    const screeningItem  = document.createElement('li');
                    screeningItem .classList.add('movie-seances__time-block');
                    screeningItem .innerHTML = `<a class="movie-seances__time" href="/hall/${s.id}">${s.start_time}</a>`;
                    screeningsList.appendChild(screeningItem);
                });

                hallSection.appendChild(screeningsList);
                movieSection.appendChild(hallSection);
            });

            container.appendChild(movieSection);
        });
    }

    // Навигация по датам
    function dateNavigation() {
        days.forEach(day => {
            day.addEventListener('click', e => {
                e.preventDefault();

                days.forEach(d => d.classList.remove('page-nav__day_chosen'));
                day.classList.add('page-nav__day_chosen');

                fetch('/api/all-data')
                    .then(response => response.json())
                    .then(data => {
                        renderMovies(data);
                    })
                    .catch(err => {
                        console.error('Ошибка обновления данных:', err);
                    });
            });
        });
    }
});
