export function movies(csrf) {
    const addButton = document.getElementById('add-movie');
    const container = document.getElementById('movies-container');
    const popupAdd = document.getElementById('popup-add-movie');
    const formAdd = popupAdd.querySelector('#form-add-film');
    const popupRemove = document.getElementById('popup-remove-movie');
    const formRemove = popupRemove.querySelector('#form-remove-film');

    if (!addButton || !container) return;

    // Открытие модалки добавления фильма
    addButton.addEventListener('click', () => popupAdd.classList.add('active'));

    // Добавление фильма
    formAdd.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.querySelector('input[name="name"]').value;
        const duration = form.querySelector('input[name="duration"]').value;
        const description = form.querySelector('textarea[name="description"]').value;

        if (!title || !description || !duration) return alert('Все поля обязательны');

        fetch('/admin/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ title, description, duration }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки фильма');
                return response.json();
            })
            .then(data => {
                if (!data.id) return alert('Ошибка при создании фильма');
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
            popupRemove.querySelector('#remove-movie-title').textContent = movieTitle;
            popupRemove.classList.add('active');
            popupRemove.dataset.movieId = id;
        });
    }

    // Подтверждение удаления фильма
    popupRemove.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = popupRemove.dataset.movieId;
        fetch(`/admin/movies/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrf,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при удалении');
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
