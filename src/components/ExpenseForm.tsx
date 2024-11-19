import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

const ExpenseForm = () => {
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });

  const [error, setError] = useState("");
  const [previousAmount, setPreviousAmount] = useState(0);

  const { state, remainingBudget, dispatch } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExtense = state.expenses.filter(
        (currentExpense) => currentExpense.id === state.editingId
      )[0];

      setExpense(editingExtense);
      setPreviousAmount(editingExtense.amount);
    }
  }, [state.editingId, state.expenses]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value,
    });
  };

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //validar si esta vacio o no

    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    //validar que no me pase del limite.

    if (expense.amount - previousAmount > remainingBudget) {
      setError("Ese gasto se sale del presupuesto");
      return;
    }

    //Agregar o Actualizar el gasto

    if (state.editingId) {
      dispatch({
        type: "update-expense",
        payload: {
          expense: {
            id: state.editingId,
            ...expense,
          },
        },
      });
    } else {
      dispatch({
        type: "add-expense",
        payload: {
          expense,
        },
      });
    }

    //reiniciar el state
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });

    setPreviousAmount(0);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el Nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade la cantidad del gasto ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          min={0}
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categorias:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value={""}>-- Seleccione --</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Fecha Gasto:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full text-white uppercase font-bold rounded-lg p-2 transition-colors ease-in-out hover:bg-blue-700"
        value={state.editingId ? "Editar gastos" : "Registrar Gastos"}
      />
    </form>
  );
};

export default ExpenseForm;
