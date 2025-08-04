import { alertRequiredField, alertPositiveInteger } from './alerts.js';

export function pricesConfig(csrf, data) {
    const standartInput = document.getElementById('standart_price');
    const vipInput = document.getElementById('vip_price');
    const saveButton = document.getElementById('price-save');
    const cancelButton = document.getElementById('price-cancel');
    const radios = document.querySelectorAll('input[name="prices-hall"]');
    let selectedId = document.querySelector('input[name="prices-hall"]:checked')?.value;

    if (!standartInput || !vipInput || !saveButton || !cancelButton) return;

    // Рендеринг цен
    function renderPricesConfig(hallId) {
        const price = data.prices.find(p => p.hall_id === +hallId);

        selectedId = hallId;
        standartInput.value = price ? price.standart_price : 350;
        vipInput.value = price ? price.vip_price : 650;
    }

    radios.forEach(radio => {
        radio.addEventListener('change', () => renderPricesConfig(radio.value));
    });

    if (selectedId) renderPricesConfig(selectedId);

    // Сохранение конфигурации цен
    saveButton.addEventListener('click', e => {
        if (!alertRequiredField(standartInput.value, 'Цена обычного кресла') ||
            !alertRequiredField(vipInput.value, 'Цена VIP кресла') ||
            !alertPositiveInteger(standartInput.value, 'Цена обычного кресла') ||
            !alertPositiveInteger(vipInput.value, 'Цена VIP кресла')) return;

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
                return response.json();
            })
            .then(updatedPrice => {
                const index = data.prices.findIndex(p => p.hall_id === updatedPrice.hall_id);
                (index !== -1) ? data.prices[index] = updatedPrice : data.prices.push(updatedPrice);
                alert('Цены сохранены!');
            })
            .catch(err => alert(err.message));
    });

    // Отмена
    cancelButton.addEventListener('click', () => {
        if (selectedId) renderPricesConfig(selectedId);
    });
}
