export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Business {
  businessId: number;
  businessName: string;
  logoUrl?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  isOpen: boolean;
}

export interface PopularBusiness extends Business {
  businessCategoryName?: string | null;
  address?: string | null;
  orderCount: number;
}

export interface Product {
  productId: number;
  productName: string;
  categoryName?: string | null;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  description?: string | null;
  averageRating?: number | null;
}

export interface BusinessHeader {
  businessName: string;
  logoUrl?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  phoneNumber?: string | null;
  isOpen: boolean;
  businessCategoryName?: string | null;
}

export interface CartItem {
  businessId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface OrderItemPayload {
  productId: number;
  quantity: number;
}

export interface OrderPayload {
  businessId: number;
  paymentMethod: string;
  orderItems: OrderItemPayload[];
}

export interface CreateOrderResponse {
  orderId: number;
}

export interface ActiveOrder {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  businessName: string;
  driverName?: string | null;
  driverPhone?: string | null;
}

export interface OrderHistoryProduct {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistoryItem {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  totalAmount: number;
  products: OrderHistoryProduct[];
}

export interface OrderDetails extends ActiveOrder {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  fullName: string;
  title?: string;
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
}

export interface Delivery {
  deliveryId: number;
  orderId: number;
  orderStatus?: string;
}

export interface DeliveryResponse {
  success: boolean;
  message: string;
}
