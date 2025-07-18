export function createHall(csrf) {
    const popupAdd = document.getElementById('popup-add-hall');
    const formAdd = popupAdd.querySelector('#form-add-hall');
    const popupRemove = document.getElementById('popup-remove-hall');
    const formRemove = popupRemove.querySelector('#form-remove-hall');
    let hallId = null;

    // Открытие модалки создания зала
    document.getElementById('create-hall').addEventListener('click', () => {
        popupAdd.classList.add('active');
    });

    // Создание зала
    formAdd.addEventListener('submit', e => {
        e.preventDefault();
        const name = formAdd.querySelector(".conf-step__input").value.trim();
        if (!name) return;

        fetch('/admin/halls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ name, rows: 4, seats_per_row: 4 })
        }).then(response => {
            if (!response.ok) throw new Error('Ошибка при создании зала');
            location.reload();
        }).catch(err => alert(err.message));
    });

    // Открытие модалки удаления зала
    document.querySelectorAll('.conf-step__button-trash').forEach(button => {
        button.addEventListener('click', () => {
            hallId = button.dataset.hallId;
            if (!hallId) return;

            const hallName = button.dataset.hallName;
            popupRemove.querySelector('#remove-hall-name').textContent = `\"${hallName}\"`;
            popupRemove.classList.add('active');
        });
    });

    // Удаление зала
    formRemove.addEventListener('submit', e => {
        e.preventDefault();
        if (!hallId) return;

        fetch(`/admin/halls/${hallId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrf,
            }
        }).then(response => {
            if (!response.ok) throw new Error('Ошибка при удалении зала');
            location.reload();
        }).catch(err => alert(err.message));
    });

    // Закрытие модалок
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
