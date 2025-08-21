<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Seat;
use App\Models\Movie;
use App\Models\Screening;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
            ->whereHas('hall', fn($q) => $q->where('is_active', true))->get()->map(fn($s) => [
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

    // Инфо зала, остальное загружается через hall.js
    public function showHall(Screening $screening)
    {
        $movie = $screening->movie;
        $hall = $screening->hall;

        return view('client.hall', compact('screening','movie', 'hall'));
    }

    // Сохраняем выбор мест
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seats' => 'required|array',
        ]);

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

        $seatNumbers = $selectedSeats->map(fn($seat) =>
        "Ряд {$seat->row_number}, Место {$seat->seat_number}"
        )->implode(', ');

        $totalPrice = $selectedSeats->sum(fn($seat) =>
        $seat->type === 'vip' ? 650 : 350
        );

        return view('client.payment', [
            'screening' => $screening,
            'selectedSeats' => $seatNumbers,
            'totalPrice' => $totalPrice
        ]);
    }

    // Генерация билета
    public function generateTicket(Request $request)
    {
        $bookingData = $request->session()->get('booking_data');
        if (!$bookingData) return redirect('/');

        $tickets = [];
        foreach ($bookingData['seats'] as $seatId) {
            $qr = QrCode::format('png')->size(200)->generate(uniqid());
            $tickets[] = Ticket::create([
                'screening_id' => $bookingData['screening_id'],
                'seat_id' => $seatId,
                'qr_code' => base64_encode($qr),
            ]);
        }

        $request->session()->forget('booking_data');

        return view('client.ticket', ['ticket' => $tickets[0]]);
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
