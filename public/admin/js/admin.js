document.addEventListener('DOMContentLoaded', () => {
    const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Создание зала
    document.getElementById('create-hall')?.addEventListener('click', e => {
        e.preventDefault();
        const name = prompt('Введите название зала:');
        if (!name) return;

        fetch('/admin/halls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ name })
        }).then(response => {
            if (response.ok) location.reload();
            else alert('Ошибка при создании зала');
        });
    });

    // Удаление зала
    document.querySelectorAll('.conf-step__button-trash').forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            if (!confirm('Удалить зал?')) return;
            const form = button.closest('form');

            fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({ _method: 'DELETE' })
            }).then(() => location.reload());
        });
    });

    // Выбор зала для конфигурации
    document.querySelectorAll('input[name="hall_id"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const hallId = radio.value;

            fetch(`/api/halls/${hallId}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector('input[name="rows"]').value = data.rows;
                    document.querySelector('input[name="seats_per_row"]').value = data.seats_per_row;
                    const wrapper = document.querySelector('.conf-step__hall-wrapper');
                    wrapper.innerHTML = '';
                    data.seats.forEach(row => {
                        const rowDiv = document.createElement('div');
                        rowDiv.classList.add('conf-step__row');
                        row.forEach(seat => {
                            const seatSpan = document.createElement('span');
                            seatSpan.className = `conf-step__chair conf-step__chair_${seat.type}`;
                            seatSpan.dataset.seatId = seat.id;
                            rowDiv.appendChild(seatSpan);
                        });
                        wrapper.appendChild(rowDiv);
                    });
                });
        });
    });

    // Конфигурация залов: изменение типов кресел
    const hallWrapper = document.querySelector('.conf-step__hall-wrapper');
    if (hallWrapper) {
        hallWrapper.addEventListener('click', e => {
            if (!e.target.classList.contains('conf-step__chair')) return;

            // Переключаем между стандартным, VIP и отсутствующим креслом
            if (e.target.classList.contains('conf-step__chair')) {
                const seat = e.target;
                if (seat.classList.contains('conf-step__chair_standart')) {
                    seat.classList.remove('conf-step__chair_standart');
                    seat.classList.add('conf-step__chair_vip');
                } else if (seat.classList.contains('conf-step__chair_vip')) {
                    seat.classList.remove('conf-step__chair_vip');
                    seat.classList.add('conf-step__chair_disabled');
                } else if (seat.classList.contains('conf-step__chair_disabled')) {
                    seat.classList.remove('conf-step__chair_disabled');
                    seat.classList.add('conf-step__chair_standart');
                }
            }
        });
    }

    // Сохранение конфигурации зала
    const hallConfigForm = document.getElementById('hall-config');
    hallConfigForm?.addEventListener('submit', e => {
        e.preventDefault();

        const hall_id = hallConfigForm.querySelector('input[name="hall_id"]:checked')?.value;
        const rows = hallConfigForm.querySelector('input[name="rows"]').value;
        const seats = hallConfigForm.querySelector('input[name="seats_per_row"]').value;

        fetch(`/admin/halls/${hall_id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ hall_id, rows, seats_per_row: seats })
        }).then(response => {
            if (response.ok) location.reload();
            else alert('Ошибка при сохранении зала');
        });
    });

    // Сохранение цен
    const priceForm = document.getElementById('price-config');
    priceForm?.addEventListener('submit', e => {
        e.preventDefault();

        const hall_id = priceForm.querySelector('input[name="hall_id"]:checked')?.value;
        const standard_price = priceForm.querySelector('input[name="standard_price"]').value;
        const vip_price = priceForm.querySelector('input[name="vip_price"]').value;

        fetch(`/admin/prices/${hall_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ standard_price, vip_price })
        }).then(response => {
            if (response.ok) location.reload();
            else alert('Ошибка при сохранении цен');
        });
    });

    // Добавление фильма
    document.getElementById('add-movie')?.addEventListener('click', () => {
        const title = prompt('Название фильма:');
        const duration = prompt('Длительность (мин):');
        const poster_url = prompt('URL постера (только имя файла):');
        if (!title || !duration || !poster_url) return alert('Все поля обязательны');

        fetch('/admin/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf
            },
            body: JSON.stringify({ title, duration, poster_url })
        })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    const container = document.getElementById('movies-container');
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
                } else {
                    alert('Ошибка при создании фильма');
                }
            })
            .catch(() => alert('Ошибка при запросе к серверу'));
    });

    // Drag & Drop расписания
    const enableDrag = movie => {
        movie.draggable = true;
        movie.addEventListener('dragstart', () => draggedMovie = movie);
    };

    document.querySelectorAll('.conf-step__movie').forEach(enableDrag);

    document.querySelectorAll('.conf-step__seances-timeline').forEach(timeline => {
        timeline.addEventListener('dragover', e => e.preventDefault());
        timeline.addEventListener('drop', e => {
            e.preventDefault();
            if (!draggedMovie) return;

            const movieId = draggedMovie.dataset.movieId;
            const title = draggedMovie.querySelector('.conf-step__movie-title').textContent;
            const duration = parseInt(draggedMovie.querySelector('.conf-step__movie-duration').textContent);
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
    document.getElementById('save-schedule')?.addEventListener('click', () => {
        const screenings = [];

        document.querySelectorAll('.conf-step__seances-hall').forEach(hallBlock => {
            const hallName = hallBlock.querySelector('.conf-step__seances-title').textContent;
            const hallInput = [...document.querySelectorAll('[name="hall_id"]')]
                .find(input => input.nextElementSibling.textContent.trim() === hallName);
            const hall_id = hallInput?.value;

            if (!hall_id) return;

            hallBlock.querySelectorAll('.conf-step__seances-movie').forEach(movieBlock => {
                const movie_id = movieBlock.dataset.movieId;
                const start_time = movieBlock.querySelector('.conf-step__seances-movie-start').textContent;
                screenings.push({ hall_id, movie_id, start_time });
            });
        });

        fetch('/admin/screenings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ screenings })
        }).then(response => response.ok ? alert('Расписание сохранено') : alert('Ошибка при сохранении'));
    });

    // Открытие/приостановка продаж
    document.getElementById('open-sales').addEventListener('click', function(e) {
        e.preventDefault();

        fetch('/admin/open-sales', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf,
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка запроса');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    this.textContent = data.is_active ? 'Приостановить продажу билетов' : 'Открыть продажу билетов';
                } else {
                    alert('Ошибка при открытии продаж');
                }
            })
            .catch(err => alert(err.message));
    });
});
