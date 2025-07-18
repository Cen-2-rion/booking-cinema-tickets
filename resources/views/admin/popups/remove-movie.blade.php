<div class="popup" id="popup-remove-movie">
    <div class="popup__container">
        <div class="popup__content">
            <div class="popup__header">
                <h2 class="popup__title">
                    Удаление фильма
                    <a class="popup__dismiss" href="#"><img src="{{ asset('admin-assets/i/close.png') }}" alt="Закрыть"></a>
                </h2>
            </div>
            <div class="popup__wrapper">
                <form id="form-remove-film" accept-charset="utf-8">
                    <p class="conf-step__paragraph">Вы действительно хотите удалить фильм <span id="remove-movie-title"></span>?</p>
                    <div class="conf-step__buttons text-center">
                        <input type="submit" value="Удалить" class="conf-step__button conf-step__button-accent">
                        <button class="conf-step__button conf-step__button-regular" type="button">Отменить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
