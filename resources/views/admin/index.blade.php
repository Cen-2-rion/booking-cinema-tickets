<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Админка | ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('admin/CSS/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/CSS/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>

<body>

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
    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Управление залами</h2>
        </header>
        <div class="conf-step__wrapper">
            <p class="conf-step__paragraph">Доступные залы:</p>
            <ul class="conf-step__list">
                @foreach($halls as $hall)
                    <li>{{ $hall->name }}
                        <button class="conf-step__button conf-step__button-trash" data-hall="{{ $hall->id }}"></button>
                    </li>
                @endforeach
            </ul>
            <button class="conf-step__button conf-step__button-accent" id="addHall">Добавить зал</button>
        </div>
    </section>

    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Конфигурация залов</h2>
        </header>
        <div class="conf-step__wrapper">
            <p class="conf-step__paragraph">Выберите зал для конфигурации:</p>
            <ul class="conf-step__list hall-selector">
                @foreach($halls as $hall)
                    <li><button class="hall-button" data-hall="{{ $hall->id }}">{{ $hall->name }}</button></li>
                @endforeach
            </ul>
            <div class="hall-configurator">
                {{-- Конфигуратор зала --}}
            </div>
        </div>
    </section>

    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Конфигурация цен</h2>
        </header>
        <div class="conf-step__wrapper">
            <p class="conf-step__paragraph">Выберите зал для установки цен:</p>
            <ul class="conf-step__list price-selector">
                @foreach($halls as $hall)
                    <li><button class="price-button" data-hall="{{ $hall->id }}">{{ $hall->name }}</button></li>
                @endforeach
            </ul>
            <div class="price-configurator">
                {{-- Форма для конфигурации цен --}}
            </div>
        </div>
    </section>

    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Расписание сеансов</h2>
        </header>
        <div class="conf-step__wrapper">
            {{-- Таблица расписания, форма добавления сеансов --}}
        </div>
    </section>

    <section class="conf-step">
        <header class="conf-step__header conf-step__header_opened">
            <h2 class="conf-step__title">Открыть продажи</h2>
        </header>
        <div class="conf-step__wrapper text-center">
            <form method="POST" action="{{ route('open.sales') }}">
                @csrf
                <button type="submit" class="conf-step__button conf-step__button-accent">Открыть продажи</button>
            </form>
        </div>
    </section>
</main>

<script src="{{ asset('admin/js/accordeon.js') }}"></script>

</body>
</html>
