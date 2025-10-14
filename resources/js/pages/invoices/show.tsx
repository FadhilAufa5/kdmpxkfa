import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { currency } from "@/lib/utils";
import { convertToTerbilang } from "@/lib/terbilang";
import { Order, OrderItem } from "@/types";


export default function ShowInvoice() {
  const { invoice, subtotal, tax, total } = usePage<{
    invoice: any;
    subtotal: number;
    tax: number;
    total: number;
  }>().props;

  const order: Order = invoice.order;
  const items: OrderItem[] = order.order_items ?? [];

  return (
    <div className="p-4 bg-white text-gray-900 font-mono text-[10px]">
      <Head title={`Invoice #${invoice.invoice_number}`} />

          
        <button
          onClick={() => window.history.back()}
          className="mb-4 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-[10px] rounded"
        >
          ← Kembali
        </button>

       
        <button
          onClick={() => window.print()}
          className="mb-4 ml-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-[10px] rounded"
        >
          Download
        </button>


      {/* Info Utama */}
      <div className="mb-4">
        <h2 className="text-sm font-bold">Invoice #{invoice.invoice_number}</h2>
        <p>
          <strong>Tanggal Invoice:</strong>{" "}
          {new Date(invoice.invoice_date).toLocaleDateString("id-ID")}
        </p>
      </div>

      {/* Informasi Pengirim & Order */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="w-full md:w-1/2">
          <h3 className="font-semibold mb-1">Informasi Pengirim</h3>
          <table className="w-full text-[10px]">  
            <tbody>
              <tr>
                <td className="font-semibold pr-1">Nama:</td>
                <td>{order.user?.apotek?.name ?? "-"}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-1">Phone:</td>
                <td>{order.user?.apotek?.phone ?? "-"}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-1">Address:</td>
                <td>{order.user?.apotek?.address ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full md:w-1/2">
          <h3 className="font-semibold mb-1">Informasi Order</h3>
          <table className="w-full text-[10px]">
            <tbody>
              <tr>
                <td className="font-semibold pr-1">No. Transaksi:</td>
                <td>{order.transaction_number}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-1">Tanggal Order:</td>
                <td>
                  {new Date(order.created_at).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
              <tr>
                <td className="font-semibold pr-1">Status:</td>
                <td className="capitalize">{order.status ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Informasi Pengiriman */}
      <h3 className="font-semibold mb-1">Informasi Pengiriman</h3>
      <table className="w-full text-[10px] border border-gray-300 mb-4">
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-1 font-semibold">Penerima</td>
            <td className="p-1">{order.shipping_name ?? order.billing_name ?? "-"}</td>
            <td className="p-1 font-semibold">Alamat</td>
            <td className="p-1">{order.shipping_address ?? order.billing_address ?? "-"}</td>
          </tr>
          <tr>
            <td className="p-1 font-semibold">Kota</td>
            <td className="p-1">{order.shipping_city ?? order.billing_city ?? "-"}</td>
            <td className="p-1 font-semibold">Provinsi / Kode Pos</td>
            <td className="p-1">
              {(order.shipping_state ?? order.billing_state ?? "-") +
                ", " +
                (order.shipping_zip ?? order.billing_zip ?? "-")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Daftar Produk */}
      <h3 className="font-semibold mb-1">Daftar Produk</h3>
      <table className="w-full border border-gray-300 mb-2 text-[10px]">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="p-1 text-left">Produk</th>
            <th className="p-1 text-center">Qty</th>
            <th className="p-1 text-right">Harga Satuan</th>
            <th className="p-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => {
            const qty = item.qty_delivered ?? item.quantity;
            const unit = item.product?.order_unit ?? "";
            const hargaSatuan = item.unit_price * item.content;
            const subtotalItem = hargaSatuan * qty;
            return (
              <tr key={item.id} className="border-t border-gray-200">
                <td className="p-1">{item.product?.name ?? "N/A"}</td>
                <td className="p-1 text-center">{qty} {unit}</td>
                <td className="p-1 text-right">{currency(hargaSatuan)}</td>
                <td className="p-1 text-right">{currency(subtotalItem)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Terbilang */}
      <div className="text-[10px] italic mb-2">
        <strong>Terbilang:</strong> <em>*{convertToTerbilang(total)} Rupiah*</em>
      </div>

      {/* Total */}
      <div className="w-full md:w-1/2 ml-auto">
        <table className="w-full text-[10px]">
          <tbody>
            <tr>
              <td className="font-semibold">Subtotal:</td>
              <td className="text-right">{currency(subtotal)}</td>
            </tr>
            <tr>
              <td className="font-semibold">Pajak (11%):</td>
              <td className="text-right">{currency(tax)}</td>
            </tr>
            <tr>
              <td className="font-bold">Total:</td>
              <td className="text-right font-bold">{currency(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tanda tangan */}
      <div className="flex justify-between mt-8 text-center">
        <div className="w-1/2">
          <p>Penerima,</p>
          <div className="mt-6 font-bold underline">{invoice.created_by ?? "____________________"}</div>
          <div className="italic text-[10px]">Pimpinan Koperasi</div>
        </div>
        <div className="w-1/2">
          <p>Dibuat Oleh,</p>
          <div className="mt-6 font-bold underline">____________________</div>
          <div className="italic text-[10px]">Apoteker</div>
        </div>
      </div>
    </div>
  );
}
