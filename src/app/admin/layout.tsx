'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Tags, SlidersHorizontal, BadgePercent, Megaphone, ReceiptText, Store, CreditCard, Star, Settings2, Images, Menu, X, ArrowUpRight } from 'lucide-react';
import './admin.css';

const groups = [
  { label: 'GENERAL', items: [
    { href: '/admin', label: 'Inicio', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Pedidos', icon: ReceiptText },
  ] },
  { label: 'CATÁLOGO', items: [
    { href: '/admin/products', label: 'Productos', icon: ShoppingBag },
    { href: '/admin/categories', label: 'Categorías', icon: Tags },
    { href: '/admin/options', label: 'Opciones', icon: SlidersHorizontal },
    { href: '/admin/discount', label: 'Descuentos', icon: BadgePercent },
    { href: '/admin/promotions', label: 'Promociones', icon: Megaphone },
  ] },
  { label: 'TIENDA', items: [
    { href: '/admin/dashboard', label: 'Carrusel', icon: Images },
    { href: '/admin/stores', label: 'Sucursales', icon: Store },
    { href: '/admin/paymentFormats', label: 'Medios de pago', icon: CreditCard },
    { href: '/admin/reviews', label: 'Reseñas', icon: Star },
    { href: '/admin/site-settings', label: 'Contenido y enlaces', icon: Settings2 },
  ] },
];

function currentTitle(pathname: string) {
  const item = groups.flatMap(group => group.items).find(({ href }) => href === pathname || (href !== '/admin' && pathname.startsWith(`${href}/`)));
  if (!item) return 'Administración';
  const singular: Record<string, string> = { Productos: 'producto', Categorías: 'categoría', Opciones: 'opción', Descuentos: 'descuento', Promociones: 'promoción', Sucursales: 'sucursal', Pedidos: 'pedido' };
  if (pathname.includes('/create') || pathname.endsWith('/form')) return `Crear ${singular[item.label] || item.label.toLowerCase()}`;
  if (pathname.includes('/update/') || pathname.includes('/orders/')) return `Detalle de ${singular[item.label] || item.label.toLowerCase()}`;
  return item.label;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = currentTitle(pathname);

  return <div className="admin-shell">
    {menuOpen && <button className="admin-scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
    <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
      <div className="admin-brand">
        <span className="admin-brand-mark">vm<span>.</span></span>
        <div><strong>Verde Manzana</strong><small>Panel de administración</small></div>
        <button className="admin-close-menu" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X size={20} /></button>
      </div>
      <nav aria-label="Administración" className="admin-navigation">
        {groups.map(group => <div className="admin-nav-group" key={group.label}>
          <p>{group.label}</p>
          {group.items.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? 'page' : undefined} className={`admin-nav-link ${active ? 'is-active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></Link>;
          })}
        </div>)}
      </nav>
      <Link className="admin-store-link" href="/" onClick={() => setMenuOpen(false)}>Ver tienda <ArrowUpRight size={16} /></Link>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar">
        <button className="admin-menu-button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
        <div className="admin-topbar-title"><span>ADMINISTRACIÓN</span><strong>{title}</strong></div>
        <Link href="/" className="admin-topbar-store">Ver tienda <ArrowUpRight size={15} /></Link>
      </header>
      <div className="admin-content">{children}</div>
    </div>
  </div>;
}
