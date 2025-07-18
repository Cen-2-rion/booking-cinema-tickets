export function schedule(csrf) {
    const saveButton = document.getElementById('schedule-save');
    const cancelButton = document.getElementById('schedule-cancel');
    let draggedMovie = null;

    // Drag & Drop для фильмов
    window.enableDragging = function () {
        document.querySelectorAll('.conf-step__movie').forEach(movie => {
            movie.setAttribute('draggable', true);
            movie.addEventListener('dragstart', dragStartHandler);
        });
    }

    function dragStartHandler(e) {
        const movie = e.currentTarget;
        draggedMovie = {
            id: movie.dataset.movieId,
            title: movie.querySelector('.conf-step__movie-title').textContent,
            duration: parseInt(movie.querySelector('.conf-step__movie-duration').textContent),
        };
    }

    function dragOverHandler(e) {
        e.preventDefault();
    }

    function dropHandler(e) {
        e.preventDefault();
        if (!draggedMovie) return;

        const timeline = e.currentTarget;
        const rect = timeline.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;

        // Вычисляем ширину и ограничиваем по правому краю
        const movieWidth = draggedMovie.duration * 0.5;
        const maxLeft = 1440 * 0.5 - movieWidth;

        const left = Math.max(0, Math.min(offsetX, maxLeft));
        const newStartMin = Math.round(left / 0.5);
        const newEndMin = newStartMin + draggedMovie.duration;

        // Проверка на пересечения
        const isOverlap = Array.from(timeline.querySelectorAll('.conf-step__seances-movie')).some(ext => {
            const extStart = parseInt(ext.dataset.start);
            const extEnd = parseInt(ext.dataset.end);
            return !(newEndMin <= extStart || newStartMin >= extEnd);
        });

        if (isOverlap) {
            alert('Нельзя наложить на другой сеанс');
            return;
        }

        const movie = document.createElement('div');
        movie.className = 'conf-step__seances-movie';
        movie.style.left = `${newStartMin * 0.5}px`;
        movie.style.width = `${draggedMovie.duration * 0.5}px`;
        movie.dataset.movieId = draggedMovie.id;
        movie.dataset.start = newStartMin;
        movie.dataset.end = newEndMin;

        const hours = String(Math.floor(newStartMin / 60)).padStart(2, '0');
        const minutes = String(newStartMin % 60).padStart(2, '0');
        const startTime = `${hours}:${minutes}`;

        movie.innerHTML = `
            <p class="conf-step__seances-movie-title">${draggedMovie.title}</p>
            <p class="conf-step__seances-movie-start">${startTime}</p>
        `;

        movie.addEventListener('dblclick', () => movie.remove());

        timeline.appendChild(movie);
    }

    function initDropZones() {
        document.querySelectorAll('.conf-step__seances-timeline').forEach(timeline => {
            timeline.addEventListener('dragover', dragOverHandler);
            timeline.addEventListener('drop', dropHandler);
        });
    }

    // Загрузка сохранённого расписания
    function loadSchedule() {
        fetch('/admin/api/screenings')
            .then(response => response.json())
            .then(data => {
                document.querySelectorAll('.conf-step__seances-hall').forEach(hall => {
                    const hallId = hall.dataset.hallId;
                    const timeline = hall.querySelector('.conf-step__seances-timeline');
                    timeline.innerHTML = '';

                    (data[hallId] || []).forEach(screening => {
                        const [h, m] = screening.start_time.split(':');
                        const [eh, em] = screening.end_time.split(':');

                        const start = parseInt(h) * 60 + parseInt(m);
                        const end = parseInt(eh) * 60 + parseInt(em);
                        const width = (end - start) * 0.5;

                        const movie = document.createElement('div');
                        movie.className = 'conf-step__seances-movie';
                        movie.style.left = `${start * 0.5}px`;
                        movie.style.width = `${width}px`;
                        movie.dataset.movieId = screening.movie_id;
                        movie.dataset.start = start;
                        movie.dataset.end = end;

                        movie.innerHTML = `
                            <p class="conf-step__seances-movie-title">${screening.title}</p>
                            <p class="conf-step__seances-movie-start">${screening.start_time}</p>
                        `;

                        movie.addEventListener('dblclick', () => movie.remove());

                        timeline.appendChild(movie);
                    });
                });
            });
    }

    // Сохранение
    saveButton.addEventListener('click', () => {
        const screenings = [];
        const hallIds = [];

        document.querySelectorAll('.conf-step__seances-hall').forEach(hall => {
            const hallId = hall.dataset.hallId;
            hallIds.push(hallId);

            const timeline = hall.querySelector('.conf-step__seances-timeline');
            timeline.querySelectorAll('.conf-step__seances-movie').forEach(movieEl => {
                const movieId = movieEl.dataset.movieId;
                const start = movieEl.dataset.start;
                const end = movieEl.dataset.end;

               if (movieId && start && end) {
                    const startHours = String(Math.floor(start / 60)).padStart(2, '0');
                    const startMinutes = String(start % 60).padStart(2, '0');
                    let endHours = Math.floor(end / 60);
                    let endMinutes = end % 60;

                    // Проверка последнего сеанса
                    if (endHours === 24 && endMinutes === 0) {
                       endHours = 23;
                       endMinutes = 59;
                   }

                    screenings.push({
                        hall_id: hallId,
                        movie_id: movieId,
                        start_time: `${startHours}:${startMinutes}`,
                        end_time: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
                    });
               }
            });
        });

        fetch('/admin/screenings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ screenings, hall_ids: hallIds }),
        })
            .then(response => response.ok ? alert('Расписание сохранено!') : alert('Ошибка при сохранении'));
    });

    // Отмена
    cancelButton.addEventListener('click', loadSchedule);

    enableDragging();
    initDropZones();
    loadSchedule();
}
