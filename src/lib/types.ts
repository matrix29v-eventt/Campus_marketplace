export interface UserData {
  id: string
  name: string
  email: string
  department: string | null
  year: number | null
  college: string
  role: string
  isVerified: boolean
  greenPoints: number
  itemsReused: number
  treesSaved: number
  wasteReduced: number
  image: string | null
}

export interface ProductData {
  id: string
  title: string
  description: string
  price: number | null
  category: string
  condition: string
  type: string
  images: string[]
  department: string | null
  year: number | null
  courseCode: string | null
  isFeatured: boolean
  featuredUntil: string | null
  isAvailable: boolean
  rentalPrice: number | null
  rentalPeriod: string | null
  sellerId: string
  seller?: UserData
  createdAt: string
}

export interface TransactionData {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  type: string
  status: string
  exchangeProductId: string | null
  rentalStart: string | null
  rentalEnd: string | null
  amount: number | null
  product?: ProductData
  buyer?: UserData
  seller?: UserData
  createdAt: string
}

export interface MessageData {
  id: string
  senderId: string
  receiverId: string
  productId: string | null
  content: string
  image: string | null
  read: boolean
  createdAt: string
  sender?: UserData
  receiver?: UserData
}

export interface SustainabilityData {
  totalPoints: number
  itemsReused: number
  treesSaved: number
  wasteReduced: number
  logs: Array<{
    id: string
    action: string
    points: number
    itemsCount: number
    description: string | null
    createdAt: string
  }>
}

export interface GroupBuyData {
  id: string
  productId: string
  organizerId: string
  minParticipants: number
  maxParticipants: number | null
  discountPercent: number
  dealPrice: number
  status: string
  expiresAt: string | null
  createdAt: string
  product?: ProductData
  organizer?: UserData
  participants?: Array<{
    id: string
    userId: string
    joinedAt: string
    user?: UserData
  }>
  _count?: { participants: number }
}

export interface OfferData {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  amount: number
  message: string | null
  status: string
  counterAmount: number | null
  counterMessage: string | null
  createdAt: string
  product?: ProductData
  buyer?: UserData
  seller?: UserData
}

export interface LostFoundData {
  id: string
  title: string
  description: string
  category: string
  location: string | null
  date: string | null
  images: string[]
  status: string
  reporterId: string
  claimantId: string | null
  contactInfo: string | null
  createdAt: string
  reporter?: UserData
  claimant?: UserData | null
}

export interface BundleData {
  id: string
  title: string
  description: string | null
  price: number | null
  sellerId: string
  isAvailable: boolean
  createdAt: string
  seller?: UserData
  items?: Array<{
    id: string
    productId: string
    product?: ProductData
  }>
}
