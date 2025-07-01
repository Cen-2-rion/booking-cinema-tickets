export function sales(csrf) {
    const salesButton = document.getElementById('open-sales');

    if (!salesButton) return;

    salesButton.addEventListener('click', e => {
        e.preventDefault();

        fetch('/admin/open-sales', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': csrf }
        })
            .then(response  => {
                if (!response .ok) throw new Error('Ошибка при открытии/закрытии продаж');
                return response .json();
            })
            .then(data => {
                if (data.success) {
                    salesButton.textContent = data.is_active ? 'Приостановить продажу билетов' : 'Открыть продажу билетов';
                } else {
                    alert('Ошибка при обработке запроса');
                }
            })
            .catch(err => alert(err.message));
    });
}
