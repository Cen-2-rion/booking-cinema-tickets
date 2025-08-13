import { alertRequiredField, alertPositiveInteger, alertMaxLimit, alertDuplicateName, alertTextOnly } from './alerts.js';

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

    const poster = formAdd.querySelector('input[name="poster"]');
    const preview = formAdd.querySelector('#poster-preview');

    // Слушаем выбор файла и показываем превью
    poster.addEventListener('change', () => {
        const file = poster.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = 'block';
        }
    });

    // Добавление фильма
    formAdd.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = formAdd.querySelector('input[name="title"]').value;
        const duration = formAdd.querySelector('input[name="duration"]').value;
        const description = formAdd.querySelector('textarea[name="description"]').value;
        const country = formAdd.querySelector('input[name="country"]').value;

        if (!alertRequiredField(title, 'Название фильма') ||
            !alertRequiredField(description, 'Описание фильма') ||
            !alertRequiredField(duration, 'Продолжительность фильма') ||
            !alertRequiredField(country, 'Страна') ||
            !alertTextOnly(country, 'Страна') ||
            !alertPositiveInteger(duration, 'Продолжительность фильма') ||
            !alertMaxLimit(duration, 360, 'Продолжительность фильма') ||
            !alertDuplicateName(title, data.movies.map(m => m.title), 'Фильм')) return;

        if (!poster.files[0] || poster.files[0].size > 2 * 1024 * 1024) {
            return alert('Пожалуйста, выберите постер размером не более 2Mb');
        }

        const formData = new FormData(formAdd);

        fetch('/admin/movies', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf,
            },
            body: formData,
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

    function closePopup(popup, form = null, preview = null) {
        popup.querySelectorAll('.popup__dismiss, .conf-step__button-regular').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                popup.classList.remove('active');
                form.reset();
                preview.src = '';
                preview.style.display = 'none';
            })
        })
    }

    closePopup(popupAdd, formAdd, preview);
    closePopup(popupRemove);
}
