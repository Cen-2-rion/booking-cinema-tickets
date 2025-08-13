<div class="popup" id="popup-add-movie">
    <div class="popup__container">
        <div class="popup__content">
            <div class="popup__header">
                <h2 class="popup__title">
                    Добавление фильма
                    <a class="popup__dismiss" href="#"><img src="{{ asset('admin-assets/i/close.png') }}" alt="Закрыть"></a>
                </h2>
            </div>
            <div class="popup__wrapper">
                <form id="form-add-movie" enctype="multipart/form-data">
                    <label class="conf-step__label conf-step__label-fullsize" for="name">
                        Название фильма
                        <input class="conf-step__input" type="text" placeholder="Например, &laquo;Гражданин Кейн&raquo;" name="title">
                    </label>
                    <label class="conf-step__label conf-step__label-fullsize" for="name">
                        Продолжительность фильма (мин.)
                        <input class="conf-step__input" type="number" name="duration">
                    </label>
                    <label class="conf-step__label conf-step__label-fullsize" for="name">
                        Описание фильма
                        <textarea class="conf-step__input" type="text" name="description"></textarea>
                    </label>
                    <label class="conf-step__label conf-step__label-fullsize" for="name">
                        Страна
                        <input class="conf-step__input" type="text" name="country">
                    </label>
                    <div class="conf-step__buttons text-center">
                        <input type="submit" value="Добавить фильм" class="conf-step__button conf-step__button-accent">
                        <label class="conf-step__button conf-step__button-accent">
                            Загрузить постер
                            <input type="file" name="poster" style="display: none;">
                        </label>
                        <button class="conf-step__button conf-step__button-regular" type="button">Отменить</button>
                        <img id="poster-preview" src="#" alt="Превью постера">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
