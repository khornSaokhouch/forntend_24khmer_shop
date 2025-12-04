<template>
  <!-- Product Card -->
  <div
    v-if="product"
    class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-2"
  >
    <!-- Product Image & Overlays -->
    <div class="relative overflow-hidden rounded-t-2xl">
      <router-link :to="`/product/${slugify(product.product_name)}`">
        <img
          :src="product.product_image ? `${API_URL}/${product.product_image}` : '/placeholder.png'"
          :alt="product.product_name"
          class="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
      </router-link>

      <!-- Promotion / Discount Badge -->
      <div v-if="hasDiscount" class="absolute top-4 left-4">
        <span class="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md">
          -{{ discountPercentage }}%
        </span>
      </div>

      <!-- Favourite Button -->
      <button
        @click="toggleFavourite"
        class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/30"
        :title="isFavourite ? 'Remove from favourites' : 'Add to favourites'"
      >
        <Heart
          class="w-5 h-5 transition-all duration-300"
          :class="isFavourite ? 'text-red-500 scale-110' : 'text-slate-600 group-hover:text-red-400'"
          :fill="isFavourite ? 'currentColor' : 'none'"
        />
      </button>

      <!-- Stock Badge -->
      <div v-if="product.stock <= 0" class="absolute bottom-4 right-4 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-red-400/30">
        Out of Stock
      </div>
      <div v-else-if="product.stock <= 5" class="absolute bottom-4 right-4 px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-orange-400/30">
        Low Stock
      </div>
    </div>

    <!-- Product Content -->
    <div class="relative flex flex-1 flex-col p-6 z-10">
      <div class="flex-1">
        <router-link
          :to="`/product/${slugify(product.product_name)}`"
          class="block text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 line-clamp-2 mb-2"
          :title="product.product_name"
        >
          {{ product.product_name || "Unknown Product" }}
        </router-link>

        <p v-if="product.description" class="text-sm text-slate-600 line-clamp-2 mb-4">
          {{ product.description }}
        </p>

        <div class="flex items-center justify-between">
          <p class="text-2xl font-bold">
            <span v-if="hasDiscount" class="text-gray-400 line-through mr-2">${{ Number(product.price ?? 0).toFixed(2) }}</span>
            <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">${{ discountedPrice }}</span>
          </p>
          <div class="flex items-center space-x-1">
            <div
              class="w-2 h-2 rounded-full"
              :class="product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'"
            ></div>
            <span class="text-xs text-slate-500 font-medium">
              {{ product.stock > 0 ? `${product.stock} left` : "Sold out" }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Placeholder -->
  <div v-else class="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-slate-500 text-center min-h-[380px] backdrop-blur-sm">
    <p>Product not found</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { Heart } from "lucide-vue-next";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { useAuthStore } from "@/store/authStore";

const props = defineProps({
  product: { type: Object, required: false },
  API_URL: { type: String, required: true },
});

const product = props.product;
const favStore = useFavouriteStore();
const authStore = useAuthStore();
const toast = useToast();

// Fetch favourites if user is logged in
onMounted(() => {
  if (authStore.user && favStore.favourites.length === 0) {
    favStore.fetchFavourites();
  }
});

// Slugify function for URLs
const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");

// Favourite logic
const isFavourite = computed(() => {
  if (!product?.id) return false;
  return favStore.favourites.some((f) => f.product_id === product.id);
});

const toggleFavourite = async () => {
  if (!authStore.user) {
    toast.info("Please log in to add to favourites!", { position: "top-right" });
    return;
  }

  if (!product?.id) return;

  const fav = favStore.favourites.find((f) => f.product_id === product.id);
  if (fav) {
    favStore.favourites = favStore.favourites.filter((f) => f.id !== fav.id);
    try {
      await favStore.removeFavourite(fav.id);
      toast.success("Removed from favourites!");
    } catch {
      favStore.favourites.push(fav);
      toast.error("Failed to remove favourite.");
    }
  } else {
    const tempFav = { id: Date.now(), product_id: product.id, product };
    favStore.favourites.push(tempFav);
    try {
      await favStore.addFavourite(product.id);
      await favStore.fetchFavourites();
      toast.success("Added to favourites!");
    } catch {
      favStore.favourites = favStore.favourites.filter((f) => f.id !== tempFav.id);
      toast.error("Failed to add favourite.");
    }
  }
};

// Discount logic
const hasDiscount = computed(() => {
  return product?.discount > 0 || product?.promotions?.length > 0;
});

const discountPercentage = computed(() => {
  if (product?.discount > 0) return product.discount;
  if (product?.promotions?.length) return Math.max(...product.promotions.map(p => p.discount_percentage || 0));
  return 0;
});

const discountedPrice = computed(() => {
  const discount = discountPercentage.value || 0;
  return (Number(product?.price ?? 0) * (1 - discount / 100)).toFixed(2);
});
</script>
