<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    public function book(Request $request)
    {
        $validated = $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seat_id' => 'required|exists:seats,id',
        ]);

        $qrCode = QrCode::size(200)->generate(uniqid());

        $ticket = Ticket::create([
            'screening_id' => $validated['screening_id'],
            'seat_id' => $validated['seat_id'],
            'qr_code' => $qrCode,
        ]);

        return response()->json([
            'ticket' => $ticket,
            'qr_code' => $qrCode,
        ]);
    }
}
