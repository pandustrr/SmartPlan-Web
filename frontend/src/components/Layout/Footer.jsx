import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-green-400">Grapadi</span> Strategix
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Platform manajemen bisnis all-in-one untuk pertumbuhan yang berkelanjutan 
                            dan kesuksesan jangka panjang.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Produk</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="#features" className="hover:text-white transition-colors">Fitur</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Integrasi</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">API</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Mobile App</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Perusahaan</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="#about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Karir</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Partner</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Support</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="#" className="hover:text-white transition-colors">Bantuan</Link></li>
                            <li><Link to="#contact" className="hover:text-white transition-colors">Kontak</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Status</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Documentation</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Grapadi Strategix. All rights reserved. | Built with ❤️ for business growth</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;