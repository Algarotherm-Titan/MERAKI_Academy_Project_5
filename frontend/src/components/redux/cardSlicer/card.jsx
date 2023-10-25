import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [],
  roomId: null,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCards: (state, action) => {
        state.cards = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
  },
  },
});
export const {setCards,setRoomId} = cardsSlice.actions;
export default cardsSlice.reducer;
       