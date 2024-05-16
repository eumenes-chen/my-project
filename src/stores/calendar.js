import { defineStore } from "pinia";
export const useCalendarStore = defineStore({
  id: "calendar",
  state: () => ({
    count: 0,
    dateInterval: {
      start:'',
      end:'',
    },
    currentDate: {
      date: "",
      info: {},
    },
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
    // setDateInterval(val) {
    //   this.state.dateInterval = val;
    //   console.log('this.state.dateInterval',this.state.dateInterval);
    // }
  },
});
