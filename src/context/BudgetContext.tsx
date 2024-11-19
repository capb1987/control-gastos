import { createContext, Dispatch } from "react";
import { BudgetActions, BudgetState } from "../reducers/budget.reducer";

type BudgetContextProps = {
  state: BudgetState;
  dispatch: Dispatch<BudgetActions>;
  totalExpenses: number;
  remainingBudget: number;
};

export const BudgetContext = createContext<BudgetContextProps>(null!);
