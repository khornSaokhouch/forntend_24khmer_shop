import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/authStore";

// Auth pages
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";

// User pages
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import CategoryList from "../components/CategoryList.vue";
import ProductListPage from "../components/ProductListPage.vue";
import FavouriteList from "../components/FavouriteList.vue";
import CartList from "../components/CartList.vue";

// Admin pages
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/Users.vue";
import Profile from "../views/profile/Profile.vue";
import Category from "../views/admin/category/Category.vue";
import ProductPage from "../views/admin/product/ProductPage.vue";
import EventManagement from "../views/admin/event/EventManagement.vue";
import PromotionManagement from "../views/admin/promotion/PromotionManager.vue";

// Layouts
import AdminLayout from "../layouts/AdminLayout.vue";
import ProfileLayout from "../layouts/ProfileLayout.vue";
import UserLayout from "../layouts/UserLayout.vue";

const routes = [
  // Auth pages
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/verify-otp", name: "verify-otp", component: () => import("../views/auth/VerifyOtp.vue") },



  // Admin pages
  {
    path: "/dashboard",
    component: AdminLayout,
    children: [
      { path: "", component: Dashboard },
      { path: "users", component: Users },
      { path: "profile", component: Profile },
      { path: "category", component: Category },
      { path: "products", component: ProductPage },
      { path: "events", component: EventManagement },
      { path: "promotions", component: PromotionManagement },
    ],
  },

  // Profile pages
  {
    path: "/profile",
    component: ProfileLayout,
    children: [
      { path: "", component: Profile },
      { path: "edit-profile", component: () => import("../views/profile/EditProfile.vue") },
      { path: "reset-password", component: () => import("../views/profile/ResetPassword.vue") },
      { path: "history", component: () => import("../views/profile/History.vue") },
      { path: "orders", component: () => import("../views/profile/Orders.vue") },
      { path: "payments", component: () => import("../views/profile/Payments.vue") },
    ],
  },

  // User pages
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", component: Home },
      { path: "about", component: About },
      { path: "categories", component: CategoryList },
      { path: "products", component: ProductListPage },
      { path: "contact", component: Contact },
      { path: "favorites", component: FavouriteList },
      { path: "cart", component: CartList },
      { path: "category/:name", name: "category-products", component: () => import("@/components/CategoryProducts.vue") },
      { path: "product/:name", component: () => import("@/components/ProductDetailsPage.vue"), props: true },
      { path: "event/:title", name: "EventDetails", component: () => import("@/components/EventDetailsPage.vue"), props: true },
    ],
  },

  // Catch-all redirect
  { path: "/:catchAll(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadFromStorage(); // Load token & user from sessionStorage
  const token = authStore.token;

  // Redirect authenticated users away from login/register
  if (to.path === "/login" || to.path === "/register") {
    if (token) {
      // Admin -> dashboard, User -> home
      next(authStore.user?.role === "admin" ? "/dashboard" : "/");
    } else {
      next();
    }
  } else if (
    // Protect admin & profile routes
    (to.path.startsWith("/dashboard") || to.path.startsWith("/profile")) &&
    !token
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
