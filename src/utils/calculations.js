// All dashboard/statistics numbers are derived here from the raw transaction
// list. In the API-backed version of this app (see the design doc) this same
// logic would live in a /api/transactions/summary endpoint on the server;
// here it runs client-side against localStorage data, but is kept in one
// place so the frontend never computes totals in more than one spot.

export function filterTransactions(transactions, { month, year, accountId, type, categoryId, search } = {}) {
  return transactions.filter((t) => {
    const d = new Date(t.date);
    if (month !== undefined && month !== 'all' && d.getMonth() !== Number(month)) return false;
    if (year !== undefined && year !== 'all' && d.getFullYear() !== Number(year)) return false;
    if (accountId && accountId !== 'all' && t.accountId !== accountId) return false;
    if (type && type !== 'all' && t.type !== type) return false;
    if (categoryId && categoryId !== 'all' && t.categoryId !== categoryId) return false;
    if (search) {
      const q = search.toLowerCase();
      const matches =
        t.title.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

export function computeSummary(transactions) {
  let income = 0;
  let expense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  transactions.forEach((t) => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      income += amt;
      incomeCount += 1;
    } else {
      expense += amt;
      expenseCount += 1;
    }
  });

  return {
    balance: income - expense,
    income,
    expense,
    incomeCount,
    expenseCount,
    total: incomeCount + expenseCount,
  };
}

// Compares current-period totals against the previous period of equal
// length (previous month, or previous year when "all months" is selected).
export function computeTrend(transactions, { month, year }) {
  if (month === 'all' || month === undefined || year === 'all' || year === undefined) {
    return { incomeChange: null, expenseChange: null, balanceChange: null };
  }
  const m = Number(month);
  const y = Number(year);
  const prevM = m === 0 ? 11 : m - 1;
  const prevY = m === 0 ? y - 1 : y;

  const current = computeSummary(
    filterTransactions(transactions, { month: m, year: y })
  );
  const previous = computeSummary(
    filterTransactions(transactions, { month: prevM, year: prevY })
  );

  const pct = (curr, prev) => {
    if (prev === 0) return curr === 0 ? 0 : 100;
    return Math.round(((curr - prev) / Math.abs(prev)) * 100);
  };

  return {
    incomeChange: pct(current.income, previous.income),
    expenseChange: pct(current.expense, previous.expense),
    balanceChange: pct(current.balance, previous.balance),
  };
}

export function computeCategoryBreakdown(transactions, categories) {
  const expenseTx = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenseTx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const byCategory = {};
  expenseTx.forEach((t) => {
    byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + (Number(t.amount) || 0);
  });

  return Object.entries(byCategory)
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        name: category ? category.name : 'Uncategorized',
        color: category ? category.color : '#8792a5',
        icon: category ? category.icon : '❔',
        amount,
        percent: totalExpense ? Math.round((amount / totalExpense) * 100) : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function computeMonthlySeries(transactions, year) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    income: 0,
    expense: 0,
  }));

  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() !== Number(year)) return;
    const idx = d.getMonth();
    if (t.type === 'income') months[idx].income += Number(t.amount) || 0;
    else months[idx].expense += Number(t.amount) || 0;
  });

  return months;
}

export function availableYears(transactions) {
  const years = new Set(transactions.map((t) => new Date(t.date).getFullYear()));
  years.add(new Date().getFullYear());
  return Array.from(years).sort((a, b) => b - a);
}
