<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Seat;
use App\Models\Movie;
use App\Models\Screening;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use QRcode;

class ClientController extends Controller
{
    // Главная страница – только даты, остальное загружается через client.js
    public function index()
    {
        $dates = $this->generateDates(Carbon::today());

        return view('client.index', ['dates' => $dates]);
    }

    public function getClientData()
    {
        $screenings = Screening::with(['movie', 'hall'])
            ->whereHas('hall', fn($q) => $q->where('is_active', true))
            ->orderBy('start_time')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'hall_id' => $s->hall_id,
                'movie_id' => $s->movie_id,
                'start_time' => $s->start_time->format('H:i'),
            ]);

        $halls = Hall::whereIn('id', $screenings->pluck('hall_id'))->get();
        $movies = Movie::whereIn('id', $screenings->pluck('movie_id'))->get();

        return response()->json([
            'halls' => $halls,
            'movies' => $movies,
            'screenings' => $screenings,
        ]);
    }

    // Сохраняем выбор мест
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seats' => 'required|array',
            'seat_numbers' => 'required|array',
        ]);

        $request->session()->put('booking_data', $validated);

        return response()->json(['success' => true]);
    }

    // Универсальная функция для страницы оплаты и билета
    private function getBookingData(Request $request)
    {
        $bookingData = $request->session()->get('booking_data');

        $screening = Screening::with(['movie', 'hall'])->findOrFail($bookingData['screening_id']);
        $selectedSeats = Seat::whereIn('id', $bookingData['seats'])->get();
//        $seatNumbers = implode(', ', $bookingData['seat_numbers']);
        $seatNumbers = collect($bookingData['seat_numbers'])
            ->groupBy(fn($number, $index) => $selectedSeats[$index]->row_number)
            ->map(fn($numbers, $row) => "Ряд $row: " . $numbers->implode(', '))
            ->implode('; ');

        $totalPrice = $selectedSeats->sum(fn($s) =>
            $s->type === 'vip' ? $screening->hall->price->vip_price : $screening->hall->price->standart_price
        );

        return compact('screening', 'seatNumbers', 'totalPrice');
    }

    // Страница оплаты
    public function showPayment(Request $request)
    {
        $data = $this->getBookingData($request);

        return view('client.payment', $data);
    }

    // Генерация билета
    public function generateTicket(Request $request)
    {
        $data = $this->getBookingData($request);

        // Содержимое QR-кода
        $text = implode('|', [
            $data['screening']->movie->title,
            $data['screening']->hall->name,
            $data['screening']->start_time->format('H:i'),
            $data['seatNumbers'],
        ]);

        $bookingData = $request->session()->get('booking_data');
        foreach ($bookingData['seats'] as $seatId) {
            Ticket::firstOrCreate(
                [
                    'screening_id' => $data['screening']->id,
                    'seat_id' => $seatId,
                ],
                [
                    'qr_code' => Str::uuid(),
                ]
            );
        }

        ob_start(); // включаем буферизацию
        QRcode::png($text, false, 'L', 5, 2); // формируем qr-код с текстом
        $pngData = ob_get_clean(); // достаём и очищаем буфер
        $data['qrCode'] = base64_encode($pngData); // преобразуем в читаемый формат

        return view('client.ticket', $data);
    }

    // Генерация дат
    private function generateDates(Carbon $current)
    {
        $today = Carbon::today();
        $dates = [];

        for ($i = 0; $i < 7; $i++) {
            $date = $today->copy()->addDays($i);
            $dates[] = [
                'day_week' => mb_ucfirst($date->isoFormat('dd')),
                'day_number' => $date->day,
                'is_today' => $date->isToday(),
                'is_chosen' => $date->isSameDay($current),
            ];
        }

        return $dates;
    }
}
