// Storefront copy for the Algeria-first Sougify experience.
export type Lang = 'ar' | 'fr' | 'en' | 'bn'

export type StringKey =
  | 'add_to_cart' | 'checkout' | 'place_order' | 'your_cart' | 'cart_empty'
  | 'subtotal' | 'delivery_charge' | 'total' | 'advance_payable' | 'cash_on_delivery'
  | 'phone' | 'name' | 'address' | 'district' | 'track_order' | 'order_placed'
  | 'continue_shopping' | 'search' | 'all_products' | 'out_of_stock' | 'quantity'
  | 'remove' | 'payment_method' | 'send_money_instructions' | 'transaction_id'
  | 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'returned'

type LocalizedString = { ar: string; fr: string; en: string; bn: string }

export const STRINGS: Record<StringKey, LocalizedString> = {
  add_to_cart: { ar: 'أضف إلى السلة', fr: 'Ajouter au panier', en: 'Add to cart', bn: 'কার্টে যোগ করুন' },
  checkout: { ar: 'إتمام الطلب', fr: 'Finaliser la commande', en: 'Checkout', bn: 'চেকআউট' },
  place_order: { ar: 'تأكيد الطلب', fr: 'Confirmer la commande', en: 'Place order', bn: 'অর্ডার করুন' },
  your_cart: { ar: 'سلة التسوق', fr: 'Votre panier', en: 'Your cart', bn: 'আপনার কার্ট' },
  cart_empty: { ar: 'سلة التسوق فارغة', fr: 'Votre panier est vide', en: 'Your cart is empty', bn: 'আপনার কার্ট খালি' },
  subtotal: { ar: 'المجموع الفرعي', fr: 'Sous-total', en: 'Subtotal', bn: 'সাবটোটাল' },
  delivery_charge: { ar: 'رسوم التوصيل', fr: 'Frais de livraison', en: 'Delivery charge', bn: 'ডেলিভারি চার্জ' },
  total: { ar: 'الإجمالي', fr: 'Total', en: 'Total', bn: 'সর্বমোট' },
  advance_payable: { ar: 'التسبيق المطلوب', fr: 'Avance à payer', en: 'Advance payable', bn: 'অগ্রিম পরিশোধযোগ্য' },
  cash_on_delivery: { ar: 'الدفع عند الاستلام', fr: 'Paiement à la livraison', en: 'Cash on delivery', bn: 'ক্যাশ অন ডেলিভারি' },
  phone: { ar: 'رقم الهاتف', fr: 'Téléphone', en: 'Phone number', bn: 'ফোন নম্বর' },
  name: { ar: 'الاسم الكامل', fr: 'Nom complet', en: 'Name', bn: 'নাম' },
  address: { ar: 'العنوان', fr: 'Adresse', en: 'Address', bn: 'ঠিকানা' },
  district: { ar: 'الولاية', fr: 'Wilaya', en: 'District', bn: 'জেলা' },
  track_order: { ar: 'تتبع الطلب', fr: 'Suivre la commande', en: 'Track order', bn: 'অর্ডার ট্র্যাক করুন' },
  order_placed: { ar: 'تم تسجيل الطلب', fr: 'Commande enregistrée', en: 'Order placed', bn: 'অর্ডার সম্পন্ন হয়েছে' },
  continue_shopping: { ar: 'مواصلة التسوق', fr: 'Continuer vos achats', en: 'Continue shopping', bn: 'কেনাকাটা চালিয়ে যান' },
  search: { ar: 'بحث', fr: 'Rechercher', en: 'Search', bn: 'খুঁজুন' },
  all_products: { ar: 'كل المنتجات', fr: 'Tous les produits', en: 'All products', bn: 'সকল পণ্য' },
  out_of_stock: { ar: 'غير متوفر حالياً', fr: 'Rupture de stock', en: 'Out of stock', bn: 'স্টক নেই' },
  quantity: { ar: 'الكمية', fr: 'Quantité', en: 'Quantity', bn: 'পরিমাণ' },
  remove: { ar: 'حذف', fr: 'Retirer', en: 'Remove', bn: 'সরান' },
  payment_method: { ar: 'طريقة الدفع', fr: 'Mode de paiement', en: 'Payment method', bn: 'পেমেন্ট পদ্ধতি' },
  send_money_instructions: { ar: 'تعليمات الدفع', fr: 'Instructions de paiement', en: 'Payment instructions', bn: 'টাকা পাঠানোর নির্দেশনা' },
  transaction_id: { ar: 'رقم العملية', fr: 'Référence de transaction', en: 'Transaction ID', bn: 'ট্রানজেকশন আইডি' },
  pending: { ar: 'قيد الانتظار', fr: 'En attente', en: 'Pending', bn: 'অপেক্ষমাণ' },
  assigned: { ar: 'تم التعيين', fr: 'Assignée', en: 'Assigned', bn: 'বরাদ্দকৃত' },
  picked_up: { ar: 'تم الاستلام', fr: 'Récupérée', en: 'Picked up', bn: 'সংগৃহীত' },
  in_transit: { ar: 'في الطريق', fr: 'En transit', en: 'In transit', bn: 'পথে আছে' },
  delivered: { ar: 'تم التسليم', fr: 'Livrée', en: 'Delivered', bn: 'ডেলিভারি সম্পন্ন' },
  failed: { ar: 'تعذر التسليم', fr: 'Échec', en: 'Failed', bn: 'ব্যর্থ' },
  returned: { ar: 'تم الإرجاع', fr: 'Retournée', en: 'Returned', bn: 'ফেরত' },
}

export function t(key: StringKey, lang: Lang = 'ar'): string {
  return STRINGS[key]?.[lang] ?? STRINGS[key]?.ar ?? key
}
