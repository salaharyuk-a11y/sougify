// Tiny storefront i18n dict (en/bn). Admin stays English per conventions.md.
// Bengali rendering: pair with the `.text-bengali` class on the rendered element.

export type Lang = 'en' | 'bn'

export type StringKey =
  | 'add_to_cart'
  | 'checkout'
  | 'place_order'
  | 'your_cart'
  | 'cart_empty'
  | 'subtotal'
  | 'delivery_charge'
  | 'total'
  | 'advance_payable'
  | 'cash_on_delivery'
  | 'phone'
  | 'name'
  | 'address'
  | 'district'
  | 'track_order'
  | 'order_placed'
  | 'continue_shopping'
  | 'search'
  | 'all_products'
  | 'out_of_stock'
  | 'quantity'
  | 'remove'
  | 'payment_method'
  | 'send_money_instructions'
  | 'transaction_id'
  // Delivery/track-page statuses (src/lib/status.ts DeliveryStatus) — shared across
  // the public /track/[code] page and any storefront delivery-status display.
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'returned'

export const STRINGS: Record<StringKey, { en: string; bn: string }> = {
  add_to_cart: { en: 'Add to cart', bn: 'কার্টে যোগ করুন' },
  checkout: { en: 'Checkout', bn: 'চেকআউট' },
  place_order: { en: 'Place order', bn: 'অর্ডার করুন' },
  your_cart: { en: 'Your cart', bn: 'আপনার কার্ট' },
  cart_empty: { en: 'Your cart is empty', bn: 'আপনার কার্ট খালি' },
  subtotal: { en: 'Subtotal', bn: 'সাবটোটাল' },
  delivery_charge: { en: 'Delivery charge', bn: 'ডেলিভারি চার্জ' },
  total: { en: 'Total', bn: 'সর্বমোট' },
  advance_payable: { en: 'Advance payable', bn: 'অগ্রিম পরিশোধযোগ্য' },
  cash_on_delivery: { en: 'Cash on delivery', bn: 'ক্যাশ অন ডেলিভারি' },
  phone: { en: 'Phone number', bn: 'ফোন নম্বর' },
  name: { en: 'Name', bn: 'নাম' },
  address: { en: 'Address', bn: 'ঠিকানা' },
  district: { en: 'District', bn: 'জেলা' },
  track_order: { en: 'Track order', bn: 'অর্ডার ট্র্যাক করুন' },
  order_placed: { en: 'Order placed', bn: 'অর্ডার সম্পন্ন হয়েছে' },
  continue_shopping: { en: 'Continue shopping', bn: 'কেনাকাটা চালিয়ে যান' },
  search: { en: 'Search', bn: 'খুঁজুন' },
  all_products: { en: 'All products', bn: 'সকল পণ্য' },
  out_of_stock: { en: 'Out of stock', bn: 'স্টক নেই' },
  quantity: { en: 'Quantity', bn: 'পরিমাণ' },
  remove: { en: 'Remove', bn: 'সরান' },
  payment_method: { en: 'Payment method', bn: 'পেমেন্ট পদ্ধতি' },
  send_money_instructions: { en: 'Send money instructions', bn: 'টাকা পাঠানোর নির্দেশনা' },
  transaction_id: { en: 'Transaction ID', bn: 'ট্রানজেকশন আইডি' },
  pending: { en: 'Pending', bn: 'অপেক্ষমাণ' },
  assigned: { en: 'Assigned', bn: 'বরাদ্দকৃত' },
  picked_up: { en: 'Picked Up', bn: 'সংগৃহীত' },
  in_transit: { en: 'In Transit', bn: 'পথে আছে' },
  delivered: { en: 'Delivered', bn: 'ডেলিভারি সম্পন্ন' },
  failed: { en: 'Failed', bn: 'ব্যর্থ' },
  returned: { en: 'Returned', bn: 'ফেরত' },
}

export function t(key: StringKey, lang: Lang = 'en'): string {
  return STRINGS[key]?.[lang] ?? STRINGS[key]?.en ?? key
}
