export function hallConfig(csrf) {
    const wrapper = document.querySelector('.conf-step__hall-wrapper');
    const rowsInput = document.getElementById('hall-rows');
    const seatsInput = document.getElementById('hall-seats');
    const saveButton = document.getElementById('hall-save');
    const cancelButton = document.getElementById('hall-cancel');
    const radios = document.querySelectorAll('input[name="chairs-hall"]');
    let selectedId = document.querySelector('input[name="chairs-hall"]:checked').value;
    let seatClickHandler;

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

        wrapper.querySelectorAll('.conf-step__chair').forEach(seatEl => {
            const type = seatEl.classList.contains('conf-step__chair_vip')
                ? 'vip'
                : seatEl.classList.contains('conf-step__chair_disabled')
                    ? 'disabled'
                    : 'standart';

            const row_number = parseInt(seatEl.dataset.row, 10);
            const seat_number = parseInt(seatEl.dataset.seat, 10);

            seats.push({ row_number, seat_number, type });
        });

        return seats;
    }

    // Загрузка схемы зала
    function loadHallConfig(hallId) {
        fetch(`/admin/api/halls/${hallId}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки зала');
                return response.json();
            })
            .then(data => {
                selectedId = hallId;
                rowsInput.value = data.rows;
                seatsInput.value = data.seats_per_row;

                if (seatClickHandler) wrapper.removeEventListener('click', seatClickHandler);
                wrapper.innerHTML = '';

                if (data.seats && data.seats.length > 0) {
                    data.seats.forEach(row => {
                        const rowDiv = document.createElement('div');
                        rowDiv.classList.add('conf-step__row');

                        row.forEach(seat => {
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
                    generateDefaultSeats(data.rows, data.seats_per_row);
                }
            })
            .catch(err => alert(err.message));
    }

    rowsInput.addEventListener('input', updateScheme);
    seatsInput.addEventListener('input', updateScheme);

    if (selectedId) loadHallConfig(selectedId);

    radios.forEach(radio => {
        radio.addEventListener('change', () => loadHallConfig(radio.value));
    });

    // Сохранение конфигурации зала
    saveButton.addEventListener('click', () => {
        if (!selectedId || !rowsInput.value || !seatsInput.value) return alert('Все поля обязательны');

        const seats = getHallSeats();

        fetch(`/admin/halls/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({
                hall_id: selectedId,
                rows: rowsInput.value,
                seats_per_row: seatsInput.value,
                seats,
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при сохранении схемы');
                loadHallConfig(selectedId);
                alert('Схема зала сохранена!');
            })
            .catch(err => alert(err.message));
    });

    // Отмена
    cancelButton.addEventListener('click', () => {
        if (selectedId) loadHallConfig(selectedId);
    });
}
