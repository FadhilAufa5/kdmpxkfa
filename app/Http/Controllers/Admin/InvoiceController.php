<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function show(Invoice $invoice)
    {
        
        $invoice->load([
            'order.user.apotek',
            'order.orderItems.product',
        ]);
        // dd($invoice);
       
        $subtotal = $invoice->order->orderItems->sum(function ($item) {
            $qty = $item->qty_delivered ?? $item->quantity;
            return $item->unit_price * $item->content * $qty;
        });

        $tax = round($subtotal * 0.11);
        $total = $subtotal + $tax;

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ]);
    }
}
