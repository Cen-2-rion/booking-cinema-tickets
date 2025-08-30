<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('client-assets/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('client-assets/css/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>
<body>

    <header class="page-header">
        <h1 class="page-header__title">Идём<span>в</span>кино</h1>
    </header>

    <main class="main" data-screening-id="{{ $screening->id }}">
        <section class="buying">
            <div class="buying__info">
                <div class="buying__info-description">
                    <h2 class="buying__info-title">{{ $movie->title }}</h2>
                    <p class="buying__info-start">Начало сеанса: {{ $screening->start_time->format('H:i') }}</p>
                    <p class="buying__info-hall">{{ $hall->name }}</p>
                </div>
                <div class="buying__info-hint">
                    <p>Тапните дважды,<br>чтобы увеличить</p>
                </div>
            </div>

            <div class="buying-scheme">

                <div class="buying-scheme__wrapper"></div>

                <div class="buying-scheme__legend">
                    <div class="col">
                        <p class="buying-scheme__legend-price"><span class="buying-scheme__chair buying-scheme__chair_standart"></span>
                            Свободно (<span class="buying-scheme__legend-value" id="standart_price">{{ $hall->price->standart_price }}</span>руб)
                        </p>
                        <p class="buying-scheme__legend-price"><span class="buying-scheme__chair buying-scheme__chair_vip"></span>
                            Свободно VIP (<span class="buying-scheme__legend-value" id="vip_price">{{ $hall->price->vip_price }}</span>руб)
                        </p>
                    </div>
                    <div class="col">
                        <p class="buying-scheme__legend-price"><span class="buying-scheme__chair buying-scheme__chair_taken"></span>Занято</p>
                        <p class="buying-scheme__legend-price"><span class="buying-scheme__chair buying-scheme__chair_selected"></span>Выбрано</p>
                    </div>
                </div>
            </div>
            <button class="acceptin-button">Забронировать</button>
        </section>
    </main>

    <script type="module" src="{{ asset('client-assets/js/hall.js') }}"></script>

</body>
</html>
