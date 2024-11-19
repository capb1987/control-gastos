import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import { useBudget } from "../hooks/useBudget";

const BudgetForm = () => {
  const [budget, setBudget] = useState(0);
  const { dispatch } = useBudget();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || budget <= 0) {
      setBudget(+e.target.value);
      return;
    }

    setBudget(e.target.valueAsNumber);
  };

  const isValid = useMemo(() => {
    return isNaN(budget) || budget <= 0;
  }, [budget]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "add-budget", payload: { budget } });
    setBudget(0);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-5">
        <label
          htmlFor="budget"
          className="text-4xl text-blue-600 text-center font-medium"
        >
          Definir Presupuesto
        </label>
        <input
          type="number"
          className="w-full bg-white border border-gray-300 rounded-md p-2"
          placeholder="Define tu presupuesto"
          name="budget"
          id="budget"
          value={budget}
          onChange={handleChange}
          min={0}
        />
      </div>
      <input
        type="submit"
        value="Definir Presupuesto"
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40"
        disabled={isValid}
      />
    </form>
  );
};

export default BudgetForm;
