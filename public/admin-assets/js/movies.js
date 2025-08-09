import { alertRequiredField, alertPositiveInteger, alertMaxLimit, alertDuplicateName } from './alerts.js';

export function movies(csrf, data) {
    const addButton = document.getElementById('add-movie');
    const container = document.getElementById('movies-container');
    const popupAdd = document.getElementById('popup-add-movie');
    const formAdd = popupAdd.querySelector('#form-add-movie');
    const popupRemove = document.getElementById('popup-remove-movie');
    const formRemove = popupRemove.querySelector('#form-remove-movie');

    if (!addButton || !container) return;

    // Открытие модалки добавления фильма
    addButton.addEventListener('click', () => popupAdd.classList.add('active'));

    // Добавление фильма
    formAdd.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = formAdd.querySelector('input[name="name"]').value;
        const duration = formAdd.querySelector('input[name="duration"]').value;
        const description = formAdd.querySelector('textarea[name="description"]').value;
        const country = formAdd.querySelector('input[name="country"]').value;

        if (!alertRequiredField(title, 'Название фильма') ||
            !alertRequiredField(description, 'Описание фильма') ||
            !alertRequiredField(duration, 'Продолжительность фильма') ||
            !alertRequiredField(country, 'Страна') ||
            !alertPositiveInteger(duration, 'Продолжительность фильма') ||
            !alertMaxLimit(duration, 360, 'Продолжительность фильма') ||
            !alertDuplicateName(title, data.movies.map(m => m.title), 'Фильм')) return;

        fetch('/admin/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ title, description, duration, country }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при добавлении фильма');
                location.reload();
            })
            .catch(err => alert(err.message));
    });

    document.querySelectorAll('.conf-step__movie').forEach(movie => {
        deleteMovie(movie);
    });

    // Удаление фильма
    function deleteMovie(movie) {
        movie.addEventListener('dblclick', () => {
            const id = movie.dataset.movieId;
            const movieTitle = movie.querySelector('.conf-step__movie-title').textContent;
            popupRemove.querySelector('#remove-movie-title').textContent = `\"${movieTitle}\"`;
            popupRemove.classList.add('active');
            popupRemove.dataset.movieId = id;
        });
    }

    // Подтверждение удаления фильма
    formRemove.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = popupRemove.dataset.movieId;
        fetch(`/admin/movies/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrf,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при удалении фильма');
                location.reload();
            })
            .catch(err => alert(err.message));
    });

    function closePopup(popup) {
        popup.querySelectorAll('.popup__dismiss, .conf-step__button-regular').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                popup.classList.remove('active');
            })
        })
    }

    closePopup(popupAdd);
    closePopup(popupRemove);
}
