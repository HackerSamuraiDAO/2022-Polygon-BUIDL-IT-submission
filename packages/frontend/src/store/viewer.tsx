import { atom } from "recoil";

export const mapState = atom({
  key: "mapState",
  default: "2d",
});

export const isIntervalOn = atom({
  key: "isIntervalOn",
  default: false,
});

export const locationState = atom({
  key: "location",
  default: {
    lat: 35.65925011569792,
    lng: 139.70066309372865,
  },
});

export const currentLocationState = atom<{ lat?: number; lng?: number }>({
  key: "currentLocation",
  default: {
    lat: undefined,
    lng: undefined,
  },
});
