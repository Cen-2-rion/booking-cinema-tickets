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
    public function index()
    {
        $movies = Movie::with(['screenings' => function($query) {
            $query->where('start_time', '>=', now())
                ->orderBy('start_time');
        }, 'screenings.hall'])->get();

        $dates = $this->generateDates();

        return view('client.index', compact('movies', 'dates'));
    }

    public function showHall(Screening $screening)
    {
        $screening->load(['movie', 'hall.seats', 'tickets.seat']);
        return view('client.hall', compact('screening'));
    }

    public function processPayment(Request $request)
    {
        $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seats' => 'required|array',
        ]);

        // Сохраняем выбранные места в сессии
        $request->session()->put('booking_data', [
            'screening_id' => $request->screening_id,
            'seats' => $request->seats
        ]);

        return response()->json(['success' => true]);
    }

    public function showPayment(Request $request)
    {
        $bookingData = $request->session()->get('booking_data');
        if (!$bookingData) {
            return redirect('/');
        }

        $screening = Screening::with('movie', 'hall')->find($bookingData['screening_id']);
        $selectedSeats = Seat::whereIn('id', $bookingData['seats'])->get();
        $seatNumbers = $selectedSeats->map(function($seat) {
            return "Ряд {$seat->row_number}, Место {$seat->seat_number}";
        })->implode(', ');

        // Расчет стоимости
        $totalPrice = $selectedSeats->sum(function($seat) {
            return $seat->type === 'vip' ? 350 : 250;
        });

        return view('client.payment', [
            'screening' => $screening,
            'selectedSeats' => $seatNumbers,
            'totalPrice' => $totalPrice
        ]);
    }

    public function generateTicket(Request $request)
    {
        $bookingData = $request->session()->get('booking_data');
        if (!$bookingData) {
            return redirect('/');
        }

        // Создаем билеты
        $tickets = [];
        foreach ($bookingData['seats'] as $seatId) {
            $qrCode = QrCode::size(200)->generate(uniqid());
            $tickets[] = Ticket::create([
                'screening_id' => $bookingData['screening_id'],
                'seat_id' => $seatId,
                'qr_code' => $qrCode,
            ]);
        }

        // Очищаем сессию
        $request->session()->forget('booking_data');

        return view('client.ticket', [
            'ticket' => $tickets[0], // Берем первый билет для отображения
            'seats' => Seat::whereIn('id', $bookingData['seats'])
                ->get()
                ->map(function($seat) {
                    return "Ряд {$seat->row_number}, Место {$seat->seat_number}";
                })
                ->implode(', ')
        ]);
    }

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
                'is_chosen' => $i === 2 // Пример: третий день выбран по умолчанию
            ];
        }

        return $dates;
    }
}
