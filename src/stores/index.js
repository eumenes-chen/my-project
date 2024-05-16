import { defineStore } from "pinia";
export const useCounterStore = defineStore({
  id: "main",
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
  actions: {
    add() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
