export function movies(csrf) {
    const addBtn = document.getElementById('add-movie');
    const container = document.getElementById('movies-container');

    if (!addBtn || !container) return;

    // Добавление фильма
    addBtn.addEventListener('click', () => {
        const title = prompt('Название фильма:');
        const duration = prompt('Длительность (в минутах):');
        const posterUrl = prompt('Имя файла постера (например, poster1.jpg):');

        if (!title || !duration || !posterUrl) return alert('Все поля обязательны');

        fetch('/admin/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({
                title,
                duration,
                poster_url: posterUrl,
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки фильма');
                return response.json();
            })
            .then(data => {
                if (!data.id) return alert('Ошибка при создании фильма');

                const movieDiv = document.createElement('div');
                movieDiv.classList.add('conf-step__movie');
                movieDiv.dataset.movieId = data.id;
                movieDiv.innerHTML = `
        <img class="conf-step__movie-poster" src="/i/${data.poster_url}" alt="poster">
        <h3 class="conf-step__movie-title">${data.title}</h3>
        <p class="conf-step__movie-duration">${data.duration} минут</p>
      `;

                container.appendChild(movieDiv);
                alert('Фильм добавлен!');
            })
            .catch(err => alert(err.message));
    });
}
