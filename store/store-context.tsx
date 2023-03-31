import { createContext, ReactElement, useReducer } from "react";

type CoffeStore = {
  id: number;
  imgUrl: string;
  name: string;
  address: string;
  voting: number;
  neighbourhood: string;
};

type StoreContextState = {
  latLong: string;
  coffeStores: CoffeStore[];
};

type State = {
  state: StoreContextState;
  dispatch: any;
};

export const StoreContext = createContext<State>({
  state: { latLong: "", coffeStores: [] },
  dispatch: () => {},
});

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return {
        ...state,
        latLong: action.payload.latLong,
      };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      console.log("seting state for coffe stores", action.payload.coffeStores);
      return {
        ...state,
        coffeStores: action.payload.coffeStores,
      };
    }
    default:
      throw new Error(`unhandled aciton type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }: { children: ReactElement }) => {
  const initialState = {
    latLong: "",
    coffeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
