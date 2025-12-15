<template>
  <div class="min-h-screen bg-slate-50/50 relative">
    
    <!-- Navigation / Breadcrumb Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <button 
        @click="$router.back()" 
        class="group inline-flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        <div class="p-1.5 rounded-full bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors shadow-sm">
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </div>
        <span>Back to collection</span>
      </button>
    </div>

    <!-- Main Content -->
    <div v-if="product._id" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        
        <!-- Left Column: Image Gallery (Sticky on Desktop) -->
        <div class="mb-10 lg:mb-0">
          <div class="lg:sticky lg:top-8 space-y-4">
            <div class="relative aspect-[4/5] sm:aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
              <!-- Discount Badge -->
              <div v-if="product.discount && product.discount > 0" class="absolute top-4 left-4 z-10">
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-rose-500 shadow-lg shadow-rose-500/30">
                  Save {{ product.discount }}%
                </span>
              </div>
              
              <img
                :src="product.image_product || '/placeholder.png'"
                :alt="product.name"
                class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            <!-- Trust Badges (Optional Visual Flair) -->
            <div class="grid grid-cols-3 gap-4 py-4">
              <div class="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                <svg class="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Authentic</span>
              </div>
              <div class="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                 <svg class="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Premium</span>
              </div>
              <div class="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                 <svg class="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Fast Ship</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Product Details -->
        <div class="flex flex-col">
          <!-- Category Label -->
          <span v-if="product.category_id" class="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            {{ product.category_id.name }}
          </span>

          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {{ product.name }}
          </h1>

          <!-- Price & Stock Row -->
          <div class="flex items-center flex-wrap gap-4 mb-8">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-slate-900">
                ${{ discountedPrice(product.price, product.discount) }}
              </span>
              <span v-if="product.discount > 0" class="text-xl text-slate-400 line-through decoration-slate-400/50">
                ${{ Number(product.price).toFixed(2) }}
              </span>
            </div>
            
            <div class="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>

            <div class="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <span class="relative flex h-2.5 w-2.5">
                <span v-if="product.stock > 0" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'"></span>
              </span>
              <span class="text-sm font-medium" :class="product.stock > 0 ? 'text-green-700' : 'text-red-700'">
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-slate prose-lg text-slate-600 mb-10 leading-relaxed">
            <p>{{ product.description }}</p>
          </div>

          <!-- Actions Area -->
          <div class="mt-auto pt-8 border-t border-slate-200">
            <div v-if="product.stock > 0" class="space-y-6">
              
              <div class="flex flex-col sm:flex-row sm:items-center gap-6">
                <!-- Quantity Selector -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-slate-700">Quantity</label>
                  <div class="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden w-fit shadow-sm">
                    <button 
                      @click="decrementQty" 
                      class="px-4 py-3 hover:bg-slate-50 text-slate-600 transition active:scale-95"
                      :disabled="qty <= 1"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      v-model.number="qty" 
                      class="w-16 text-center border-none p-0 text-slate-900 font-bold focus:ring-0 bg-transparent" 
                      readonly 
                    />
                    <button 
                      @click="incrementQty" 
                      class="px-4 py-3 hover:bg-slate-50 text-slate-600 transition active:scale-95"
                      :disabled="qty >= product.stock"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Total Price Display (Optional) -->
                <div class="hidden sm:flex flex-col gap-1">
                   <label class="text-sm font-semibold text-slate-700">Total</label>
                   <span class="text-2xl font-bold text-slate-900">
                     ${{ (discountedPrice(product.price, product.discount) * qty).toFixed(2) }}
                   </span>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <div class="flex flex-col gap-3">
                <button 
                  @click="addToCart" 
                  class="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-slate-900 text-white text-lg font-bold rounded-2xl hover:bg-blue-600 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  <span>Add {{ qty }} to Cart</span>
                  <span class="sm:hidden opacity-80 font-normal ml-2"> - ${{ (discountedPrice(product.price, product.discount) * qty).toFixed(2) }}</span>
                </button>
                <p class="text-center text-xs text-slate-400">Free shipping on orders over $100</p>
              </div>

            </div>

            <!-- Out of Stock State -->
            <div v-else class="rounded-2xl bg-slate-100 p-6 text-center border border-slate-200">
              <p class="text-slate-500 font-medium">This item is currently unavailable.</p>
              <button class="mt-4 text-blue-600 font-semibold hover:underline">
                Notify me when available
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Loading / Not Found State -->
    <div v-else class="min-h-[60vh] flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" v-if="loading"></div>
      <div v-else class="text-center">
         <h2 class="text-2xl font-bold text-slate-900">Product not found</h2>
         <button @click="$router.push('/')" class="mt-4 text-blue-600 hover:underline">Return to Home</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/store/useProductStore";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useShoppingCartStore } from "@/store/useShoppingCartStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "vue-toastification";

const route = useRoute();
const productStore = useProductStore();
const promotionStore = usePromotionStore();
const cartStore = useShoppingCartStore();
const authStore = useAuthStore();
const toast = useToast();

const product = ref({});
const qty = ref(1);
const loading = ref(true);

// Slugify helper (must match the one used in the URL generation)
const slugify = (text) =>
  (text ?? "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// Fetch Logic
const fetchProductBySlug = async () => {
  loading.value = true;
  try {
    await Promise.all([
      productStore.fetchProducts(),
      promotionStore.fetchPromotions()
    ]);

    const slug = route.params.name;

    // Find product matching the slug
    const prod = productStore.products.find(p => slugify(p.name) === slug);
    
    if (!prod) {
      product.value = {};
      return;
    }

    // Determine Promotions
    const promos = promotionStore.promotions.filter(p =>
      p.categories.some(cat => String(cat._id) === String(prod.category_id._id))
    );

    // Set Product Data with Calculated Discount
    product.value = {
      ...prod,
      promotions: promos,
      discount: promos.length > 0 ? Math.max(...promos.map(p => p.discount_percentage || 0)) : 0
    };

  } catch (err) {
    console.error("Failed to fetch product:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchProductBySlug());

// Logic
const incrementQty = () => { 
  if (qty.value < (product.value.stock || 1)) qty.value++; 
};

const decrementQty = () => { 
  if (qty.value > 1) qty.value--; 
};

const discountedPrice = (price, discount) => {
  const val = (Number(price) || 0) * (1 - (discount || 0)/100);
  return val.toFixed(2);
};

const addToCart = async () => {
  if (!authStore.user) {
    toast.info("Please log in to add items to cart!", { position: "top-right" });
    return;
  }
  if (!product.value._id) return;

  try {
    // Add logic here to prevent adding more than stock if cart already has items
    await cartStore.addItem(product.value._id, qty.value);
    toast.success(`${qty.value} ${qty.value > 1 ? 'items' : 'item'} added to cart!`, { 
      position: "top-right",
      timeout: 3000 
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to add items to cart.", { position: "top-right" });
  }
};
</script>