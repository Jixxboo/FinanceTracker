import { useState } from "react";

export default function App() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const categories = ["Essen", "Freizeit", "Auto", "Haushalt"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const addValue = (value) => {
    setCurrentAmount((prev) => parseFloat((prev + value).toFixed(2)));
  };

  const reset = () => {
    setCurrentAmount(0);
    setSelectedCategory("");
    setShowCategories(false);
  };

  const handleInputClick = () => {
    //console.log("INPUT geklickt", currentAmount);
    if (currentAmount <= 0) return;
    setShowCategories(true);
  };

  const handleAddExpense = () => {
    if (currentAmount <= 0) return;
    if (!selectedCategory) return;

    const newExpense = {
      id: Date.now(),
      value: currentAmount,
      category: selectedCategory,
    };

    setExpenses((prev) => [...prev, newExpense]);

    setCurrentAmount(0);
    setSelectedCategory("");
    setShowCategories(false);
  };
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-4">
        <div className="w-full rounded-[32px] bg-slate-900 p-5 shadow-2xl">
          <p className="text-sm text-slate-400">Diese Woche</p>
          <p className="text-slate-500 text-sm">Budget: 140 CHF</p>

          <h1 className="mt-4 text-4xl font-bold text-teal-400">83.40 CHF</h1>
          <p className="text-slate-400">Noch verfügbar</p>

          <div className="mt-6 rounded-2xl bg-slate-800 p-4 border border-white/10">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Aktueller Betrag
              </p>

              <button
                onClick={reset}
                className="rounded-xl bg-pink-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-400 active:scale-95 transition"
              >
                DEL
              </button>
            </div>

            <p className="mt-4 text-center text-3xl font-semibold ">
              {currentAmount.toFixed(2)} CHF
            </p>
          </div>
          {!showCategories && (
            <div className="mt-6 grid grid-cols-4 gap-3">
              <button
                onClick={() => addValue(1)}
                className="btn border border-white/10"
              >
                1
              </button>
              <button
                onClick={() => addValue(2)}
                className="btn border border-white/10"
              >
                2
              </button>
              <button
                onClick={() => addValue(5)}
                className="btn border border-white/10"
              >
                5
              </button>
              <button
                onClick={() => addValue(0.5)}
                className="btn-small border border-white/10"
              >
                0.50
              </button>

              <button
                onClick={() => addValue(10)}
                className="btn border border-white/10"
              >
                10
              </button>
              <button
                onClick={() => addValue(20)}
                className="btn border border-white/10"
              >
                20
              </button>
              <button
                onClick={() => addValue(50)}
                className="btn border border-white/10"
              >
                50
              </button>
              <button
                onClick={() => addValue(0.2)}
                className="btn-small border border-white/10"
              >
                0.20
              </button>

              <button
                onClick={handleInputClick}
                className="btn-add col-span-3 border border-white/10"
              >
                INPUT
              </button>
              <button
                onClick={() => addValue(0.1)}
                className="btn-small border border-white/10"
              >
                0.10
              </button>
            </div>
          )}
          {showCategories && (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={
                      selectedCategory === category
                        ? "btn-add border border-white/10"
                        : "btn border border-white/10"
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddExpense}
                disabled={!selectedCategory}
                className="btn-add mt-4 w-full border border-white/10 disabled:opacity-50"
              >
                ADD
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
