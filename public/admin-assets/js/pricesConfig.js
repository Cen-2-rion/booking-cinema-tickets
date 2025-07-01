export function pricesConfig(csrf) {
    const standartInput = document.getElementById('standart_price');
    const vipInput = document.getElementById('vip_price');
    const saveButton = document.getElementById('price-save');
    const cancelButton = document.getElementById('price-cancel');
    const radios = document.querySelectorAll('input[name="prices-hall"]');
    let selectedId = document.querySelector('input[name="prices-hall"]:checked').value;
    let lastLoadedPrices = { standart_price: '', vip_price: '' };

    // Загрузка цен
    function loadPricesConfig(hallId) {
        selectedId = hallId;

        fetch(`/admin/api/prices/${hallId}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки цен');
                return response.json();
            })
            .then(data => {
                lastLoadedPrices = data;
                standartInput.value = data.standart_price;
                vipInput.value = data.vip_price;
            })
            .catch(err => alert(err.message));
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({ standart_price, vip_price })
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка при сохранении цен');
                lastLoadedPrices = { standart_price, vip_price };
                alert('Цены сохранены!');
            })
            .catch(err => alert(err.message));
    });

    // Отмена
    cancelButton.addEventListener('click', () => {
        standartInput.value = lastLoadedPrices.standart_price;
        vipInput.value = lastLoadedPrices.vip_price;
    });
}
