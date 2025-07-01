<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Screening;
use App\Models\Ticket;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ClientController extends Controller
{
    // Главная страница с выбором фильма и сеансов
    public function index()
    {
        $movies = Movie::with(['screenings' => function($query) {
            $query->where('start_time', '>=', now())
                ->orderBy('start_time');
        }, 'screenings.hall'])->get();

        $dates = $this->generateDates();

        return view('client.index', compact('movies', 'dates'));
    }

    // Отображение плана зала для выбранного сеанса
    public function showHall(Screening $screening)
    {
        $screening->load(['movie', 'hall.seats', 'tickets.seat']);

        return view('client.hall', compact('screening'));
    }

    // Обработка выбора мест
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seats' => 'required|array',
        ]);

        // Сохраняем в сессию
        $request->session()->put('booking_data', $validated);

        return response()->json(['success' => true]);
    }

    // Страница оплаты
    public function showPayment(Request $request)
    {
        $bookingData = $request->session()->get('booking_data');
        if (!$bookingData) return redirect('/');

        $screening = Screening::with('movie', 'hall')->find($bookingData['screening_id']);
        $selectedSeats = Seat::whereIn('id', $bookingData['seats'])->get();

        $seatNumbers = $selectedSeats->map(function($seat) {
            return "Ряд {$seat->row_number}, Место {$seat->seat_number}";
        })->implode(', ');

        // Расчет стоимости
        $totalPrice = $selectedSeats->sum(function($seat) {
            return $seat->type === 'vip' ? 650 : 350;
        });

        return view('client.payment', [
            'screening' => $screening,
            'selectedSeats' => $seatNumbers,
            'totalPrice' => $totalPrice
        ]);
    }

    // Завершение покупки - финальное бронирование билетов
    public function generateTicket(Request $request)
    {
        $bookingData = $request->session()->get('booking_data');
        if (!$bookingData) return redirect('/');

        // Создаём билеты
        $tickets = [];
        foreach ($bookingData['seats'] as $seatId) {
            $qr = QrCode::format('png')->size(200)->generate(uniqid());
            $tickets[] = Ticket::create([
                'screening_id' => $bookingData['screening_id'],
                'seat_id' => $seatId,
                'qr_code' => base64_encode($qr),
            ]);
        }

        // Очищаем сессию
        $request->session()->forget('booking_data');
        return view('client.ticket', ['ticket' => $tickets[0]]);
    }

    // Генерация списка дат для выбора (неделя вперёд)
    private function generateDates()
    {
        $dates = [];
        $today = Carbon::today();

        for ($i = 0; $i < 7; $i++) {
            $date = $today->copy()->addDays($i);
            $dates[] = [
                'day_week' => $date->isoFormat('dd'),
                'day_number' => $date->day,
                'is_today' => $date->isToday(),
                'is_chosen' => $i === 2 // например 3й день по умолчанию выбран
            ];
        }

        return $dates;
    }
}
