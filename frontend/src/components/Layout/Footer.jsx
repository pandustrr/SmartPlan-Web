import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-900/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-900/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <h3 className="text-3xl font-bold mb-4">
                            <span style={{ color: '#167814' }}>Grapadi</span> Strategix
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                            Platform manajemen bisnis all-in-one yang dirancang untuk membantu bisnis
                            Anda tumbuh lebih cepat dengan analisis AI, perencanaan strategis, dan
                            manajemen keuangan yang powerful.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                                <Mail size={18} style={{ color: '#10b517' }} />
                                <a href="mailto:support@grapadistrategix.com">support@grapadistrategix.com</a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                                <Phone size={18} style={{ color: '#10b517' }} />
                                <a href="tel:+6281234567890">+62 812-3456-7890</a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin size={18} style={{ color: '#10b517' }} />
                                <span>Jakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Produk</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="#features" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Fitur Utama</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Business Plan</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Financial Management</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">AI Forecast</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Perusahaan</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="#about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Tentang Kami</Link></li>
                            <li><Link to="#contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Hubungi Kami</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Blog & Resources</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Karir</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Partner Program</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <div className="text-gray-400 text-sm text-center md:text-left">
                            <p>&copy; 2025 Grapadi Strategix. All rights reserved.</p>
                            <p className="mt-1">Built with <span style={{ color: '#10b517' }}></span> for business growth</p>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} className="text-gray-400 hover:text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} className="text-gray-400 hover:text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} className="text-gray-400 hover:text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} className="text-gray-400 hover:text-white" />
                            </a>
                        </div>

                        {/* Legal Links */}
                        <div className="flex gap-6 text-sm text-gray-400">
                            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;