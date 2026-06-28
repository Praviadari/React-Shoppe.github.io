import { lazy } from 'react';

export const COMING_SOON_PATHS = [
  '/search',
  '/support',
  '/track-order',
  '/track',
  '/faq',
  '/shipping',
  '/contact',
  '/privacy',
  '/terms',
  '/careers',
  '/press',
  '/sustainability',
];

export const HomePage = lazy(() => import('../pages/HomePage'));
export const ShopPage = lazy(() => import('../pages/ShopPage'));
export const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
export const BuildPage = lazy(() => import('../pages/BuildPage'));
export const CollectionsPage = lazy(() => import('../pages/CollectionsPage'));
export const AboutPage = lazy(() => import('../pages/AboutPage'));
export const CartPage = lazy(() => import('../pages/CartPage'));
export const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
export const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
export const LoginPage = lazy(() => import('../pages/LoginPage'));
export const SignUpPage = lazy(() => import('../pages/SignUpPage'));
export const AccountPage = lazy(() => import('../pages/AccountPage'));
export const WishlistPage = lazy(() => import('../pages/WishlistPage'));
export const ComingSoonPage = lazy(() => import('../pages/ComingSoonPage'));
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
