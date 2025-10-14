import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Method {
  name: string;
  desc: string;
  image: string;
}

const methods: Method[] = [
  {
    name: "JNE Express",
    desc: "Pengiriman cepat ke seluruh Indonesia",
    image: "/jne.png",
  },
  {
    name: "POS Indonesia",
    desc: "Jaringan logistik Indonesia terpercaya",
    image: "/pos.png",
  },
];

const ShippingMethods = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Metode Pengiriman
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Kami bekerja sama dengan berbagai ekspedisi terpercaya untuk
          memastikan produk Anda sampai tepat waktu dan dalam kondisi terbaik.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-xl mx-auto">
        {methods.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 aspect-square flex items-center justify-center">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 object-contain mb-3 sm:mb-4"
                />
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                  {m.name}
                </h3>
                <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm leading-snug">
                  {m.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ShippingMethods;
