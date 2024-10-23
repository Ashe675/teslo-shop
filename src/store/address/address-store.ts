import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;
    };
    setAddress: (address: State['address']) => void;

}

export const useAddressStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                address: {
                    firstName: "",
                    lastName: "",
                    address: "",
                    address2: "",
                    postalCode: "",
                    city: "",
                    country: "",
                    phone: "",
                },
                setAddress: (address) => {
                    set({ address });
                }
            }),
            {
                name: "address-storage"
            }
        )
    )
)