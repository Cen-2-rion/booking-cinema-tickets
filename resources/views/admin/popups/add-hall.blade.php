<div class="popup" id="popup-add-hall">
    <div class="popup__container">
        <div class="popup__content">
            <div class="popup__header">
                <h2 class="popup__title">
                    Добавление зала
                    <a class="popup__dismiss" href="#"><img src="{{ asset('admin-assets/i/close.png') }}" alt="Закрыть"></a>
                </h2>
            </div>
            <div class="popup__wrapper">
                <form id="form-add-hall" accept-charset="utf-8">
                    <label class="conf-step__label conf-step__label-fullsize" for="name">
                        Название зала
                        <input class="conf-step__input" type="text" placeholder="Например, &laquo;Зал 1&raquo;" name="name" required>
                    </label>
                    <div class="conf-step__buttons text-center">
                        <input type="submit" value="Добавить зал" class="conf-step__button conf-step__button-accent">
                        <button class="conf-step__button conf-step__button-regular" type="button">Отменить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
