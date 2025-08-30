<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('client-assets/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('client-assets/css/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>
<body>

    <header class="page-header">
        <h1 class="page-header__title">Идём<span>в</span>кино</h1>
    </header>

    <main>
        <section class="ticket">

            <header class="tichet__check">
                <h2 class="ticket__check-title">Вы выбрали билеты:</h2>
            </header>

            <div class="ticket__info-wrapper">
                <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">{{ $screening->movie->title }}</span></p>
                <p class="ticket__info">Места: <span class="ticket__details ticket__chairs">{{ $seatNumbers }}</span></p>
                <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">{{ $screening->hall->name }}</span></p>
                <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">{{ $screening->start_time->format('H:i') }}</span></p>
                <p class="ticket__info">Стоимость: <span class="ticket__details ticket__cost">{{ $totalPrice }}</span> рублей</p>

                <button class="acceptin-button" onclick="location.href='/ticket'" >Получить код бронирования</button>

                <p class="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                <p class="ticket__hint">Приятного просмотра!</p>
            </div>
        </section>
    </main>

</body>
</html>
