{{-- <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        h1, h2, h3 {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Courier New', monospace;
            font-size: 10px; 
            margin: 25px;
            color: #111;
        }

      
        .header {
            text-align: center;
            margin-bottom: 25px;
        }

        .header h1 {
            font-size: 18px;
            font-weight: bold;
        }

        .header p {
            font-size: 10px;
            line-height: 1.4;
        }

      
        .section-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 5px;
            margin-top: 15px;
        }

       
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        table, th, td {
            border: 1px solid #888;
        }

        th, td {
            padding: 4px 6px;
            vertical-align: top;
        }

        th {
            background: #f2f2f2;
            text-align: left;
            font-size: 10px;
        }

        td {
            font-size: 9.5px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

     
        .info-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px; 
            margin-bottom: 15px;
        }

        .column {
            width: 48%; 
        }

        .info-table {
            border: none;
        }

        .info-table td {
            border: none;
            padding: 2px 4px;
        }

       
        .totals {
            width: 40%;
            margin-left: auto;
            border-collapse: collapse;
            text-align: left;
            font-size: 9.5px;
        }

        .totals td {
            border: none;
            padding: 3px 6px;
        }

        .totals .label {
            font-weight: bold;
        }

        .totals .value {
            text-align: right;
        }
        
       
        .terbilang-section {
            margin-top: 10px;
            font-size: 9.5px;
            line-height: 1.4;
        }

       
        .signature-container {  
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            text-align: center;
        }

        .signature {
            width: 45%;
        }

        .signature p {
            margin-bottom: 40px; 
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .signature-role {
            font-style: italic;
            font-size: 10px;
        }

        /* ===== UTILITY ===== */
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>PT. Kimia Farma Apotek</h1>
        <p>Jl. Budi Utomo No.1 Jakarta Pusat - Indonesia<br>
        Telepon: (021) 3857-245 | Email: sekretariat@kimiafarmaapotek.co.id</p>
    </div>

    <h2>Invoice #{{ $invoice->invoice_number }}</h2>
    <p><strong>Tanggal Invoice:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}</p>

    <!-- 🔹 Kedua tabel berdampingan -->
    <div class="info-section">
        <div class="column">
            <div class="section-title">Informasi Pengirim</div>
            <table class="info-table">
                <tr><td><strong>Nama:</strong></td><td>{{ $invoice->order->user->name }}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{{ $invoice->order->user->email }}</td></tr>
                <tr><td><strong>Apotek:</strong></td><td>{{ $invoice->order->user->apotek->name ?? '-' }}</td></tr>
            </table>
        </div>

        <div class="column">
            <div class="section-title">Informasi Order</div>
            <table class="info-table">
                <tr><td><strong>No. Transaksi:</strong></td><td>{{ $invoice->order->transaction_number }}</td></tr>
                <tr><td><strong>Tanggal Order:</strong></td><td>{{ \Carbon\Carbon::parse($invoice->order->created_at)->format('d/m/Y H:i') }}</td></tr>
                <tr><td><strong>Status:</strong></td><td>{{ ucfirst($invoice->order->status) }}</td></tr>
            </table>
        </div>
    </div>

    <div class="section-title">Informasi Pengiriman</div>
    <table class="info-table" style="width: 100%;">
        <tr>
            <td><strong>Penerima:</strong></td>
            <td>{{ $invoice->order->shipping_name ?? $invoice->order->billing_name }}</td>
            <td><strong>Alamat:</strong></td>
            <td>{{ $invoice->order->shipping_address ?? $invoice->order->billing_address }}</td>
        </tr>
        <tr>
            <td><strong>Kota:</strong></td>
            <td>{{ $invoice->order->shipping_city ?? $invoice->order->billing_city }}</td>
            <td><strong>Provinsi / Kode Pos:</strong></td>
            <td>{{ $invoice->order->shipping_state ?? $invoice->order->billing_state }},
                {{ $invoice->order->shipping_zip ?? $invoice->order->billing_zip }}</td>
        </tr>
    </table>

    <div class="section-title">Daftar Produk</div>
    <table>
        <thead>
            <tr>
                <th>Produk</th>
                <th class="text-center">Qty Dikirim</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->order->orderItems as $item)
                @php
                    $qty = $item->qty_delivered ?? $item->quantity;
                    $subtotalItem = $item->unit_price * $item->content * $qty;
                @endphp
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="text-center">{{ $qty }} {{ $item->product->order_unit }}</td>
                    <td class="text-right">Rp {{ number_format($item->unit_price * $item->content, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($subtotalItem, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @php
        use App\Helpers\TerbilangHelper;
        $subtotal = $invoice->order->orderItems->sum(fn($i) => $i->unit_price * $i->content * ($i->qty_delivered ?? $i->quantity));
        $tax = round($subtotal * 0.11);
        $total = $subtotal + $tax;
        $terbilang = ucwords(TerbilangHelper::terbilang($total)) . ' Rupiah';
    @endphp

    <div class="terbilang-section">
        <strong>Terbilang:</strong> <em>*{{ $terbilang }}*</em>
    </div>

    <table class="totals">
        <tr><td class="label">Subtotal:</td><td class="value">Rp {{ number_format($subtotal, 0, ',', '.') }}</td></tr>
        <tr><td class="label">Pajak (11%):</td><td class="value">Rp {{ number_format($tax, 0, ',', '.') }}</td></tr>
        <tr><td class="label">Total:</td><td class="value"><strong>Rp {{ number_format($total, 0, ',', '.') }}</strong></td></tr>
    </table>

    <div class="signature-container">
        <div class="signature">
            <p>Dibuat oleh,</p>
            <div class="signature-name">{{ $invoice->created_by ?? '____________________' }}</div>
            <div class="signature-role">Apoteker</div>
        </div>
    </div>
    <div class="signature-container">
        <div class="signature">
            <p>Dibuat oleh,</p>
            <div class="signature-name">{{ $invoice->created_by ?? '____________________' }}</div>
            <div class="signature-role">Menyetujui</div>
        </div>
    </div>

</body>
</html> --}}
