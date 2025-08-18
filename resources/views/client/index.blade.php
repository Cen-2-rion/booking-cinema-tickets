<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('client-assets/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('client-assets/css/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>
<body>

<header class="page-header">
    <h1 class="page-header__title">Идём<span>в</span>кино</h1>
</header>

<nav class="page-nav">
    @foreach ($dates as $date)
        <a class="page-nav__day
                {{ $date['is_today'] ? 'page-nav__day_today' : '' }}
                {{ $date['is_chosen'] ? 'page-nav__day_chosen' : '' }}
                {{ in_array($date['day_week'], ['Сб', 'Вс']) ? 'page-nav__day_weekend' : '' }}"
           href="#">
            <span class="page-nav__day-week">{{ $date['day_week'] }}</span>
            <span class="page-nav__day-number">{{ $date['day_number'] }}</span>
        </a>
    @endforeach
</nav>

<main class="main"></main>

<script type="module" src="{{ asset('client-assets/js/client.js') }}"></script>

</body>
</html>
