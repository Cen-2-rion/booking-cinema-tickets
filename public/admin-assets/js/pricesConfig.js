export function pricesConfig(csrf) {
    const standartInput = document.getElementById('standart_price');
    const vipInput = document.getElementById('vip_price');
    const saveButton = document.getElementById('price-save');
    const cancelButton = document.getElementById('price-cancel');
    const radios = document.querySelectorAll('input[name="prices-hall"]');
    let selectedId = document.querySelector('input[name="prices-hall"]:checked')?.value;

    if (!standartInput || !vipInput || !saveButton || !cancelButton) return;

    // Загрузка цен
    function loadPricesConfig(hallId) {
        fetch('/admin/api/all-data')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки цен');
                return response.json();
            })
            .then(data => {
                const price = data.prices.find(p => p.hall_id == hallId);

                selectedId = hallId;
                standartInput.value = price ? price.standart_price : 350;
                vipInput.value = price ? price.vip_price : 650;
            });
    }

    radios.forEach(radio => {
        radio.addEventListener('change', () => loadPricesConfig(radio.value));
    });

    if (selectedId) loadPricesConfig(selectedId);

    // Сохранение конфигурации цен
    saveButton.addEventListener('click', e => {
        if (!selectedId || !standartInput.value || !vipInput.value) return alert('Все поля обязательны');

        const standart_price = parseInt(standartInput.value, 10);
        const vip_price = parseInt(vipInput.value, 10);

        fetch(`/admin/prices/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ standart_price, vip_price })
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при сохранении цен');
                loadPricesConfig(selectedId);
                alert('Цены сохранены!');
            })
            .catch(err => alert(err.message));
    });

    // Отмена
    cancelButton.addEventListener('click', () => {
        if (selectedId) loadPricesConfig(selectedId);
    });
}
