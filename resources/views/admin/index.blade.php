<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Админка | ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('admin-assets/CSS/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('admin-assets/CSS/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>
<body>

@include('admin.popups.add-hall')
@include('admin.popups.remove-hall')
@include('admin.popups.add-movie')
@include('admin.popups.remove-movie')

<header class="page-header">
    <h1 class="page-header__title">Идём<span>в</span>кино</h1>
    <span class="page-header__subtitle">Администраторррская</span>
    <div class="page-header__logout">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="logout-button">Выйти</button>
        </form>
    </div>
</header>

<main class="conf-steps">
    <!-- Управление залами -->
    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Управление залами</h2>
        </header>
        <div class="conf-step__wrapper">
            <p class="conf-step__paragraph">Доступные залы:</p>
            <ul class="conf-step__list">
                @forelse($halls as $hall)
                    <li>
                        {{ $hall->name }}
                        <button class="conf-step__button conf-step__button-trash" data-hall-id="{{ $hall->id }}"
                                data-hall-name="{{ $hall->name }}">
                        </button>
                    </li>
                @empty
                    <li>Залов нет</li>
                @endforelse
            </ul>
            <button type="button" class="conf-step__button conf-step__button-accent" id="create-hall">Создать зал</button>
        </div>
    </section>

    <!-- Конфигурация залов -->
    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Конфигурация залов</h2>
        </header>
        <div class="conf-step__wrapper">
            @if($halls->isNotEmpty())
                <p class="conf-step__paragraph">Выберите зал для конфигурации:</p>
                <ul class="conf-step__selectors-box">
                    @foreach($halls as $hall)
                        <li>
                            <input type="radio"
                                   class="conf-step__radio"
                                   name="chairs-hall"
                                   data-hall-id="{{ $hall->id }}"
                                   value="{{ $hall->id }}" {{ $loop->first ? 'checked' : '' }}
                            >
                            <span class="conf-step__selector">{{ $hall->name }}</span>
                        </li>
                    @endforeach
                </ul>

                <p class="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                <div class="conf-step__legend">
                    <label class="conf-step__label">Рядов, шт
                        <input type="text" class="conf-step__input" id="hall-rows" placeholder="10">
                    </label>
                    <span class="multiplier">×</span>
                    <label class="conf-step__label">Мест, шт
                        <input type="text" class="conf-step__input" id="hall-seats" placeholder="8">
                    </label>
                </div>

                <p class="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div class="conf-step__legend">
                    <span class="conf-step__chair conf-step__chair_standart"></span> — обычные кресла
                    <span class="conf-step__chair conf-step__chair_vip"></span> — VIP кресла
                    <span class="conf-step__chair conf-step__chair_disabled"></span> — заблокированные (нет кресла)
                    <p class="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                </div>

                <div class="conf-step__hall">
                    <div class="conf-step__hall-wrapper">
                        @foreach($halls->first()->seats->groupBy('row_number') as $row => $seats)
                            <div class="conf-step__row">
                                @foreach($seats as $seat)
                                    <span class="conf-step__chair conf-step__chair_{{ $seat->type }}"></span>
                                @endforeach
                            </div>
                        @endforeach
                    </div>
                </div>

                <div class="conf-step__buttons text-center">
                    <button class="conf-step__button conf-step__button-regular" type="button" id="hall-cancel">Отмена</button>
                    <button class="conf-step__button conf-step__button-accent" type="button" id="hall-save">Сохранить</button>
                </div>
            @else
                <p class="conf-step__paragraph">Нет доступных залов. Создайте зал, чтобы продолжить конфигурацию.</p>
            @endif
        </div>
    </section>

    <!-- Конфигурация цен -->
    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Конфигурация цен</h2>
        </header>
        <div class="conf-step__wrapper">
            @if($halls->isNotEmpty())
                <p class="conf-step__paragraph">Выберите зал для конфигурации:</p>
                <ul class="conf-step__selectors-box">
                    @foreach($halls as $hall)
                        <li>
                            <input type="radio"
                                   class="conf-step__radio"
                                   name="prices-hall"
                                   data-price-id="{{ $hall->id }}"
                                   value="{{ $hall->id }}" {{ $loop->first ? 'checked' : '' }}
                            >
                            <span class="conf-step__selector">{{ $hall->name }}</span>
                        </li>
                    @endforeach
                </ul>

                <p class="conf-step__paragraph">Установите цены для типов кресел:</p>
                <div class="conf-step__legend">
                    <label class="conf-step__label">Цена, рублей
                        <input type="text" class="conf-step__input" id="standart_price" placeholder="0">
                    </label>
                    за <span class="conf-step__chair conf-step__chair_standart"></span> обычные кресла
                </div>
                <div class="conf-step__legend">
                    <label class="conf-step__label">Цена, рублей
                        <input type="text" class="conf-step__input" id="vip_price" placeholder="0">
                    </label>
                    за <span class="conf-step__chair conf-step__chair_vip"></span> VIP кресла
                </div>

                <fieldset class="conf-step__buttons text-center">
                    <button class="conf-step__button conf-step__button-regular" type="button" id="price-cancel">Отмена</button>
                    <button class="conf-step__button conf-step__button-accent" type="button" id="price-save">Сохранить</button>
                </fieldset>
            @else
                <p class="conf-step__paragraph">Сначала создайте зал, чтобы настроить цены.</p>
            @endif
        </div>
    </section>

    <!-- Сетка сеансов -->
    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Сетка сеансов</h2>
        </header>
        <div class="conf-step__wrapper">

            <p class="conf-step__paragraph">
                <button class="conf-step__button conf-step__button-accent" id="add-movie">Добавить фильм</button>
            </p>

            <div class="conf-step__movies" id="movies-container">
                @foreach($movies as $movie)
                    <div class="conf-step__movie" data-movie-id="{{ $movie->id }}">
                        <img class="conf-step__movie-poster" src="{{ $movie->poster_url }}" alt="poster">
                        <h3 class="conf-step__movie-title">{{ $movie->title }}</h3>
                        <p class="conf-step__movie-duration">{{ $movie->duration }} минут</p>
                    </div>
                @endforeach
            </div>

            @if($halls->isNotEmpty())
                <div class="conf-step__seances" id="seances-container">
                    @foreach($halls as $hall)
                        <div class="conf-step__seances-hall" data-hall-id="{{ $hall->id }}">
                            <h3 class="conf-step__seances-title">{{ $hall->name }}</h3>
                            <div class="conf-step__seances-timeline">
                                @foreach($hall->screenings as $screening)
                                    <div class="conf-step__seances-movie" data-screening-id="{{ $screening->id }}">
                                        <p class="conf-step__seances-movie-title">{{ $screening->movie->title }}</p>
                                        <p class="conf-step__seances-movie-start">{{ $screening->start_time->format('H:i') }}</p>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>

                <fieldset class="conf-step__buttons text-center">
                    <button class="conf-step__button conf-step__button-regular" id="schedule-cancel">Отмена</button>
                    <button class="conf-step__button conf-step__button-accent" id="schedule-save">Сохранить</button>
                </fieldset>
            @else
                <p class="conf-step__paragraph">Создайте зал, чтобы добавить сеансы в расписание.</p>
            @endif
        </div>
    </section>

    <!-- Открытие продаж -->
    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Открыть продажи</h2>
        </header>
        <div class="conf-step__wrapper text-center">
            <p class="conf-step__paragraph">Всё готово, теперь можно:</p>
            <button class="conf-step__button conf-step__button-accent" id="open-sales">Открыть продажу билетов</button>
        </div>
    </section>
</main>

<script type="module" src="{{ asset('admin-assets/js/accordeon.js') }}"></script>
<script type="module" src="{{ asset('admin-assets/js/app.js') }}"></script>

</body>
</html>
