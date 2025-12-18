<template>
  <div class="min-h-screen bg-white">
    
    <!-- Navigation / Breadcrumb -->
    <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <button 
          @click="$router.back()" 
          class="group inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <div class="p-1.5 rounded-full bg-slate-100 group-hover:bg-blue-50 transition-colors">
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </div>
          <span>Back</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-[60vh] flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Main Product Content -->
    <div v-else-if="product._id" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-20">
        
        <!-- Left Column: Image Gallery -->
        <div class="mb-12 lg:mb-0">
          <div class="lg:sticky lg:top-24 space-y-4">
            <!-- Main Image -->
            <div class="relative aspect-[4/5] sm:aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 group">
              <!-- Discount Badge -->
              <div v-if="product.discount > 0" class="absolute top-4 left-4 z-20">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-red-500 shadow-lg shadow-red-500/30 animate-pulse-slow">
                  -{{ product.discount }}% OFF
                </span>
              </div>
              
              <img
                :src="product.image_product || '/placeholder.png'"
                :alt="product.name"
                class="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              
              <!-- Sold Out Overlay -->
              <div v-if="product.stock <= 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span class="px-6 py-3 bg-slate-900 text-white text-lg font-bold rounded-xl shadow-xl">Sold Out</span>
              </div>
            </div>

            <!-- Trust Features -->
            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col items-center p-3 bg-slate-50 rounded-xl text-center">
                <svg class="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                <span class="text-[10px] uppercase font-bold text-slate-500">Free Shipping</span>
              </div>
              <div class="flex flex-col items-center p-3 bg-slate-50 rounded-xl text-center">
                <svg class="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="text-[10px] uppercase font-bold text-slate-500">Genuine</span>
              </div>
              <div class="flex flex-col items-center p-3 bg-slate-50 rounded-xl text-center">
                <svg class="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                <span class="text-[10px] uppercase font-bold text-slate-500">Secure Pay</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Product Details -->
        <div class="flex flex-col">
          <!-- Category Tag -->
          <div class="mb-4" v-if="product.category_id">
            <span class="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
              {{ product.category_id.name }}
            </span>
          </div>

          <!-- Product Title -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            {{ product.name }}
          </h1>

          <!-- Price Block -->
          <div class="flex items-end gap-4 mb-8 pb-8 border-b border-slate-100">
            <div class="flex flex-col">
              <span class="text-sm text-slate-500 font-medium mb-1">Price</span>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl sm:text-5xl font-black text-slate-900">
                  ${{ discountedPrice(product.price, product.discount) }}
                </span>
                <span v-if="product.discount > 0" class="text-xl text-slate-400 line-through font-medium">
                  ${{ Number(product.price).toFixed(2) }}
                </span>
              </div>
            </div>
            
            <!-- Stock Status -->
            <div class="ml-auto flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <span class="relative flex h-2.5 w-2.5">
                <span v-if="product.stock > 0" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'"></span>
              </span>
              <span class="text-xs font-bold uppercase" :class="product.stock > 0 ? 'text-green-700' : 'text-red-700'">
                {{ product.stock > 0 ? 'In Stock' : 'Sold Out' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-slate prose-lg text-slate-600 leading-relaxed mb-10">
            <h3 class="text-slate-900 font-bold text-lg mb-2">Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <!-- Add to Cart Area -->
          <div class="mt-auto">
            <div v-if="product.stock > 0" class="flex flex-col sm:flex-row gap-4">
              
              <!-- Quantity Selector -->
              <div class="flex items-center justify-between sm:justify-start bg-slate-50 rounded-2xl border border-slate-200 p-1 w-full sm:w-auto">
                <button 
                  @click="decrementQty"
                  class="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-600 hover:text-blue-600 disabled:opacity-50 transition-all"
                  :disabled="qty <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                </button>
                <input 
                  type="number" 
                  v-model="qty" 
                  class="w-12 text-center bg-transparent border-none font-bold text-lg text-slate-900 focus:ring-0 p-0"
                  readonly
                />
                <button 
                  @click="incrementQty"
                  class="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-600 hover:text-blue-600 disabled:opacity-50 transition-all"
                  :disabled="qty >= product.stock"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </button>
              </div>

              <!-- Add Button -->
              <button 
                @click="addToCart" 
                class="flex-1 flex items-center justify-center space-x-3 bg-slate-900 text-white rounded-2xl px-8 py-4 font-bold text-lg hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 transition-all duration-300"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span>Add to Cart</span>
                <span class="bg-white/20 px-2 py-0.5 rounded text-sm ml-2">
                  ${{ (discountedPrice(product.price, product.discount) * qty).toFixed(2) }}
                </span>
              </button>
            </div>

            <!-- Out of Stock Message -->
            <div v-else class="p-4 bg-slate-100 rounded-xl text-center border border-slate-200">
               <span class="text-slate-500 font-medium">Currently Unavailable</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900">Product Not Found</h2>
      <button @click="$router.push('/')" class="mt-6 text-blue-600 font-semibold hover:underline">
        Back to Home
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useProductStore } from "@/store/useProductStore";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useShoppingCartStore } from "@/store/useShoppingCartStore";
import { useAuthStore } from "@/store/authStore";

const route = useRoute();
const toast = useToast();
const productStore = useProductStore();
const promotionStore = usePromotionStore();
const cartStore = useShoppingCartStore();
const authStore = useAuthStore();

const product = ref({});
const qty = ref(1);
const loading = ref(true);

const slugify = (text) =>
  (text ?? "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// Calculate Price Logic
const discountedPrice = (price, discount) => {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  return (p * (1 - d / 100)).toFixed(2);
};

const incrementQty = () => { if (qty.value < product.value.stock) qty.value++; };
const decrementQty = () => { if (qty.value > 1) qty.value--; };

const addToCart = async () => {
  if (!authStore.user) {
    toast.info("Please log in to shop!");
    return;
  }
  try {
    await cartStore.addItem(product.value._id, qty.value);
    toast.success("Added to cart!");
  } catch (err) {
    toast.error("Failed to add to cart");
  }
};

const fetchProductBySlug = async () => {
  loading.value = true;
  try {
    // Ideally, replace this with an API call like api.get(`/products/slug/${slug}`)
    // For now, matching from the store as per your existing logic
    await Promise.all([productStore.fetchProducts(), promotionStore.fetchPromotions()]);
    
    const slug = route.params.name;
    const foundProduct = productStore.products.find(p => slugify(p.name) === slug);

    if (foundProduct) {
      // Logic to find valid promotions for this product's category
      // Handles both populated objects ({_id: '...'}) and direct ID strings
      const categoryId = foundProduct.category_id?._id || foundProduct.category_id;
      
      const promos = promotionStore.promotions.filter(promo => 
        promo.categories.some(cat => {
            const promoCatId = cat._id || cat;
            return String(promoCatId) === String(categoryId);
        })
      );

      const maxDiscount = promos.length > 0 ? Math.max(...promos.map(p => p.discount_percentage || 0)) : 0;

      product.value = {
        ...foundProduct,
        discount: maxDiscount,
        promotions: promos
      };
    }
  } catch (error) {
    console.error("Error loading product:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductBySlug();
});
</script>

<style scoped>
/* Custom Pulse Animation for Discount Badge */
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}
.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}
</style>