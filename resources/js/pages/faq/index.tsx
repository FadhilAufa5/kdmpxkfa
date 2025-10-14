import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from '@inertiajs/react';

interface FaqProps {
    faqs: { question: string; answer: string }[];
}

const Faq: React.FC<FaqProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logos */}
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <img
                                src="/Logo KFA member of BioFarma 300x300-01.png"
                                alt="Logo 1"
                                className="h-18 w-auto"
                            />
                        </Link>
                        <Link href="/">
                            <img
                                src="/danantara.webp"
                                alt="Logo 2"
                                className="h-18 w-auto"
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Section FAQ */}
            <section className="pt-32 pb-20 px-4 bg-gray-50 min-h-screen">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">FAQ</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Pertanyaan yang sering diajukan mengenai produk dan layanan kami.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card
                                className="bg-white rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
                                onClick={() => toggle(i)}
                            >
                                <CardContent className="flex justify-between items-center p-4">
                                    <span className="text-gray-800 font-semibold">{faq.question}</span>
                                    <span>
                                        {openIndex === i ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </span>
                                </CardContent>
                                {openIndex === i && (
                                    <div className="px-4 pb-4 text-gray-600 text-sm sm:text-base">
                                        {faq.answer}
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Faq;
