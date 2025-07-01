export function schedule(csrf) {
    let dragMovie = null;

    document.querySelectorAll('.conf-step__movie').forEach(movie => {
        movie.draggable = true;

        movie.addEventListener('dragstart', () => {
            dragMovie = movie;
        });
    });

    // Drag & Drop расписания
    document.querySelectorAll('.conf-step__seances-timeline').forEach(timeline => {
        timeline.addEventListener('dragover', e => e.preventDefault());

        timeline.addEventListener('drop', e => {
            e.preventDefault();
            if (!dragMovie) return;

            const movieId = dragMovie.dataset.movieId;
            const title = dragMovie.querySelector('.conf-step__movie-title').textContent;
            const duration = parseInt(dragMovie.querySelector('.conf-step__movie-duration').textContent);
            const left = e.offsetX;

            const startMinutes = Math.floor(left);
            const h = String(Math.floor(startMinutes / 60)).padStart(2, '0');
            const m = String(startMinutes % 60).padStart(2, '0');

            const node = document.createElement('div');
            node.className = 'conf-step__seances-movie';
            node.style.width = `${duration / 2}px`;
            node.style.left = `${left}px`;
            node.dataset.movieId = movieId;
            node.innerHTML = `
        <p class="conf-step__seances-movie-title">${title}</p>
        <p class="conf-step__seances-movie-start">${h}:${m}</p>
      `;
            timeline.appendChild(node);
        });
    });

    // Сохранение расписания
    const saveBtn = document.getElementById('save-schedule');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', () => {
        const screenings = [];

        document.querySelectorAll('.conf-step__seances-hall').forEach(hallBlock => {
            const hallName = hallBlock.querySelector('.conf-step__seances-title').textContent;
            const hallInput = [...document.querySelectorAll('[name="hall_id_config"]')]
                .find(input => input.nextElementSibling.textContent.trim() === hallName);
            const hall_id = hallInput.value;

            if (!hall_id) return;

            hallBlock.querySelectorAll('.conf-step__seances-movie').forEach(movieBlock => {
                const movie_id = movieBlock.dataset.movieId;
                const start_time = movieBlock.querySelector('.conf-step__seances-movie-start').textContent;

                if (movie_id && start_time) {
                    screenings.push({ hall_id, movie_id, start_time });
                }
            });
        });

        fetch('/admin/screenings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ screenings })
        }).then(response => response.ok ? alert('Расписание сохранено') : alert('Ошибка при сохранении расписания'));
    });
}
