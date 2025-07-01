export function createHall(csrf) {
    // Создание зала
    document.getElementById('create-hall').addEventListener('click', e => {
        e.preventDefault();
        const name = prompt('Введите название зала:');
        if (!name.trim()) return;

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
        })
            .catch(err => alert(err.message));
    });

    // Удаление зала
    document.querySelectorAll('.conf-step__button-trash').forEach(button => {
        button.addEventListener('click', () => {

            const hallId = button.dataset.hallId;
            if (!hallId || !confirm('Удалить зал?')) return;

            fetch(`/admin/halls/${hallId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Ошибка при удалении зала');
                    location.reload();
                })
                .catch(err => alert(err.message));
        });
    });
}
