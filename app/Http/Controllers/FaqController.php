<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        
       $faqs = [
    [
        'question' => 'Bagaimana cara melakukan pemesanan?',
        'answer' => 'Anda bisa memilih produk, menambahkannya ke keranjang, lalu melakukan checkout.'
    ],
    // [
    //     'question' => 'Apa metode pembayaran yang tersedia?',
    //     'answer' => 'Kami menerima transfer bank, .'
    // ],
    [
        'question' => 'Berapa lama pengiriman?',
        'answer' => 'Pengiriman standar 2-5 hari kerja, tergantung lokasi Anda.'
    ],
    [
        'question' => 'Bisakah saya membatalkan pesanan?',
        'answer' => 'Pembatalan bisa dilakukan sebelum pesanan dikirim. Silakan hubungi layanan pelanggan.'
    ],
   
    [
        'question' => 'Apa itu Paket Koperasi Merah Putih?',
        'answer' => 'Paket Koperasi Merah Putih adalah paket obat lengkap senilai 30 juta rupiah yang dirancang untuk memenuhi kebutuhan koperasi Anda dengan produk-produk kesehatan berkualitas.'
    ],
    [
        'question' => 'Apa saja isi Paket Koperasi Merah Putih?',
        'answer' => 'Paket ini berisi berbagai macam obat dan produk kesehatan pilihan yang sesuai untuk melengkapi stok koperasi Anda. Daftar produk dapat disesuaikan dengan kebutuhan dan ketersediaan.'
    ],
    [
        'question' => 'Bagaimana cara memesan Paket Koperasi Merah Putih?',
        'answer' => 'Pilih menu Paket Koperasi Merah Putih di situs kami, lengkapi formulir pemesanan, dan ikuti instruksi pembayaran yang diberikan.'
    ],
];


        return Inertia::render('faq/index', [
            'faqs' => $faqs
        ]);
    }
}
