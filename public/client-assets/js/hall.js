document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    const wrapper = main.querySelector('.buying-scheme__wrapper');
    const acceptinButton = main.querySelector('.acceptin-button');

    const screeningId = parseInt(main.dataset.screeningId);

    fetch(`/api/screenings/${screeningId}`)
        .then(response => response.json())
        .then(data => {
            renderHall(data);
        })
        .catch(err => {
            console.error('Ошибка загрузки данных:', err);
        });

    // Рендеринг зала и мест
    function renderHall(screening) {
        wrapper.innerHTML = '';

        const hall = screening.hall;
        if (!hall) return;

        // Занятые места
        const booked = screening.booked_seats;

        for (let row = 1; row <= hall.rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('buying-scheme__row');

            const seatsPerRow = hall.seats.filter(s => s.row_number === row);
            let number = 1;

            seatsPerRow.forEach(seat => {
                const seatSpan = document.createElement('span');
                seatSpan.dataset.seatId = seat.id;

                if (booked.includes(seat.id)) {
                    seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_taken');
                } else if (seat.type === 'vip') {
                    seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_vip');
                } else if (seat.type === 'standart') {
                    seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_standart');
                } else {
                    seatSpan.classList.add('buying-scheme__chair', 'buying-scheme__chair_disabled');
                }

                // Если не забранировано и не disabled - выбираем
                if (!booked.includes(seat.id) && seat.type !== 'disabled') {
                    seatSpan.addEventListener('click', () => {
                        seatSpan.classList.toggle('buying-scheme__chair_selected');
                    });
                }

                // Присваиваем номер если место не disabled
                if (seat.type !== 'disabled') seatSpan.dataset.number = number++;

                rowDiv.appendChild(seatSpan);
            });

            wrapper.appendChild(rowDiv);
        }
    }

    acceptinButton.addEventListener('click', () => {
        const selectedSeats = [...wrapper.querySelectorAll('.buying-scheme__chair_selected')];

        if (!selectedSeats.length) return alert('Выберите хотя бы одно место!');

        // Получаем id и номер места
        const seatsData = selectedSeats.map(seat => ({
            id: seat.dataset.seatId,
            number: seat.dataset.number,
        }));

        fetch('/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                screening_id: screeningId,
                seats: seatsData.map(s => s.id),
                seat_numbers: seatsData.map(s => s.number),
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) location.href = '/payment';
            })
            .catch(err => console.error('Ошибка бронирования:', err));
    });
});
