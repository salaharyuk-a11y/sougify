// Bangladesh divisions/districts reference data. Used by address forms,
// delivery zones (delivery_zones.districts text[]), and customer_addresses.district.

export const BD_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
] as const

export type BdDivision = (typeof BD_DIVISIONS)[number]

export interface BdDistrict {
  name: string
  division: BdDivision
}

/** All 64 districts, official post-2018 naming (Chattogram, Cumilla, Jashore, Barishal, Bogura…). */
export const BD_DISTRICTS: BdDistrict[] = [
  // Dhaka division (13)
  { name: 'Dhaka', division: 'Dhaka' },
  { name: 'Faridpur', division: 'Dhaka' },
  { name: 'Gazipur', division: 'Dhaka' },
  { name: 'Gopalganj', division: 'Dhaka' },
  { name: 'Kishoreganj', division: 'Dhaka' },
  { name: 'Madaripur', division: 'Dhaka' },
  { name: 'Manikganj', division: 'Dhaka' },
  { name: 'Munshiganj', division: 'Dhaka' },
  { name: 'Narayanganj', division: 'Dhaka' },
  { name: 'Narsingdi', division: 'Dhaka' },
  { name: 'Rajbari', division: 'Dhaka' },
  { name: 'Shariatpur', division: 'Dhaka' },
  { name: 'Tangail', division: 'Dhaka' },
  // Chattogram division (11)
  { name: 'Bandarban', division: 'Chattogram' },
  { name: 'Brahmanbaria', division: 'Chattogram' },
  { name: 'Chandpur', division: 'Chattogram' },
  { name: 'Chattogram', division: 'Chattogram' },
  { name: 'Cumilla', division: 'Chattogram' },
  { name: "Cox's Bazar", division: 'Chattogram' },
  { name: 'Feni', division: 'Chattogram' },
  { name: 'Khagrachhari', division: 'Chattogram' },
  { name: 'Lakshmipur', division: 'Chattogram' },
  { name: 'Noakhali', division: 'Chattogram' },
  { name: 'Rangamati', division: 'Chattogram' },
  // Rajshahi division (8)
  { name: 'Bogura', division: 'Rajshahi' },
  { name: 'Joypurhat', division: 'Rajshahi' },
  { name: 'Naogaon', division: 'Rajshahi' },
  { name: 'Natore', division: 'Rajshahi' },
  { name: 'Chapainawabganj', division: 'Rajshahi' },
  { name: 'Pabna', division: 'Rajshahi' },
  { name: 'Rajshahi', division: 'Rajshahi' },
  { name: 'Sirajganj', division: 'Rajshahi' },
  // Khulna division (10)
  { name: 'Bagerhat', division: 'Khulna' },
  { name: 'Chuadanga', division: 'Khulna' },
  { name: 'Jashore', division: 'Khulna' },
  { name: 'Jhenaidah', division: 'Khulna' },
  { name: 'Khulna', division: 'Khulna' },
  { name: 'Kushtia', division: 'Khulna' },
  { name: 'Magura', division: 'Khulna' },
  { name: 'Meherpur', division: 'Khulna' },
  { name: 'Narail', division: 'Khulna' },
  { name: 'Satkhira', division: 'Khulna' },
  // Barishal division (6)
  { name: 'Barguna', division: 'Barishal' },
  { name: 'Barishal', division: 'Barishal' },
  { name: 'Bhola', division: 'Barishal' },
  { name: 'Jhalokati', division: 'Barishal' },
  { name: 'Patuakhali', division: 'Barishal' },
  { name: 'Pirojpur', division: 'Barishal' },
  // Sylhet division (4)
  { name: 'Habiganj', division: 'Sylhet' },
  { name: 'Moulvibazar', division: 'Sylhet' },
  { name: 'Sunamganj', division: 'Sylhet' },
  { name: 'Sylhet', division: 'Sylhet' },
  // Rangpur division (8)
  { name: 'Dinajpur', division: 'Rangpur' },
  { name: 'Gaibandha', division: 'Rangpur' },
  { name: 'Kurigram', division: 'Rangpur' },
  { name: 'Lalmonirhat', division: 'Rangpur' },
  { name: 'Nilphamari', division: 'Rangpur' },
  { name: 'Panchagarh', division: 'Rangpur' },
  { name: 'Rangpur', division: 'Rangpur' },
  { name: 'Thakurgaon', division: 'Rangpur' },
  // Mymensingh division (4)
  { name: 'Jamalpur', division: 'Mymensingh' },
  { name: 'Mymensingh', division: 'Mymensingh' },
  { name: 'Netrokona', division: 'Mymensingh' },
  { name: 'Sherpur', division: 'Mymensingh' },
]

/** Districts treated as "inside Dhaka" for delivery-fee tiering. Extend per courier as needed. */
export const DHAKA_METRO: ReadonlySet<string> = new Set(['Dhaka'])
