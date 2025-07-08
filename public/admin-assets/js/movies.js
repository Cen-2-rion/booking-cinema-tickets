export function movies(csrf) {
    const addButton = document.getElementById('add-movie');
    const container = document.getElementById('movies-container');

    if (!addButton || !container) return;

    document.querySelectorAll('.conf-step__movie').forEach(movie => {
        deleteMovie(movie);
    });

    // Добавление фильма
    addButton.addEventListener('click', () => {
        const title = prompt('Название фильма:');
        const description = prompt('Описание фильма:');
        const duration = prompt('Длительность (в минутах):');

        if (!title || !description || !duration) return alert('Все поля обязательны');

        fetch('/admin/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({
                title,
                description,
                duration,
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки фильма');
                return response.json();
            })
            .then(data => {
                if (!data.id) return alert('Ошибка при создании фильма');

                const movie = document.createElement('div');
                movie.classList.add('conf-step__movie');
                movie.dataset.movieId = data.id;

                movie.innerHTML = `
                    <img class="conf-step__movie-poster" src="/admin-assets/i/poster.png" alt="poster">
                    <h3 class="conf-step__movie-title">${data.title}</h3>
                    <p class="conf-step__movie-duration">${data.duration} минут</p>
                `;

                container.appendChild(movie);
                deleteMovie(movie);
                window.enableDragging();
            })
            .catch(err => alert(err.message));
    });

    function deleteMovie(movie) {
        const id = movie.dataset.movieId;
        const title = movie.querySelector('.conf-step__movie-title').textContent;

        movie.addEventListener('dblclick', () => {
            if (!confirm(`Удалить фильм "${title}"?`)) return;

            fetch(`/admin/movies/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Ошибка при удалении');
                    movie.remove();
                })
                .catch(err => alert(err.message));
        });
    }
}
