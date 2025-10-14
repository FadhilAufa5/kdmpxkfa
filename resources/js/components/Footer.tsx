import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, LayoutGrid, ShoppingCart, History } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="mt-16 bg-gray-900 text-gray-300">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4">
                {/* Brand */}
                <div>
                    <img src="/Logo KFA member of BioFarma 300x300-01.png" alt="KFA Logo" className="mb-3 h-20 w-auto" />
                    <p className="mt-3 text-sm">Kimia Farma Apotek - Member of BioFarma.</p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">KFA</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href={route('dashboard', [], false)} className="hover:text-white flex items-center gap-2">
                               Beranda
                            </Link>
                        </li>
                        <li>
                            <Link href={route('orders.products', [], false)} className="hover:text-white flex items-center gap-2">
                                Produk
                            </Link>
                        </li>
                        <li>
                            {/* <Link href={route('history.index', [], false)} className="hover:text-white flex items-center gap-2">
                                <History size={16} /> Riwayat Pesanan
                            </Link> */}
                        </li>
                        <li>
                            {/* <Link href={route('about', [], false)} className="hover:text-white">
                                Tentang Kami
                            </Link> */}
                        </li>
                        <li>
                            {/* <Link href={route('contact', [], false)} className="hover:text-white">
                                Kontak
                            </Link> */}
                        </li>
                        <li>
                            <Link href={route('faq', [], false)} className="hover:text-white">
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Kontak</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone size={16} /> 021-3857-245
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={16} /> sekretariat@kimiafarmaapotek.co.id
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> Jl. Budi Utomo No.1 Jakarta Pusat
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Ikuti Kami</h3>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" className="hover:text-white">
                            <Facebook size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" className="hover:text-white">
                            <Instagram size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" className="hover:text-white">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Kimia Farma Apotek. All rights reserved.
            </div>
        </footer>
    );
}
