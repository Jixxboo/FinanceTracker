import { useState, useEffect, useRef } from "react";

export default function App() {
  {
    /* ==== Use States ==== */
  }
  const [showMenu, setShowMenu] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("financeapp-expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [inputBudget, setInputBudget] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState(() => {
    const savedBudget = localStorage.getItem("financeapp-weeklyBudget");
    return savedBudget ? JSON.parse(savedBudget) : 0;
  });
  {
    /* ==== Static Data ==== */
  }
  const categories = ["Essen", "Freizeit", "Auto", "Haushalt"];
  const menuRef = useRef(null);
  {
    /* ==== Event Handlers / Actions ==== */
  }
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

  const handleSetBudget = () => {
    if (!inputBudget) return;

    const budget = Number(inputBudget);

    setWeeklyBudget(budget);
    localStorage.setItem("financeapp-weeklyBudget", JSON.stringify(budget));
  };

  const handleNewBudget = () => {
    setWeeklyBudget("");
    setInputBudget("");
    localStorage.removeItem("financeapp-weeklyBudget");
    localStorage.removeItem("financeapp-inputBudget");
  };

  const handleClearStorage = () => {
    // State zurücksetzen
    setWeeklyBudget("");
    setInputBudget("");
    setExpenses([]);
    // localStorage bereinigen
    localStorage.removeItem("financeapp-expenses");
    localStorage.removeItem("financeapp-weeklyBudget");
    localStorage.removeItem("financeapp-inputBudget");
  };
  const handleClearExpenses = () => {
    setExpenses([]);
    localStorage.removeItem("financeapp-expenses");
  };

  const deleteLastExpense = () => {
    setExpenses((prev) => prev.slice(0, -1));
  };

  {
    /* ==== Effects / localStorage ==== */
  }
  useEffect(() => {
    localStorage.setItem("financeapp-expenses", JSON.stringify(expenses));
  }, [expenses]);

  {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowMenu(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    /* ==== Calculations / Derived Data ==== */
  }
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

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const remainingBudget = weeklyBudget - totalSpent;

  const hasBudget = weeklyBudget > 0;

  //console.log(Number(localStorage.getItem("financeapp-weeklyBudget")));
  //console.log(typeof weeklyBudget);
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {!hasBudget ? (
        <div className="flex h-screen w-full items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[32px] bg-slate-900 p-5 shadow-2xl">
            <p className="text-sm text-slate-400 mb-2">
              Wochenbudget eingeben in CHF
            </p>
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Diese Woche</p>
                <p className="text-slate-500 text-sm">
                  Budget: {weeklyBudget} CHF
                </p>
                <div className="mt-4">
                  <p className="mt-3 text-slate-400 text-sm">Noch verfügbar</p>
                  <p className="text-4xl font-bold text-teal-400">
                    {remainingBudget.toFixed(2)} CHF
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 pr-2">
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="p-2 rounded-xl hover:bg-slate-700 active:scale-95 transition"
                  >
                    Menu
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                      />
                    </svg>
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-slate-800 p-2 shadow-xl z-50">
                        <button
                          onClick={() => {
                            handleNewBudget();
                            setShowMenu(false);
                          }}
                          className="w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-slate-700 transition"
                        >
                          New Budget
                        </button>

                        <button
                          onClick={() => {
                            handleClearExpenses();
                            setShowMenu(false);
                          }}
                          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-slate-700 transition"
                        >
                          Clear Expenses
                        </button>

                        <button
                          onClick={() => {
                            deleteLastExpense();
                            setShowMenu(false);
                          }}
                          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-slate-700 transition"
                        >
                          Delete last expense
                        </button>

                        <button
                          onClick={() => {
                            handleClearStorage();
                            setShowMenu(false);
                          }}
                          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-pink-300 hover:bg-slate-700 transition"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </button>
                </div>
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
              <div className="mt-4 flex justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-slate-400">Total Ausgaben</span>
                <span className="text-lg font-semibold text-red-400">
                  {totalSpent.toFixed(2)} CHF
                </span>
              </div>
            </div>

            {/* ==== Input Buttons (Zahlen + Input) ==== */}
            <div className="mt-auto">
              {/* ==== Input Box ====*/}
              <div>
                

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
                    <button
                      onClick={reset}
                      className="btn-bck mt-4 w-full border border-white/10 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAddExpense}
                      disabled={!selectedCategory}
                      className="btn-add mt-4 w-full border border-white/10 disabled:opacity-50"
                    >
                      ADD
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
