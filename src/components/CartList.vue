<template>
  <div class="min-h-screen bg-slate-50 pb-32 md:pb-10">
    
    <!-- HEADER -->
    <div class="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShoppingBag class="w-5 h-5 text-indigo-600" />
          My Cart 
          <span v-if="cartStore.itemCount > 0" class="text-sm font-normal text-slate-500">({{ cartStore.itemCount }} items)</span>
        </h1>
        <router-link to="/products" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          Continue Shopping
        </router-link>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="max-w-7xl mx-auto px-4 mt-6">
      
      <!-- LOADING STATE -->
      <div v-if="cartStore.loading && !cartStore.cart.items.length" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p class="text-slate-500">Loading your cart...</p>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="cartStore.cart.items.length === 0" class="text-center py-20">
        <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart class="w-12 h-12 text-indigo-300" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p class="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything yet. Explore our products and find something you love!</p>
        <router-link to="/products" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          Start Shopping
        </router-link>
      </div>

      <!-- CART ITEMS GRID -->
      <div v-else class="flex flex-col lg:flex-row gap-8">
        
        <!-- LEFT: Product List -->
        <div class="flex-1 space-y-4">
          
          <!-- DESKTOP HEADERS -->
          <div class="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider px-4">
            <div class="col-span-6">Product</div>
            <div class="col-span-2 text-center">Quantity</div>
            <div class="col-span-2 text-right">Price</div>
            <div class="col-span-2 text-right">Total</div>
          </div>

          <!-- ITEMS LOOP -->
          <div 
            v-for="item in cartStore.cart.items" 
            :key="item._id" 
            class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
              
              <!-- 1. Product Info -->
              <div class="col-span-6 w-full flex items-center gap-4">
                <div class="w-20 h-20 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img 
                    :src="getImageUrl(item.product_id?.image_product)" 
                    alt="Product" 
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-900 truncate">
                    {{ item.product_id?.name || 'Product unavailable' }}
                  </h3>
                  <p class="text-sm text-slate-500">{{ item.product_id?.category || 'General' }}</p>
                  
                  <!-- Mobile Price Display -->
                  <p class="md:hidden text-indigo-600 font-bold mt-1">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>

              <!-- 2. Quantity Controls -->
              <div class="col-span-2 w-full flex justify-between md:justify-center items-center mt-4 md:mt-0 bg-slate-50 md:bg-transparent rounded-lg p-2 md:p-0">
                <span class="md:hidden text-sm font-medium text-slate-500">Qty:</span>
                
                <div class="flex items-center gap-3 bg-white md:bg-slate-50 border border-slate-200 rounded-full px-1 py-1 shadow-sm">
                  <button 
                    @click="updateQty(item, 'remove')"
                    :disabled="cartStore.updatingItemId === item.product_id?._id"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                  
                  <span class="w-6 text-center text-sm font-bold text-slate-900">
                    <Loader2 v-if="cartStore.updatingItemId === item.product_id?._id" class="w-4 h-4 animate-spin mx-auto text-indigo-600" />
                    <span v-else>{{ item.quantity }}</span>
                  </span>

                  <button 
                    @click="updateQty(item, 'add')"
                    :disabled="cartStore.updatingItemId === item.product_id?._id"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors disabled:opacity-50"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- 3. Unit Price (Desktop) -->
              <div class="col-span-2 hidden md:block text-right text-sm text-slate-500">
                ${{ item.price.toFixed(2) }}
              </div>

              <!-- 4. Total Price (Desktop) -->
              <div class="col-span-2 hidden md:block text-right font-bold text-slate-900">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>

            <!-- Delete Button (Absolute Position) -->
            <button 
              @click="removeItem(item)" 
              class="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Remove Item"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- RIGHT: Order Summary -->
        <div class="lg:w-96 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sticky top-24">
            <h3 class="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div class="space-y-4 text-sm">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span class="font-medium">${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Shipping estimate</span>
                <span class="font-medium text-green-600">Free</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Tax</span>
                <span class="font-medium">$0.00</span>
              </div>
            </div>

            <div class="border-t border-slate-100 mt-6 pt-4">
              <div class="flex justify-between items-end mb-1">
                <span class="text-base font-medium text-slate-900">Total</span>
                <span class="text-2xl font-bold text-indigo-600">${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <p class="text-xs text-slate-400 text-right mb-6">Including VAT</p>

              <button class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2">
                Checkout Now
                <ArrowRight class="w-5 h-5" />
              </button>
              
              <div class="mt-4 flex justify-center gap-2">
                 <!-- Trust Badges -->
                 <ShieldCheck class="w-5 h-5 text-slate-400" />
                 <span class="text-xs text-slate-400">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- MOBILE STICKY CHECKOUT BAR -->
    <div v-if="cartStore.itemCount > 0" class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div class="flex items-center gap-4 max-w-7xl mx-auto">
        <div class="flex-1">
          <p class="text-xs text-slate-500">Total</p>
          <p class="text-xl font-bold text-indigo-600">${{ cartStore.totalPrice.toFixed(2) }}</p>
        </div>
        <button class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">
          Checkout
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCartStore } from "../store/useCartStore"; // Update path if needed
import { useToast } from "vue-toastification";
import { 
  ShoppingBag, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from "lucide-vue-next";

const cartStore = useCartStore();
const toast = useToast();
const API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  await cartStore.fetchCart();
});

// Helper to construct image URL
const getImageUrl = (path) => {
  if (!path) return "/placeholder-image.png"; // Add a placeholder in public folder
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path}`;
};

// Handle Quantity Updates
const updateQty = async (item, action) => {
  if (action === "remove" && item.quantity <= 1) {
    // If qty is 1 and user clicks minus, confirm deletion
    removeItem(item);
    return;
  }
  
  // The store handles the API call
  // Note: we pass item.product_id._id because backend needs product ID
  const success = await cartStore.updateCartItem(item.product_id._id, action);
  
  if (!success) {
    toast.error("Could not update cart");
  }
};

// Handle Remove Item
const removeItem = async (item) => {
  if(confirm("Remove this item from your cart?")) {
    const success = await cartStore.updateCartItem(item.product_id._id, "delete");
    if (success) toast.success("Item removed");
  }
};
</script>

<style scoped>
/* Safe area padding for iPhones */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>