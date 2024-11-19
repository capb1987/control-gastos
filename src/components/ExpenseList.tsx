import { useMemo, useEffect, useState } from "react";
import { useBudget } from "../hooks/useBudget";
import ExpenseDetail from "./ExpenseDetail";

import { motion } from "framer-motion";

const ExpenseList = () => {
  const { state } = useBudget();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const filterExpenses = state.currentCategory
    ? state.expenses.filter(
        (expense) => expense.category === state.currentCategory
      )
    : state.expenses;

  const isEmpty = useMemo(() => filterExpenses.length === 0, [filterExpenses]);
  return (
    <div className="mt-10 bg-white shadow-lg rounded-lg p-5">
      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animate ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-2xl font-bold text-center">
            No hay Gastos...
          </p>
        </motion.div>
      ) : (
        <>
          <p className="text-gray-600 text-2xl font-bold my-5">
            Listado de Gastos
          </p>
          {filterExpenses.map((expense) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animate ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              key={expense.id}
            >
              <ExpenseDetail expense={expense} />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default ExpenseList;
