<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">

    <!-- Decorative Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          Shopping Cart
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Review your items below and proceed to checkout.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="cartStore.loading" class="flex justify-center items-center py-20">
        <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
      </div>

      <!-- Error -->
      <div v-else-if="cartStore.error" class="text-center py-20">
        <div class="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100">
          <p class="text-red-600 font-medium">{{ cartStore.error }}</p>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartItems.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h3>
          <p class="text-slate-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <router-link to="/products" class="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            Continue Shopping
          </router-link>
        </div>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8 items-start">
        <!-- Cart Table -->
        <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-slate-100/50">
                  <th class="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th class="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th class="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th class="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtotal</th>
                  <th class="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.id" class="border-b border-slate-200/60">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-4">
                      <img :src="item.product?.product_image ? `${API_URL}/${item.product.product_image}` : '/placeholder.svg'" alt="product" class="w-16 h-16 rounded-lg object-cover bg-slate-100"/>
                      <div>
                        <h3 class="font-semibold text-slate-800">{{ item.product?.product_name || 'Unknown' }}</h3>
                        <p class="text-sm text-slate-500">{{ item.product?.category || 'Product' }}</p>
                        <span v-if="getDiscount(item) > 0" class="text-red-600 font-bold">
  ${{ discountedPrice(item).toFixed(2) }} 
  <span class="line-through text-slate-400">${{ item.product.price }}</span>
</span>

                      </div>
                    </div>
                  </td>

                  <!-- Price -->
                  <td class="py-4 px-6">
                    <div v-if="hasDiscount(item)">
                      <span class="line-through text-slate-400 mr-1">${{ item.product.price.toFixed(2) }}</span>
                      <span class="font-medium text-slate-700">${{ discountedPrice(item).toFixed(2) }}</span>
                    </div>
                    <div v-else>
                      <span class="font-medium text-slate-700">${{ item.product?.price || 0 }}</span>
                    </div>
                  </td>

                  <!-- Quantity -->
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <button @click="decrementQty(item)" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors font-bold">-</button>
                      <input type="number" v-model.number="item.tempQty" class="w-12 text-center bg-transparent border border-slate-300 rounded-lg py-1 text-sm font-medium" min="1" :max="item.product?.stock || 100" @blur="updateQty(item)" />
                      <button @click="incrementQty(item)" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors font-bold">+</button>
                    </div>
                  </td>

                  <!-- Subtotal -->
                  <td class="py-4 px-6">
                    <span class="font-bold text-slate-900">
                      ${{ (discountedPrice(item) * item.qty).toFixed(2) }}
                    </span>
                  </td>

                  <!-- Remove -->
                  <td class="py-4 px-6 text-right">
                    <button @click="removeItemWithToast(item.id)" class="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1 sticky top-24">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 p-8 shadow-sm">
            <h3 class="text-2xl font-bold text-slate-900 mb-6">Order Summary</h3>
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span class="font-medium text-green-600">Free</span>
              </div>
              <div class="border-t border-slate-200/60 pt-4 mt-4 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">${{ totalPrice.toFixed(2) }}</span>
              </div>
            </div>
            <button class="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useShoppingCartStore } from "@/store/useShoppingCartStore";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "vue-toastification";

const cartStore = useShoppingCartStore();
const promoStore = usePromotionStore();
const authStore = useAuthStore();
const toast = useToast();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const cartItems = ref([]);

// Fetch cart and promotions
onMounted(async () => {
  if (!authStore.user) return;

  // Fetch cart
  await cartStore.fetchCart();
  cartItems.value = cartStore.cart.items.map(item => ({ ...item, tempQty: item.qty }));

  console.log("Cart Items:", cartItems.value);

  // Fetch promotions for cart products
  const categories = [...new Set(cartItems.value.map(i => i.product.category_id))];
  console.log("Cart Categories:", categories);

  for (const catId of categories) {
    await promoStore.fetchProductsWithPromotions(catId);
  }

  console.log("Products with Promotions:", promoStore.productsWithPromotions);

  // Assign discount to cart items
  cartItems.value.forEach(item => {
    const promo = promoStore.productsWithPromotions.find(p => p.id === item.product.id);
    item.discount = promo?.discount_percentage || 0;
    console.log(`Product: ${item.product.product_name}, Price: ${item.product.price}, Discount: ${item.discount}`);
  });
});

const getDiscount = (item) => {
  const promoProduct = promoStore.productsWithPromotions.find(p => p.product_id === item.product.id);
  return promoProduct?.discount_percentage || 0;
};

const discountedPrice = (item) => {
  const discount = getDiscount(item);
  console.log(`Calculating discounted price for ${item.product?.product_name}: ${item.product?.price} - ${discount}%`);
  return (Number(item.product?.price) || 0) * (1 - discount / 100);
};




// Watch cart changes
watch(
  () => cartStore.cart.items,
  (newItems) => {
    cartItems.value = newItems.map(item => {
      const promoProduct = promoStore.promotions.find(p =>
        p.products?.some(prod => prod.id === item.product.id)
      );
      const discount = promoProduct?.discount_percentage || 0;
      console.log(`Cart updated - Product: ${item.product?.product_name}, Discount: ${discount}`);
      return { ...item, tempQty: item.qty, discount };
    });
  },
  { deep: true }
);

// -------------------------
// Discount helpers
// -------------------------
cartItems.value.forEach(item => {
  const promo = promoStore.productsWithPromotions.find(p => p.product_id === item.product.id);
  item.discount = promo?.discount_percentage || 0;
  console.log(`Product: ${item.product.product_name}, Price: ${item.product.price}, Discount: ${item.discount}`);
});


const hasDiscount = (item) => item.discount > 0;

// -------------------------
// Cart actions
// -------------------------
const incrementQty = async (item) => {
  if (item.tempQty < (item.product?.stock || 100)) {
    item.tempQty++;
    await updateQty(item);
  }
};

const decrementQty = async (item) => {
  if (item.tempQty > 1) {
    item.tempQty--;
    await updateQty(item);
  }
};

const updateQty = async (item) => {
  if (item.qty === item.tempQty) return;
  await cartStore.updateItemQty(item.id, item.tempQty);
  item.qty = item.tempQty;
  console.log(`Updated quantity for ${item.product?.product_name}: ${item.qty}`);
};

// Remove item with toast
const removeItemWithToast = async (itemId) => {
  await cartStore.removeItem(itemId);
  cartItems.value = cartItems.value.filter(i => i.id !== itemId);
  toast.success("Item removed from cart!");
  console.log(`Removed item ID: ${itemId}`);
};

// -------------------------
// Computed total
// -------------------------
const totalPrice = computed(() => {
  const total = cartItems.value.reduce((sum, item) => sum + discountedPrice(item) * item.qty, 0);
  console.log("Total Price:", total);
  return total;
});
</script>
