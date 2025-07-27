export function hallConfig(csrf, data) {
    const wrapper = document.querySelector('.conf-step__hall-wrapper');
    const rowsInput = document.getElementById('hall-rows');
    const seatsInput = document.getElementById('hall-seats');
    const saveButton = document.getElementById('hall-save');
    const cancelButton = document.getElementById('hall-cancel');
    const radios = document.querySelectorAll('input[name="chairs-hall"]');
    let selectedId = document.querySelector('input[name="chairs-hall"]:checked')?.value;
    let seatClickHandler;

    if (!wrapper || !rowsInput || !seatsInput || !saveButton || !cancelButton) return;

    // Генерация мест по умолчанию
    function generateDefaultSeats(rows, seatsPerRow) {
        if (seatClickHandler) wrapper.removeEventListener('click', seatClickHandler);

        wrapper.innerHTML = '';
        for (let row = 1; row <= rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('conf-step__row');

            for (let seat = 1; seat <= seatsPerRow; seat++) {
                const seatSpan = document.createElement('span');
                seatSpan.className = 'conf-step__chair conf-step__chair_standart';
                seatSpan.dataset.row = row;
                seatSpan.dataset.seat = seat;
                rowDiv.appendChild(seatSpan);
            }

            wrapper.appendChild(rowDiv);
        }

        attachSeatToggleHandler();
    }

    // Переключение типа кресла
    function attachSeatToggleHandler() {
        seatClickHandler = function (e) {
            if (!e.target.classList.contains('conf-step__chair')) return;

            const seat = e.target;
            if (seat.classList.contains('conf-step__chair_standart')) {
                seat.classList.replace('conf-step__chair_standart', 'conf-step__chair_vip');
            } else if (seat.classList.contains('conf-step__chair_vip')) {
                seat.classList.replace('conf-step__chair_vip', 'conf-step__chair_disabled');
            } else {
                seat.classList.replace('conf-step__chair_disabled', 'conf-step__chair_standart');
            }
        }

        wrapper.addEventListener('click', seatClickHandler);
    }

    // Обновление схемы при изменении инпутов
    function updateScheme() {
        const rows = parseInt(rowsInput.value, 10);
        const seats = parseInt(seatsInput.value, 10);

        if (rows > 0 && seats > 0) generateDefaultSeats(rows, seats);
    }

    // Получение текущей схемы мест
    function getHallSeats() {
        const seats = [];

        wrapper.querySelectorAll('.conf-step__chair').forEach(seat => {
            const type = seat.classList.contains('conf-step__chair_vip')
                ? 'vip'
                : seat.classList.contains('conf-step__chair_disabled')
                    ? 'disabled'
                    : 'standart';

            const row_number = parseInt(seat.dataset.row, 10);
            const seat_number = parseInt(seat.dataset.seat, 10);

            seats.push({ row_number, seat_number, type });
        });

        return seats;
    }

    // Рендеринг схемы зала
    function renderHallConfig(hallId) {
        const hall = data.halls.find(h => h.id == hallId);

        if (!hall) return alert('Зал не найден');

        selectedId = hallId;
        rowsInput.value = hall.rows;
        seatsInput.value = hall.seats_per_row;

        if (seatClickHandler) wrapper.removeEventListener('click', seatClickHandler);
        wrapper.innerHTML = '';

        if (hall.seats && hall.seats.length > 0) {
            const scheme = [];
            hall.seats.forEach(seat => {
                const row = scheme[seat.row_number - 1] || [];
                row.push(seat);
                scheme[seat.row_number - 1] = row;
            });

            scheme.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('conf-step__row');

                row.sort((a, b) => a.seat_number - b.seat_number).forEach(seat => {
                    const seatSpan = document.createElement('span');
                    seatSpan.className = `conf-step__chair conf-step__chair_${seat.type}`;
                    seatSpan.dataset.row = seat.row_number;
                    seatSpan.dataset.seat = seat.seat_number;
                    rowDiv.appendChild(seatSpan);
                });

                wrapper.appendChild(rowDiv);
            });

            attachSeatToggleHandler();
        } else {
            generateDefaultSeats(hall.rows, hall.seats_per_row);
        }
    }

    rowsInput.addEventListener('input', updateScheme);
    seatsInput.addEventListener('input', updateScheme);

    if (selectedId) renderHallConfig(selectedId);

    radios.forEach(radio => {
        radio.addEventListener('change', () => renderHallConfig(radio.value));
    });

    // Сохранение конфигурации зала
    saveButton.addEventListener('click', () => {
        if (!selectedId || !rowsInput.value || !seatsInput.value) return alert('Все поля обязательны');

        const rows = parseInt(rowsInput.value, 10);
        const seatsPerRow = parseInt(seatsInput.value, 10);

        // Проверка на число и отрицательные значения
        if (isNaN(rows) || isNaN(seatsPerRow)) return alert('Значения рядов и мест должны быть целыми числами');

        if (rows <= 0 || seatsPerRow <= 0) return alert('Количество рядов и мест должно быть положительным');

        const seats = getHallSeats();

        fetch(`/admin/halls/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({
                hall_id: selectedId,
                rows: rows,
                seats_per_row: seatsPerRow,
                seats,
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при сохранении схемы');
                return fetch('/admin/api/all-data');
            })
            .then(response => response.json())
            .then(newData => {
                data = newData;
                alert('Схема зала сохранена!');
            })
            .catch(err => alert(err.message));
    });

    // Отмена
    cancelButton.addEventListener('click', () => {
        if (selectedId) renderHallConfig(selectedId);
    });
}
