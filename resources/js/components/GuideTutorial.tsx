import React, { useEffect } from "react";
import { motion, useAnimation, Variants, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";

interface Step {
  title: string;
  desc: string;
  media?: string;
  type?: "image" | "video";
}

const steps: Step[] = [
  {
    title: "1. Pilih Produk",
    desc: "Telusuri katalog dan pilih produk yang ingin Anda beli. Gunakan fitur pencarian atau filter kategori untuk mempermudah.",
    media: "/product.png",
    type: "image",
  },
  {
    title: "2. Lihat Detail Produk",
    desc: "Klik produk untuk melihat detail lengkap seperti deskripsi, ukuran, aturan, dan fungsi obat",
    media: "/detail.gif",
    type: "video",
  },
  {
    title: "3. Tambahkan ke Keranjang",
    desc: "Tekan tombol 'Tambah ke Keranjang' untuk menyimpan produk pilihan Anda sebelum melakukan checkout.",
    media: "/cek keranjang.gif",
    type: "video",
  },
  {
    title: "4. Periksa Keranjang",
    desc: "Buka halaman keranjang untuk memeriksa kembali produk, jumlah, dan total harga sebelum melanjutkan.",
    media: "/cartt.png",
    type: "image",
  },
  {
    title: "5. Isi Data Pengiriman",
    desc: "Masukkan alamat pengiriman dan pilih metode pengiriman sesuai kebutuhan Anda.",
    media: "/form.png",
    type: "image",
  },
  {
    title: "6. Pilih Metode Pembayaran",
    desc: "Pilih metode pembayaran yang diinginkan seperti Virtual Account Bank",
    media: "/pay.gif",
    type: "video",
  },
  {
    title: "7. Selesaikan Pesanan",
    desc: "Klik tombol 'Paket Sudah Diterima' untuk menyelesaikan Pemesananan dan konfirmasi penerimaan produk.",
    media: "/acc1.png",
    type: "image",
  },
];

const GuideTutorial = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="bg-gray-50 py-20 px-4 relative overflow-hidden">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Panduan Pemesanan Produk
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Ikuti langkah-langkah berikut untuk melakukan pemesanan dengan mudah dan cepat.
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full rounded-full overflow-hidden z-0">
          <motion.div
            className="absolute left-0 top-0 w-full bg-blue-500 rounded-full origin-top"
            style={{ scaleY: smoothProgress }}
          />
        </div>

        <div className="flex flex-col gap-16 relative z-10">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            const controls = useAnimation();
            const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

            useEffect(() => {
              if (inView) controls.start("visible");
            }, [inView, controls]);

            return (
              <motion.div
                key={i}
                ref={ref}
                custom={i}
                initial="hidden"
                animate={controls}
                variants={cardVariants}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  isLeft ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Titik tengah garis timeline */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white z-10 shadow" />

                {/* Kartu teks */}
                <Card className="md:w-1/2 bg-white shadow-lg rounded-2xl hover:shadow-xl transition">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>

                {/* Gambar / GIF */}
                <div className="md:w-1/2 flex justify-center">
                  <img
                    src={step.media}
                    alt={step.title}
                    className="rounded-xl shadow-md w-full md:w-5/6 h-auto md:h-64 object-contain md:object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div> 
    </section>
  );
};

export default GuideTutorial;
