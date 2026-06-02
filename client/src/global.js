import { defineStore } from "pinia";
import { reactive } from "vue";
import api from "./api";

export const useGlobalStore = defineStore("global", () => {
	let user = reactive({
		token: localStorage.getItem("token"),
		id: null,
		email: null,
		isAdmin: false,
	});

	async function getUserDetails(token) {
		if (!token) {
			user.token = null;
			user.id = null;
			user.email = null;
			user.isAdmin = false;
			localStorage.removeItem("token");
			return;
		}

		try {
			let { data } = await api.get("/users/details");

			Object.assign(user, { ...data.user, token });
			localStorage.setItem("user", JSON.stringify(data.user));
		} catch (error) {
			user.token = null;
			user.id = null;
			user.email = null;
			user.isAdmin = false;
			localStorage.removeItem("token");
		}
	}

	return {
		user,
		getUserDetails,
	};
});
