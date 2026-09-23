'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '../pages/api/authService';
import { getWhatsAppQRCode, deleteWhatsAppSession } from '../pages/api/whatsapp';
import { ShoppingBag, ReceiptText, Tags, SlidersHorizontal, BadgePercent, Megaphone, Images, Store, CreditCard, Star, Settings2, ArrowUpRight, LogOut, QrCode, RotateCcw } from 'lucide-react';

const sections = [
  { title: 'Pedidos', caption: 'Ventas y seguimiento', href: '/admin/orders', icon: ReceiptText },
  { title: 'Productos', caption: 'Catálogo y orden', href: '/admin/products', icon: ShoppingBag },
  { title: 'Categorías', caption: 'Organización del catálogo', href: '/admin/categories', icon: Tags },
  { title: 'Opciones', caption: 'Colores y tamaños', href: '/admin/options', icon: SlidersHorizontal },
  { title: 'Descuentos', caption: 'Ofertas del catálogo', href: '/admin/discount', icon: BadgePercent },
  { title: 'Promociones', caption: 'Beneficios de pago', href: '/admin/promotions', icon: Megaphone },
  { title: 'Carrusel', caption: 'Imágenes de inicio', href: '/admin/dashboard', icon: Images },
  { title: 'Sucursales', caption: 'Locales y contacto', href: '/admin/stores', icon: Store },
  { title: 'Medios de pago', caption: 'Opciones disponibles', href: '/admin/paymentFormats', icon: CreditCard },
  { title: 'Reseñas', caption: 'Opiniones de clientes', href: '/admin/reviews', icon: Star },
  { title: 'Contenido y enlaces', caption: 'Contacto y redes', href: '/admin/site-settings', icon: Settings2 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleLogout = async () => {
    try { await logout(); router.push('/login'); }
    catch (error) { console.error('Error logging out:', error); }
  };

  const handleGenerateQR = async () => {
    if (!window.confirm('¿Estás seguro de generar el código QR de WhatsApp?')) return;
    try { const data = await getWhatsAppQRCode(); setQrCode(data.qrCode); }
    catch { alert('No se pudo generar el código QR. Verifica que el cliente de WhatsApp esté listo.'); }
  };

  const handleDeleteSession = async () => {
    if (!window.confirm('¿Estás seguro de eliminar la sesión de WhatsApp y generar un nuevo QR?')) return;
    try { await deleteWhatsAppSession(); alert('Sesión de WhatsApp eliminada. Por favor, genera un nuevo QR.'); setQrCode(null); }
    catch { alert('Error eliminando la sesión de WhatsApp.'); }
  };

  return <div className="admin-home">
    <p className="admin-eyebrow">PANEL DE CONTROL</p>
    <h1>Tu tienda, en un solo lugar</h1>
    <p className="admin-home-intro">Elegí una sección para gestionar el contenido y la operación de Verde Manzana.</p>
    <div className="admin-quick-actions" aria-label="Acciones rápidas">
      <Link href="/admin/products/create">Añadir producto</Link>
      <Link href="/admin/categories/form">Añadir categoría</Link>
      <Link href="/admin/discount/create">Añadir descuento</Link>
      <Link href="/admin/stores/create">Añadir sucursal</Link>
    </div>
    <section className="admin-home-section" aria-labelledby="admin-sections-title">
      <h2 id="admin-sections-title">Secciones</h2>
      <div className="admin-home-grid">
        {sections.map(({ title, caption, href, icon: Icon }) => <Link className="admin-home-card" href={href} key={href}>
          <span className="admin-home-card-icon"><Icon size={18} strokeWidth={1.8} /></span>
          <span className="admin-home-card-bottom"><span><strong>{title}</strong><small>{caption}</small></span><ArrowUpRight size={17} /></span>
        </Link>)}
      </div>
    </section>
    <section className="admin-home-tools" aria-labelledby="admin-tools-title">
      <h2 id="admin-tools-title">Herramientas</h2>
      <button type="button" onClick={handleGenerateQR}><QrCode size={16} className="inline mr-2" />Generar QR de WhatsApp</button>
      <button type="button" onClick={handleDeleteSession}><RotateCcw size={16} className="inline mr-2" />Eliminar sesión de WhatsApp</button>
      <button type="button" onClick={handleLogout}><LogOut size={16} className="inline mr-2" />Cerrar sesión</button>
    </section>
    {qrCode && <div className="admin-qr"><p className="mb-3 font-semibold">Código QR de WhatsApp</p><img src={qrCode} alt="Código QR para conectar WhatsApp" /></div>}
  </div>;
}
