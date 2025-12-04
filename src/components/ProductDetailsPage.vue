<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 bg-gray-100 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto p-6">
      <!-- Back Button -->
      <button 
        @click="$router.back()" 
        class="mb-8 group flex items-center space-x-2 px-6 py-3 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span>Back to Products</span>
      </button>

      <!-- Product Card -->
      <div v-if="product && product.id" class="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        <!-- Image Section -->
        <div class="lg:w-1/2 p-8">
          <div class="relative group">
            <div class="absolute inset-0 bg-gray-100 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div class="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
              <img
                :src="product.product_image ? `${API_URL}/${product.product_image}` : '/placeholder.png'"
                alt="product"
                class="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
             <!-- Discount Badge -->
<div v-if="product.discount && product.discount > 0" class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
  -{{ product.discount }}%
</div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="lg:w-1/2 p-8 flex flex-col justify-between space-y-6">
          <!-- Title -->
          <h1 class="text-4xl font-bold text-gray-900 leading-tight">
            {{ product.product_name }}
          </h1>

          <!-- Price & Discount -->
          <div class="flex items-center space-x-4">
            <span v-if="product.discount && product.discount > 0" class="text-3xl font-bold text-gray-900 line-through">
              ${{ product.price }}
            </span>
            <span class="text-3xl font-bold text-gray-900">
              ${{ discountedPrice(product.price, product.discount) }}
            </span>
            <div class="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-full">
              Premium Quality
            </div>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center space-x-2">
            <div :class="product.stock > 0 ? 'w-3 h-3 bg-green-500 rounded-full animate-pulse' : 'w-3 h-3 bg-red-500 rounded-full'"></div>
            <p :class="product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
              {{ product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock' }}
            </p>
          </div>

          <!-- Description -->
          <div v-if="product.description" class="bg-gray-50 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Quantity & Add to Cart -->
          <div v-if="product.stock > 0" class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-900">Quantity</span>
              <div class="flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden">
                <button @click="decrementQty" class="px-4 py-3 hover:bg-gray-100 transition-colors duration-200 text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <input type="number" v-model.number="qty" class="w-16 text-center bg-transparent border-none outline-none text-gray-900 font-semibold" min="1" :max="product.stock" />
                <button @click="incrementQty" class="px-4 py-3 hover:bg-gray-100 transition-colors duration-200 text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H5.4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <button @click="addToCart" class="w-full px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              Add {{ qty }} to Cart
            </button>

            <div class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span class="text-sm text-gray-700">Total: </span>
              <span class="text-xl font-bold text-gray-900">${{ (discountedPrice(product.price, product.discount) * qty).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Out of Stock -->
          <div v-else class="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-red-700 mb-2">Out of Stock</h3>
            <p class="text-red-600">This product is currently unavailable. Please check back later.</p>
          </div>
        </div>
      </div>

      <!-- Placeholder if product not found -->
      <div v-else class="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-slate-500 text-center min-h-[380px] backdrop-blur-sm">
        <p>Product not found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useShoppingCartStore } from "@/store/useShoppingCartStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "vue-toastification";

const route = useRoute();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const promotionStore = usePromotionStore();
const cartStore = useShoppingCartStore();
const authStore = useAuthStore();
const toast = useToast();

const API_URL = import.meta.env.VITE_API_URL;
const product = ref({});
const qty = ref(1);

// Slugify helper
const slugify = (text) =>
  text.toString().toLowerCase().trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

// Fetch product & merge promotions
onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    productStore.fetchProducts(),
    promotionStore.fetchPromotions()
  ]);

  const slug = route.params.name;

  // Get product
  const prod = productStore.products.find(p => slugify(p.product_name) === slug) || {};

  // Merge promotions
  const promos = promotionStore.promotions.filter(p =>
    p.categories.some(cat => cat.id === prod.category_id)
  );

  product.value = {
    ...prod,
    promotions: promos,
    discount: promos.length > 0 ? Math.max(...promos.map(p => p.discount_percentage)) : 0
  };
});


// Quantity controls
const incrementQty = () => { if (qty.value < product.value.stock) qty.value++; };
const decrementQty = () => { if (qty.value > 1) qty.value--; };

// Discounted price
const discountedPrice = (price, discount) => {
  const disc = discount || 0;
  return (price * (1 - disc / 100)).toFixed(2);
};

// Add to cart
const addToCart = async () => {
  if (!authStore.user) {
    toast.info("Please log in to add items to cart!", { position: "top-right" });
    return;
  }
  if (!product.value.id) return;
  try {
    await cartStore.addItem(product.value.id, qty.value);
    toast.success(`${qty.value} item(s) added to cart!`, { position: "top-right" });
  } catch (err) {
    console.error(err);
    toast.error("Failed to add items to cart.", { position: "top-right" });
  }
};
</script>
