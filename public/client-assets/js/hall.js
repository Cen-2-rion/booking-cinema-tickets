document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    const wrapper = main.querySelector('.buying-scheme__wrapper');
    const standartPrice = main.querySelector('#standart_price');
    const vipPrice = main.querySelector('#vip_price');
    const acceptinButton = main.querySelector('.acceptin-button');

    const screeningId = parseInt(main.dataset.screeningId);

    fetch('/api/all-data')
        .then(response => response.json())
        .then(data => {
            renderHall(data);
        })
        .catch(err => {
            console.error('Ошибка загрузки данных:', err);
        });

    function renderHall(data) {
        wrapper.innerHTML = '';

        // Находим сеанс
        const screening = data.screenings.find(s => s.id === screeningId);
        if (!screening) return;

        // Находим зал
        const hall = data.halls.find(h => h.id === screening.hall_id);
        if (!hall) return;

        // Цены
        const price = data.prices.find(p => p.hall_id === hall.id);
        if (price) {
            standartPrice.textContent = price.standart_price;
            vipPrice.textContent = price.vip_price;
        }

        // Занятые места
        const booked = data.booked_seats.filter(b => b.screening_id === screening.id).map(b => b.seat_id);

        // Рендеринг рядов и мест
        for (let row = 1; row <= hall.rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('buying-scheme__row');

            const seatsPerRow = hall.seats.filter(s => s.row_number === row);

            seatsPerRow.forEach(seat => {
                const seatSpan = document.createElement('span');
                seatSpan.dataset.seatId = seat.id;

                seat.type === 'vip'
                    ? seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_vip')
                    : seat.type === 'standart'
                        ? seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_standart')
                        : seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_disabled')

                // Если место занято, иначе выбираем место
                if (booked.includes(seat.id)) {
                    seatSpan.classList.add('buying-scheme__chair_taken');
                } else {
                    seatSpan.addEventListener('click', () => {
                        seatSpan.classList.toggle('buying-scheme__chair_selected');
                    });
                }

                rowDiv.appendChild(seatSpan);
            });

            wrapper.appendChild(rowDiv);
        }
    }

    acceptinButton.addEventListener('click', () => {
        const selected = [...wrapper.querySelectorAll('.buying-scheme__chair_selected')]
            .map(seat => seat.dataset.seatId);

        if (!selected.length) return alert('Выберите хотя бы одно место!');

        fetch('/client/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                screening_id: screeningId,
                seats: selected,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) location.href = '/client/payment';
            })
            .catch(err => {
                console.error('Ошибка бронирования:', err);
            });
    });
});
