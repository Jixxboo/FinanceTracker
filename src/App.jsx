import { useState } from "react";

export default function App() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [inputBudget, setInputBudget] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState("");

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

  const groupedCategories = expenses.reduce((acc, expense) => {
    const category = expense.category || "Ohne Kategorie";
    const amount = Number(expense.value) || 0;

    acc[category] = (acc[category] || 0) + amount;

    return acc;
  }, {});

  const categoryList = Object.entries(groupedCategories).map(
    ([category, total]) => ({
      category,
      total,
    }),
  );

  const sortedCategories = categoryList.sort((a, b) => b.total - a.total);

  const max = sortedCategories[0]?.total || 1;

  const handleSetBudget = () => {
    if (!inputBudget) return;

    setWeeklyBudget(Number(inputBudget));
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const remainingBudget = weeklyBudget - totalSpent;

  const hasBudget = weeklyBudget !== "";

  //console.log(weeklyBudget);
  //console.log(typeof weeklyBudget);
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {!hasBudget ? (
        <div className="flex h-screen w-full items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[32px] bg-slate-900 p-5 shadow-2xl">
            <p className="text-sm text-slate-400 mb-2">Wochenbudget eingeben in CHF</p>
            {/* ==== User Budget input ==== */}
            <input
              type="number"
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
              className="w-full rounded-2xl bg-slate-800 p-3 border border-white/10 text-white"
              placeholder="z. B. 140"
            />

            <button
              onClick={handleSetBudget}
              className="mt-4 w-full rounded-2xl bg-teal-500 p-3 font-semibold text-slate-950"
            >
              Budget setzen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full flex-col p-4">
          <div className="flex flex-col h-full w-full rounded-[32px] bg-slate-900 p-5 shadow-2xl">
            {/* ==== Header ==== */}
            <div>
              <p className="text-sm text-slate-400">Diese Woche</p>
              <p className="text-slate-500 text-sm">
                Budget: {weeklyBudget} CHF
              </p>
            </div>
            {/* ==== Input Box ====*/}
            <div>
              <h1 className="mt-4 text-4xl font-bold text-teal-400">
                {remainingBudget.toFixed(2)} CHF
              </h1>
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
            </div>
            {/* ==== Expenses Overview (Diagramm kommt hier rein) ==== */}
            <div className="mt-6">
              <h2 className="text-sm text-slate-400 mb-2">
                Ausgaben nach Kategorien
              </h2>

              {categoryList.length === 0 && (
                <p className="text-slate-500 text-sm">Noch keine Ausgaben</p>
              )}

              {sortedCategories.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm py-1">
                    <span>{item.category}</span>

                    <span>{item.total.toFixed(2)} CHF</span>
                  </div>
                  <div
                    className="h-2 bg-slate-700 rounded-2xl transition-all"
                    style={{
                      width: `${Math.min((item.total * 100) / weeklyBudget, 100)}%`,
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* ==== Input Buttons (Zahlen + Input) ==== */}
            <div className="mt-auto">
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
        </div>
      )}
    </main>
  );
}
