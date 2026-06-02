import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "notyf/notyf.min.css";
import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Logout from "./pages/Logout.vue";
import Register from "./pages/Register.vue";
import Posts from "./pages/Posts.vue";
import PostView from "./pages/PostView.vue";
import AddPost from "./pages/AddPost.vue";
import UpdatePost from "./pages/UpdatePost.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        {
            path: "/posts",
            name: "Posts",
            component: Posts,
        },
        {
            path: "/posts/:id",
            name: "PostView",
            component: PostView,
            props: true,
        },
        {
            path: "/add-post",
            name: "AddPost",
            component: AddPost,
        },
        {
            path: "/update-post/:id",
            name: "UpdatePost",
            component: UpdatePost,
            props: true,
        },
        {
            path: "/login",
            name: "Login",
            component: Login,
        },
        {
            path: "/logout",
            name: "Logout",
            component: Logout,
        },
        {
            path: "/register",
            name: "Register",
            component: Register,
        },
    ],
});

router.beforeEach((to, from) => {
    const token = localStorage.getItem("token");

    if (token && (to.name === "Login" || to.name === "Register")) {
        return { name: "Home" };
    }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
