
const STORAGE_KEY = "northstar-finance-dashboard";
const currencyConfig = {
  USD: { locale: "en-US", currency: "USD", rate: 1, label: "US Dollar" },
  INR: { locale: "en-IN", currency: "INR", rate: 83.15, label: "Indian Rupee" },
  EUR: { locale: "de-DE", currency: "EUR", rate: 0.92, label: "Euro" },
  GBP: { locale: "en-GB", currency: "GBP", rate: 0.79, label: "British Pound" },
  AED: { locale: "en-AE", currency: "AED", rate: 3.67, label: "UAE Dirham" },
  SGD: { locale: "en-SG", currency: "SGD", rate: 1.35, label: "Singapore Dollar" }
};

const defaultTransactions = [
  { id: "txn-1", name: "Salary Deposit", date: "2026-03-28", category: "Salary", type: "income", amount: 6200, note: "Monthly payroll" },
  { id: "txn-2", name: "Freelance Sprint", date: "2026-03-26", category: "Side Income", type: "income", amount: 980, note: "Landing page project" },
  { id: "txn-3", name: "Apartment Rent", date: "2026-03-24", category: "Housing", type: "expense", amount: 1650, note: "April rent paid early" },
  { id: "txn-4", name: "Whole Foods", date: "2026-03-23", category: "Groceries", type: "expense", amount: 148.32, note: "Weekly groceries" },
  { id: "txn-5", name: "Delta Flight", date: "2026-03-21", category: "Travel", type: "expense", amount: 420.45, note: "NYC client visit" },
  { id: "txn-6", name: "Netflix", date: "2026-03-19", category: "Subscriptions", type: "expense", amount: 19.99, note: "Streaming plan" },
  { id: "txn-7", name: "Restaurant Week", date: "2026-03-18", category: "Dining", type: "expense", amount: 86.7, note: "Dinner with friends" },
  { id: "txn-8", name: "ETF Auto-Invest", date: "2026-03-15", category: "Investments", type: "expense", amount: 600, note: "Brokerage contribution" },
  { id: "txn-9", name: "Electric Bill", date: "2026-03-14", category: "Utilities", type: "expense", amount: 112.48, note: "Monthly statement" },
  { id: "txn-10", name: "Performance Bonus", date: "2026-03-12", category: "Bonus", type: "income", amount: 1400, note: "Quarterly bonus" },
  { id: "txn-11", name: "Pharmacy", date: "2026-03-10", category: "Health", type: "expense", amount: 37.84, note: "Prescription refill" },
  { id: "txn-12", name: "Coffee Beans", date: "2026-03-08", category: "Groceries", type: "expense", amount: 24.16, note: "Pantry refill" },
  { id: "txn-13", name: "Sold Old Monitor", date: "2026-03-05", category: "Misc Income", type: "income", amount: 215, note: "Marketplace sale" },
  { id: "txn-14", name: "Gym Membership", date: "2026-03-02", category: "Health", type: "expense", amount: 59, note: "Monthly fitness plan" }
];

const state = loadState();

const nodes = {
  body: document.body,
  datasetBadge: document.getElementById("datasetBadge"),
  summaryCards: document.getElementById("summaryCards"),
  trendCaption: document.getElementById("trendCaption"),
  trendChart: document.getElementById("trendChart"),
  breakdownChart: document.getElementById("breakdownChart"),
  insightsList: document.getElementById("insightsList"),
  healthCard: document.getElementById("healthCard"),
  budgetList: document.getElementById("budgetList"),
  roleCard: document.getElementById("roleCard"),
  transactionsBody: document.getElementById("transactionsBody"),
  emptyState: document.getElementById("emptyState"),
  roleSelect: document.getElementById("roleSelect"),
  currencySelect: document.getElementById("currencySelect"),
  themeToggle: document.getElementById("themeToggle"),
  typeFilter: document.getElementById("typeFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  sortSelect: document.getElementById("sortSelect"),
  searchInput: document.getElementById("searchInput"),
  clearFiltersButton: document.getElementById("clearFiltersButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  exportJsonButton: document.getElementById("exportJsonButton"),
  addTransactionButton: document.getElementById("addTransactionButton"),
  dialog: document.getElementById("transactionDialog"),
  dialogTitle: document.getElementById("dialogTitle"),
  transactionForm: document.getElementById("transactionForm"),
  closeDialogButton: document.getElementById("closeDialogButton"),
  cancelDialogButton: document.getElementById("cancelDialogButton")
};

initialize();

function initialize() {
  syncTheme();
  syncControls();
  bindEvents();
  render();
}

function loadState() {
  const fallback = {
    theme: "light",
    role: "viewer",
    currency: "USD",
    filters: {
      search: "",
      type: "all",
      category: "all",
      sort: "date-desc"
    },
    transactions: defaultTransactions,
    editingId: null
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      filters: { ...fallback.filters, ...parsed.filters },
      currency: currencyConfig[parsed.currency] ? parsed.currency : fallback.currency,
      transactions: Array.isArray(parsed.transactions) && parsed.transactions.length ? parsed.transactions : fallback.transactions
    };
  } catch (error) {
    return fallback;
  }
}

function saveState() {
  const persistable = {
    theme: state.theme,
    role: state.role,
    currency: state.currency,
    filters: state.filters,
    transactions: state.transactions
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
}

function bindEvents() {
  nodes.roleSelect.addEventListener("change", (event) => {
    state.role = event.target.value;
    saveState();
    render();
  });

  nodes.currencySelect.addEventListener("change", (event) => {
    state.currency = event.target.value;
    saveState();
    render();
  });

  nodes.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    syncTheme();
    saveState();
  });

  nodes.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    render();
  });

  nodes.typeFilter.addEventListener("change", (event) => {
    state.filters.type = event.target.value;
    render();
  });

  nodes.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    render();
  });

  nodes.sortSelect.addEventListener("change", (event) => {
    state.filters.sort = event.target.value;
    render();
  });

  nodes.clearFiltersButton.addEventListener("click", () => {
    state.filters = { search: "", type: "all", category: "all", sort: "date-desc" };
    syncControls();
    render();
  });

  nodes.exportCsvButton.addEventListener("click", () => {
    downloadFile("northstar-transactions.csv", toCsv(state.transactions), "text/csv;charset=utf-8;");
  });

  nodes.exportJsonButton.addEventListener("click", () => {
    downloadFile("northstar-transactions.json", JSON.stringify(state.transactions, null, 2), "application/json;charset=utf-8;");
  });

  nodes.addTransactionButton.addEventListener("click", () => {
    if (state.role !== "admin") return;
    openDialog();
  });

  nodes.closeDialogButton.addEventListener("click", closeDialog);
  nodes.cancelDialogButton.addEventListener("click", closeDialog);

  nodes.transactionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.role !== "admin") return;

    const formData = new FormData(nodes.transactionForm);
    const payload = {
      id: state.editingId || `txn-${Date.now()}`,
      name: String(formData.get("name")).trim(),
      date: String(formData.get("date")),
      category: toTitleCase(String(formData.get("category")).trim()),
      type: String(formData.get("type")),
      amount: Number(formData.get("amount")),
      note: String(formData.get("note")).trim()
    };

    if (!payload.name || !payload.date || !payload.category || Number.isNaN(payload.amount) || payload.amount <= 0) {
      return;
    }

    if (state.editingId) {
      state.transactions = state.transactions.map((transaction) => transaction.id === state.editingId ? payload : transaction);
    } else {
      state.transactions = [payload, ...state.transactions];
    }

    state.editingId = null;
    saveState();
    closeDialog();
    render();
  });

  nodes.transactionsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='edit']");
    if (!button) return;
    if (state.role !== "admin") return;
    openDialog(button.dataset.id);
  });

  nodes.dialog.addEventListener("close", () => {
    state.editingId = null;
    nodes.transactionForm.reset();
  });
}

function syncTheme() {
  nodes.body.classList.toggle("dark", state.theme === "dark");
  nodes.themeToggle.textContent = state.theme === "dark" ? "Light theme" : "Dark theme";
}

function syncControls() {
  nodes.roleSelect.value = state.role;
  nodes.currencySelect.value = state.currency;
  nodes.searchInput.value = state.filters.search;
  nodes.typeFilter.value = state.filters.type;
  nodes.sortSelect.value = state.filters.sort;
}

function render() {
  saveState();
  renderCategoryOptions();
  syncControls();

  const allTransactions = sortTransactions([...state.transactions], "date-desc");
  const visibleTransactions = getFilteredTransactions();
  const summary = getSummary(allTransactions);
  const monthlyData = getMonthlySeries(allTransactions);
  const breakdown = getExpenseBreakdown(allTransactions);
  const insights = getInsights(allTransactions, summary, breakdown);
  const budgetStatus = getBudgetStatus(allTransactions);
  const healthScore = getHealthScore(summary, breakdown, budgetStatus);
  const activeCurrency = getActiveCurrency();

  nodes.datasetBadge.textContent = `${state.transactions.length} transactions loaded • ${activeCurrency.label}`;
  nodes.summaryCards.innerHTML = renderSummaryCards(summary);
  nodes.trendCaption.textContent = `${monthlyData.length} month trend based on running balance`;
  nodes.trendChart.innerHTML = renderTrendChart(monthlyData);
  nodes.breakdownChart.innerHTML = renderBreakdownChart(breakdown);
  nodes.insightsList.innerHTML = insights.map(renderInsightCard).join("");
  nodes.healthCard.innerHTML = renderHealthCard(healthScore);
  nodes.budgetList.innerHTML = budgetStatus.map(renderBudgetCard).join("");
  nodes.roleCard.innerHTML = renderRoleCard();
  nodes.transactionsBody.innerHTML = visibleTransactions.map((transaction) => renderTransactionRow(transaction)).join("");
  nodes.emptyState.hidden = visibleTransactions.length > 0;

  const adminMode = state.role === "admin";
  nodes.addTransactionButton.disabled = !adminMode;
  nodes.addTransactionButton.textContent = adminMode ? "Add transaction" : "Admin only";
}

function renderCategoryOptions() {
  const categories = [...new Set(state.transactions.map((transaction) => transaction.category))].sort((a, b) => a.localeCompare(b));
  const previous = state.filters.category;
  nodes.categoryFilter.innerHTML = ['<option value="all">All categories</option>', ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)].join("");
  nodes.categoryFilter.value = categories.includes(previous) ? previous : "all";
  state.filters.category = nodes.categoryFilter.value;
}

function getFilteredTransactions() {
  const query = state.filters.search.trim().toLowerCase();
  const filtered = state.transactions.filter((transaction) => {
    const matchesSearch = !query || [transaction.name, transaction.category, transaction.note].join(" ").toLowerCase().includes(query);
    const matchesType = state.filters.type === "all" || transaction.type === state.filters.type;
    const matchesCategory = state.filters.category === "all" || transaction.category === state.filters.category;
    return matchesSearch && matchesType && matchesCategory;
  });

  return sortTransactions(filtered, state.filters.sort);
}

function sortTransactions(transactions, sortBy) {
  return transactions.sort((left, right) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(left.date) - new Date(right.date);
      case "amount-desc":
        return right.amount - left.amount;
      case "amount-asc":
        return left.amount - right.amount;
      case "date-desc":
      default:
        return new Date(right.date) - new Date(left.date);
    }
  });
}

function getSummary(transactions) {
  const income = transactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = transactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((balance / income) * 100) : 0;

  return {
    income,
    expenses,
    balance,
    savingsRate
  };
}

function getMonthlySeries(transactions) {
  const grouped = transactions.reduce((map, transaction) => {
    const key = transaction.date.slice(0, 7);
    const current = map.get(key) || 0;
    const next = transaction.type === "income" ? current + transaction.amount : current - transaction.amount;
    map.set(key, next);
    return map;
  }, new Map());

  return [...grouped.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, net]) => ({ month, net }));
}

function getExpenseBreakdown(transactions) {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);

  if (!expenses.length) return [];

  const grouped = expenses.reduce((map, transaction) => {
    const current = map.get(transaction.category) || 0;
    map.set(transaction.category, current + transaction.amount);
    return map;
  }, new Map());

  return [...grouped.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percent: totalExpenses ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

function getInsights(transactions, summary, breakdown) {
  const currentMonth = "2026-03";
  const previousMonth = "2026-02";
  const totalsByMonth = transactions.reduce((accumulator, transaction) => {
    const month = transaction.date.slice(0, 7);
    if (!accumulator[month]) {
      accumulator[month] = { income: 0, expenses: 0 };
    }
    accumulator[month][transaction.type] += transaction.amount;
    return accumulator;
  }, {});

  const currentExpenses = totalsByMonth[currentMonth]?.expenses || 0;
  const previousExpenses = totalsByMonth[previousMonth]?.expenses || 0;
  const monthlyDelta = currentExpenses - previousExpenses;
  const topCategory = breakdown[0];
  const recurringCount = transactions.filter((transaction) => ["Subscriptions", "Housing", "Health"].includes(transaction.category)).length;

  return [
    {
      label: "Top spending category",
      value: topCategory ? topCategory.category : "No expenses",
      description: topCategory ? `${formatCurrency(topCategory.amount)} spent here, which is ${topCategory.percent.toFixed(1)}% of all expenses.` : "Add expense transactions to generate a category insight."
    },
    {
      label: "Monthly comparison",
      value: previousExpenses ? `${monthlyDelta >= 0 ? "+" : ""}${formatCurrency(monthlyDelta)}` : formatCurrency(currentExpenses),
      description: previousExpenses ? `Expense change from ${formatMonth(previousMonth)} to ${formatMonth(currentMonth)}.` : `Only ${formatMonth(currentMonth)} data is present, so this becomes the baseline month.`
    },
    {
      label: "Savings posture",
      value: `${summary.savingsRate.toFixed(1)}%`,
      description: summary.balance >= 0 ? "Net positive cash flow this period. Income comfortably exceeds expenses." : "Spending is outpacing income, so the dashboard flags a negative savings rate."
    },
    {
      label: "Recurring cost pressure",
      value: `${recurringCount} recurring items`,
      description: "Housing, subscriptions, and health costs are showing up often enough to watch as fixed commitments."
    }
  ];
}

function getBudgetStatus(transactions) {
  const budgetTargets = {
    Housing: 1800,
    Groceries: 450,
    Travel: 500,
    Dining: 220,
    Health: 160,
    Subscriptions: 80
  };

  return Object.entries(budgetTargets).map(([category, limit]) => {
    const spent = transactions
      .filter((transaction) => transaction.type === "expense" && transaction.category === category)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const usage = limit ? (spent / limit) * 100 : 0;
    return {
      category,
      limit,
      spent,
      usage,
      status: usage > 100 ? "danger" : usage > 80 ? "warning" : "healthy"
    };
  });
}

function getHealthScore(summary, breakdown, budgetStatus) {
  const savingsComponent = Math.max(0, Math.min(40, summary.savingsRate * 0.8));
  const concentrationPenalty = breakdown[0] ? Math.min(20, breakdown[0].percent * 0.18) : 0;
  const budgetPenalty = budgetStatus.filter((item) => item.status !== "healthy").length * 6;
  const baseScore = 78 + savingsComponent - concentrationPenalty - budgetPenalty;
  const score = Math.max(0, Math.min(100, Math.round(baseScore)));

  return {
    score,
    label: score >= 80 ? "Strong" : score >= 65 ? "Stable" : score >= 45 ? "Watch closely" : "Needs attention",
    summary: score >= 80
      ? "Healthy savings and manageable concentration risk."
      : score >= 65
        ? "Overall solid, but a few categories deserve closer monitoring."
        : "Budget pressure or concentration is starting to weaken the profile."
  };
}

function renderSummaryCards(summary) {
  const items = [
    { title: "Total balance", value: formatCurrency(summary.balance), meta: `${summary.balance >= 0 ? "Net gain" : "Net loss"} across loaded transactions`, tone: summary.balance >= 0 ? "income" : "expense" },
    { title: "Income", value: formatCurrency(summary.income), meta: "All income transactions in the current dataset", tone: "income" },
    { title: "Expenses", value: formatCurrency(summary.expenses), meta: `Savings rate: ${summary.savingsRate.toFixed(1)}%`, tone: "expense" }
  ];

  return items.map((item) => `
    <article class="summary-card ${item.tone}">
      <p class="summary-title">${item.title}</p>
      <p class="summary-value">${item.value}</p>
      <p class="summary-meta">${item.meta}</p>
    </article>
  `).join("");
}

function renderTrendChart(series) {
  if (!series.length) {
    return '<div class="empty-state"><h3>No trend data</h3><p>Add transactions to build the monthly balance view.</p></div>';
  }

  const width = 620;
  const height = 260;
  const padding = 28;
  const values = series.map((item) => item.net);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const range = max - min || 1;

  const points = series.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(series.length - 1, 1);
    const y = height - padding - ((item.net - min) / range) * (height - padding * 2);
    return { ...item, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const yAxisLabels = [max, (max + min) / 2, min];

  return `
    <svg class="trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly balance trend">
      ${yAxisLabels.map((label) => {
        const y = height - padding - ((label - min) / range) * (height - padding * 2);
        return `
          <line class="grid-line" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}"></line>
          <text class="axis-label" x="2" y="${y + 4}">${formatCompactCurrency(label)}</text>
        `;
      }).join("")}
      <line class="axis-line" x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}"></line>
      <path class="trend-area" d="${area}"></path>
      <path class="trend-path" d="${path}"></path>
      ${points.map((point) => `
        <g>
          <circle class="trend-point" cx="${point.x}" cy="${point.y}" r="5"></circle>
          <text class="axis-label" x="${point.x}" y="${height - 8}" text-anchor="middle">${formatMonth(point.month)}</text>
        </g>
      `).join("")}
    </svg>
  `;
}

function renderBreakdownChart(breakdown) {
  if (!breakdown.length) {
    return '<div class="empty-state"><h3>No expense breakdown</h3><p>Once expense data exists, category distribution appears here.</p></div>';
  }

  return `
    <div class="breakdown-list">
      ${breakdown.map((item) => `
        <div class="breakdown-row">
          <div class="breakdown-topline">
            <strong>${escapeHtml(item.category)}</strong>
            <span>${formatCurrency(item.amount)} • ${item.percent.toFixed(1)}%</span>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-fill" style="width: ${Math.max(item.percent, 4)}%"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderInsightCard(insight) {
  return `
    <article class="insight-card">
      <p class="section-label">${insight.label}</p>
      <p class="insight-value">${insight.value}</p>
      <p class="insight-text">${insight.description}</p>
    </article>
  `;
}

function renderHealthCard(healthScore) {
  return `
    <article class="health-card">
      <div class="health-meter">
        <div class="health-ring" style="--score:${healthScore.score}">
          <div class="health-score">${healthScore.score}</div>
        </div>
        <div class="health-meta">
          <strong>${healthScore.label}</strong>
          <p class="insight-text">${healthScore.summary}</p>
        </div>
      </div>
    </article>
  `;
}

function renderBudgetCard(item) {
  const width = Math.min(item.usage, 100);
  const statusLabel = item.status === "danger" ? "Over budget" : item.status === "warning" ? "Near limit" : "On track";

  return `
    <article class="budget-card">
      <div class="budget-topline">
        <strong>${item.category}</strong>
        <span class="tag">${statusLabel}</span>
      </div>
      <div class="budget-track">
        <div class="budget-fill ${item.status === "healthy" ? "" : item.status}" style="width:${width}%"></div>
      </div>
      <p class="budget-caption">${formatCurrency(item.spent)} used of ${formatCurrency(item.limit)} monthly target</p>
    </article>
  `;
}

function renderRoleCard() {
  const isAdmin = state.role === "admin";
  return `
    <p class="insight-value">${isAdmin ? "Admin mode" : "Viewer mode"}</p>
    <p class="role-copy">${isAdmin ? "Create and update transactions from the table or modal form." : "Read-only access keeps controls visible but disables write actions for the demo."}</p>
    <ul class="role-list">
      <li>${isAdmin ? "Can add transactions" : "Cannot add transactions"}</li>
      <li>${isAdmin ? "Can edit existing entries" : "Cannot edit existing entries"}</li>
      <li>Can always search, sort, and filter the dataset</li>
    </ul>
  `;
}

function renderTransactionRow(transaction) {
  const isAdmin = state.role === "admin";
  return `
    <tr>
      <td data-label="Transaction">
        <div class="transaction-name">
          <span class="transaction-title">${escapeHtml(transaction.name)}</span>
          <span class="transaction-note">${transaction.note ? escapeHtml(transaction.note) : "No note"}</span>
        </div>
      </td>
      <td data-label="Date">${formatDate(transaction.date)}</td>
      <td data-label="Category"><span class="tag">${escapeHtml(transaction.category)}</span></td>
      <td data-label="Type"><span class="type-pill ${transaction.type}">${toTitleCase(transaction.type)}</span></td>
      <td data-label="Amount" class="amount-cell ${transaction.type === "income" ? "positive" : "negative"}">${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}</td>
      <td data-label="Action"><button class="table-button" type="button" data-action="edit" data-id="${transaction.id}" ${isAdmin ? "" : "disabled"}>${isAdmin ? "Edit" : "View only"}</button></td>
    </tr>
  `;
}

function openDialog(transactionId = null) {
  state.editingId = transactionId;
  const editingTransaction = state.transactions.find((transaction) => transaction.id === transactionId);

  nodes.dialogTitle.textContent = editingTransaction ? "Edit transaction" : "Add transaction";
  nodes.transactionForm.reset();

  if (editingTransaction) {
    nodes.transactionForm.name.value = editingTransaction.name;
    nodes.transactionForm.date.value = editingTransaction.date;
    nodes.transactionForm.category.value = editingTransaction.category;
    nodes.transactionForm.type.value = editingTransaction.type;
    nodes.transactionForm.amount.value = editingTransaction.amount;
    nodes.transactionForm.note.value = editingTransaction.note || "";
  } else {
    nodes.transactionForm.date.value = "2026-04-01";
    nodes.transactionForm.type.value = "expense";
  }

  nodes.dialog.showModal();
}

function closeDialog() {
  if (nodes.dialog.open) {
    nodes.dialog.close();
  }
}

function formatCurrency(value) {
  const activeCurrency = getActiveCurrency();
  return new Intl.NumberFormat(activeCurrency.locale, {
    style: "currency",
    currency: activeCurrency.currency,
    maximumFractionDigits: 2
  }).format(convertAmount(value));
}

function formatCompactCurrency(value) {
  const activeCurrency = getActiveCurrency();
  return new Intl.NumberFormat(activeCurrency.locale, {
    style: "currency",
    currency: activeCurrency.currency,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(convertAmount(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function formatMonth(value) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit"
  }).format(new Date(year, month - 1, 1));
}

function toTitleCase(value) {
  return value.replace(/\w\S*/g, (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getActiveCurrency() {
  return currencyConfig[state.currency] || currencyConfig.USD;
}

function convertAmount(value) {
  return value * getActiveCurrency().rate;
}

function toCsv(transactions) {
  const headers = ["id", "name", "date", "category", "type", "amount", "note"];
  const rows = transactions.map((transaction) => headers.map((header) => escapeCsv(String(transaction[header] ?? ""))).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function escapeCsv(value) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
