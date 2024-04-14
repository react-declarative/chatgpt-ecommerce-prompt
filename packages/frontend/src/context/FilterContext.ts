import { createStateProvider } from "react-declarative";

export interface IFilterData {
    [key: string]: unknown;
}

export const [FilterContextProvider, useFitlerContext] =
  createStateProvider<IFilterData>();

export default useFitlerContext;
