<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Авторизация | ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('admin-assets/CSS/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('admin-assets/CSS/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>
<body>
<header class="page-header">
    <h1 class="page-header__title">Идём<span>в</span>кино</h1>
    <span class="page-header__subtitle">Администраторррская</span>
</header>

<main>
    <section class="login">
        <header class="login__header">
            <h2 class="login__title">Авторизация</h2>
        </header>

        @if(session('error'))
            <div class="alert alert-danger text-center">{{ session('error') }}</div>
        @endif

        <div class="login__wrapper">
            <form class="login__form" method="POST" action="{{ route('login') }}">
                @csrf
                <label class="login__label">
                    E-mail
                    <input class="login__input" type="email" name="email" placeholder="example@domain.xyz" required>
                </label>
                <label class="login__label">
                    Пароль
                    <input class="login__input" type="password" placeholder="" name="password" required>
                </label>
                <div class="text-center">
                    <input type="submit" value="Авторизоваться" class="login__button">
                </div>
            </form>
        </div>
    </section>
</main>

<script src="{{ asset('admin-assets/js/accordeon.js') }}"></script>

</body>
</html>
