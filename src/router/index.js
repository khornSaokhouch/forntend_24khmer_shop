import { createRouter, createWebHistory } from "vue-router";

// Auth pages
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";

// User pages
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import CategoryList from "../components/CategoryList.vue";
import ProductListPage from "../components/ProductListPage.vue";
import FavouriteList from "../components/FavouriteList.vue"; // Lazy-loaded
import CartList from "../components/CartList.vue";

// Admin pages
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/Users.vue";
import Profile from "../views/profile/Profile.vue";
import Category from "../views/admin/category/Category.vue";
import ProductPage from "../views/admin/product/ProductPage.vue"; // Placeholder for Products component
import EventManagement from "../views/admin/event/EventManagement.vue"; // Placeholder for Events component
import PromotionManagement from "../views/admin/promotion/PromotionManager.vue";



// Layouts
import AdminLayout from "../layouts/AdminLayout.vue";
import ProfileLayout from "../layouts/ProfileLayout.vue";
import UserLayout from "../layouts/UserLayout.vue"; // ✅ ADDED

import { useAuthStore } from "../store/authStore";

const routes = [
  // Auth pages (no layout)
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  // Admin pages (AdminLayout)
  {
    path: "/dashboard",
    component: AdminLayout,
    children: [
      { path: "", component: Dashboard },
      { path: "users", component: Users },
      { path: "profile", component: Profile },
      { path: "category", component: Category },
      { path: "products", component: ProductPage }, // Placeholder for Products component
      { path: "events", component: EventManagement }, // Placeholder for Events component
      { path: "promotions", component: PromotionManagement }, // Lazy-loaded
    ],
  },

  // Profile page (ProfileLayout)
  {
    path: "/profile",
    component: ProfileLayout,
    children: [
      { path: "", component: Profile },
      { path: "edit-profile", component: () => import("../views/profile/EditProfile.vue") }, // Lazy-loaded
      { path: "reset-password", component: () => import("../views/profile/ResetPassword.vue") }, // Lazy-loaded
      { path: "history", component: () => import("../views/profile/History.vue") }, // Lazy-loaded
      { path: "orders", component: () => import("../views/profile/Orders.vue") }, // Lazy-loaded
      { path: "payments", component: () => import("../views/profile/Payments.vue") }, // Lazy-loaded
    ],
  },

  // ✅ User pages wrapped in UserLayout
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", component: Home }, // Root URL is Home
      { path: "about", component: About },
      { path: "categories", component: CategoryList },
      { path: "products", component: ProductListPage },
      { path: "contact", component: Contact },
      { path: "favorites", component: FavouriteList }, // Lazy-loaded
      { path: "cart", component: CartList },
      {
        path: "/category/:name", // ✅ use name instead of id
        name: "category-products",
        component: () => import("@/components/CategoryProducts.vue"),
      },
      {
        path: '/product/:name',
        component: () => import('@/components/ProductDetailsPage.vue'),
        props: true
      },
      {
        path: '/event/:title',
        name: 'EventDetails',
        component: () => import('@/components/EventDetailsPage.vue'),
        props: true
      }      
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
  authStore.loadFromStorage();
  const token = authStore.token;

  if (to.path === "/login" || to.path === "/register") {
    if (token) {
      next(authStore.user?.role === "admin" ? "/dashboard" : "/");
    } else {
      next();
    }
  } else if (
    (to.path.startsWith("/dashboard") ||
      to.path.startsWith("/profile") ||
      to.path === "/category") &&
    !token
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
