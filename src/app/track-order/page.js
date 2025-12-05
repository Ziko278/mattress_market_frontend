// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Layout from '@/components/layout/Layout';
// import { apiService } from '@/lib/api';
// import { CURRENCY } from '@/lib/constants';

// export default function TrackOrderPage() {
//   const searchParams = useSearchParams();
//   const [orderId, setOrderId] = useState(searchParams.get('order_id') || '');
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (searchParams.get('order_id')) {
//       handleTrackOrder();
//     }
//   }, []);

//   const handleTrackOrder = async (e) => {
//     if (e) e.preventDefault();

//     if (!orderId.trim()) {
//       setError('Please enter an order ID');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setOrder(null);

//     try {
//       const response = await apiService.trackOrder(orderId);
//       setOrder(response.data);
//     } catch (error) {
//       console.error('Error tracking order:', error);
//       setError('Order not found. Please check your order ID and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusSteps = () => {
//     const steps = [
//       { key: 'pending', label: 'Order Placed', icon: '📝' },
//       { key: 'processing', label: 'Processing', icon: '⚙️' },
//       { key: 'shipped', label: 'Shipped', icon: '🚚' },
//       { key: 'delivered', label: 'Delivered', icon: '✅' },
//     ];

//     const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
//     const currentIndex = statusOrder.indexOf(order?.status);

//     return steps.map((step, index) => ({
//       ...step,
//       completed: index <= currentIndex,
//       active: index === currentIndex,
//     }));
//   };

//   return (
//     <Layout>
//       <div className="bg-lightGray min-h-screen py-16">
//         <div className="container mx-auto px-6 md:px-8 max-w-4xl">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
//               Track Your Order
//             </h1>
//             <p className="text-gray-600">Enter your order ID to track your delivery</p>
//           </div>

//           {/* Search Form */}
//           <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
//             <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
//               <input
//                 type="text"
//                 value={orderId}
//                 onChange={(e) => setOrderId(e.target.value)}
//                 placeholder="Enter Order ID (e.g., MM123456)"
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                   loading
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-primary hover:bg-blue-900 hover:scale-105'
//                 }`}
//               >
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <span className="animate-spin">⏳</span>
//                     Tracking...
//                   </span>
//                 ) : (
//                   '🔍 Track Order'
//                 )}
//               </button>
//             </form>

//             {error && (
//               <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                 {error}
//               </div>
//             )}
//           </div>

//           {/* Order Details */}
//           {order && (
//             <div className="space-y-6">
//               {/* Order Status Timeline */}
//               <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
//                 <h2 className="text-xl font-bold text-darkGray mb-6">Order Status</h2>

//                 {/* Timeline */}
//                 <div className="relative">
//                   <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
//                     <div
//                       className="h-full bg-primary transition-all duration-500"
//                       style={{
//                         width: `${
//                           (getStatusSteps().filter((s) => s.completed).length /
//                             getStatusSteps().length) *
//                           100
//                         }%`,
//                       }}
//                     ></div>
//                   </div>

//                   <div className="relative flex justify-between">
//                     {getStatusSteps().map((step, index) => (
//                       <div key={step.key} className="flex flex-col items-center flex-1">
//                         <div
//                           className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 transition-all duration-300 ${
//                             step.completed
//                               ? 'bg-primary text-white scale-110'
//                               : 'bg-gray-200 text-gray-400'
//                           } ${step.active ? 'ring-4 ring-primary/30 animate-pulse' : ''}`}
//                         >
//                           {step.icon}
//                         </div>
//                         <p
//                           className={`text-sm font-semibold text-center ${
//                             step.completed ? 'text-primary' : 'text-gray-500'
//                           }`}
//                         >
//                           {step.label}
//                         </p>
//                         {step.active && (
//                           <p className="text-xs text-gray-600 mt-1">In Progress</p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Current Status Message */}
//                 <div className="mt-8 bg-blue-50 border-l-4 border-primary p-4 rounded">
//                   <p className="text-sm text-gray-700">
//                     <span className="font-semibold">Current Status:</span>{' '}
//                     {order.status === 'pending' && 'Your order has been placed and is awaiting processing.'}
//                     {order.status === 'processing' && 'Your order is being prepared for shipment.'}
//                     {order.status === 'shipped' && 'Your order is on its way to you!'}
//                     {order.status === 'delivered' && 'Your order has been delivered successfully.'}
//                     {order.status === 'cancelled' && 'This order has been cancelled.'}
//                   </p>
//                 </div>
//               </div>

//               {/* Order Information */}
//               <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
//                 <h2 className="text-xl font-bold text-darkGray mb-6">Order Information</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Order ID</p>
//                     <p className="font-semibold text-gray-900">{order.order_id}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Order Date</p>
//                     <p className="font-semibold text-gray-900">
//                       {new Date(order.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Payment Method</p>
//                     <p className="font-semibold text-gray-900 capitalize">
//                       {order.payment_method.replace('_', ' ')}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Total Amount</p>
//                     <p className="font-semibold text-primary text-lg">
//                       {CURRENCY}
//                       {Number(order.total_amount).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-6 pt-6 border-t">
//                   <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
//                   <p className="font-semibold text-gray-900">{order.customer_name}</p>
//                   <p className="text-gray-700">{order.shipping_address}</p>
//                   <p className="text-gray-700">
//                     {order.city}, {order.state}
//                   </p>
//                   <p className="text-gray-700 mt-2">📞 {order.customer_phone}</p>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
//                 <h2 className="text-xl font-bold text-darkGray mb-6">Order Items</h2>

//                 <div className="space-y-4">
//                   {order.items.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex justify-between items-center pb-4 border-b last:border-b-0"
//                     >
//                       <div>
//                         <p className="font-semibold text-gray-900">{item.product_name}</p>
//                         <p className="text-sm text-gray-600">
//                           Size: {item.size} × {item.quantity}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {CURRENCY}
//                           {Number(item.price).toLocaleString()} each
//                         </p>
//                       </div>
//                       <p className="font-bold text-primary">
//                         {CURRENCY}
//                         {Number(item.subtotal).toLocaleString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-6 pt-6 border-t flex justify-between items-center">
//                   <span className="text-lg font-bold text-gray-900">Total:</span>
//                   <span className="text-2xl font-bold text-primary">
//                     {CURRENCY}
//                     {Number(order.total_amount).toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Contact Support */}
//               <div className="bg-gradient-to-r from-primary to-blue-900 rounded-xl shadow-md p-6 md:p-8 text-white text-center">
//                 <h3 className="text-xl font-bold mb-2">Need Help?</h3>
//                 <p className="mb-6">Our customer support team is here to assist you</p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <a
//                     href="tel:+2348012345678"
//                     className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
//                   >
//                     📞 Call Us
//                   </a>
//                   <a
//                     href="https://wa.me/2348012345678"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
//                   >
//                     💬 WhatsApp
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }


export default function TrackOrderPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Track Order Page</h1>
      <p>If this builds, we're making progress.</p>
    </div>
  );
}