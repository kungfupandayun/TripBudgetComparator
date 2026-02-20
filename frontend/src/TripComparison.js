import React, { useState, useEffect } from 'react';

function TripComparison() {
    const [trips, setTrips] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [rates, setRates] = useState({});
    const [baseCurrency, setBaseCurrency] = useState('SGD');

    useEffect(() => {
        // Fetch all trips
        fetch('http://localhost:8081/api/trips')
            .then(response => response.json())
            .then(data => setTrips(data))
            .catch(error => console.error('Error fetching trips:', error));

        // Fetch all expenses
        fetch('http://localhost:8081/api/expenses')
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error fetching expenses:', error));

        // Fetch rates
        fetch(`http://localhost:8081/api/rates?baseCurrency=${baseCurrency}`)
            .then(response => response.json())
            .then(data => setRates(data))
            .catch(error => console.error('Error fetching rates:', error));
    }, [baseCurrency]);

    useEffect(() => {
        // Process data when trips and expenses are loaded
        if (trips.length > 0 && expenses.length > 0 && Object.keys(rates).length > 0) {
            const data = trips.map(trip => {
                const tripExpenses = expenses.filter(expense => expense.tripId === trip.id);
                
                // Convert all expenses to base currency
                const total = tripExpenses.reduce((sum, expense) => {
                    const expenseRate = rates[expense.currency];
                    const baseRate = rates[baseCurrency];
                    if (expenseRate && baseRate) {
                        // Convert to base currency
                        const convertedAmount = (expense.amount / expenseRate) * baseRate;
                        return sum + convertedAmount;
                    }
                    return sum;
                }, 0);
                
                const byCategory = tripExpenses.reduce((acc, expense) => {
                    const expenseRate = rates[expense.currency];
                    const baseRate = rates[baseCurrency];
                    let convertedAmount = expense.amount;
                    
                    if (expenseRate && baseRate) {
                        convertedAmount = (expense.amount / expenseRate) * baseRate;
                    }
                    
                    acc[expense.category] = (acc[expense.category] || 0) + convertedAmount;
                    return acc;
                }, {});

                return {
                    tripName: trip.name,
                    totalExpenses: total,
                    expensesByCategory: byCategory,
                };
            });
            setComparisonData(data);
        }
    }, [trips, expenses, rates, baseCurrency]);

    return (
        <div>
            <header className="App-header">
                <h1>Trip Expense Comparison</h1>
            </header>
            <main>
                <div className="results">
                    <div className="input-group">
                        <label htmlFor="base-currency">Display totals in:</label>
                        <select id="base-currency" value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
                            <option value="SGD">SGD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                            <option value="MYR">MYR</option>
                            <option value="THB">THB</option>
                        </select>
                    </div>
                    
                    <h2>Comparison by Trip</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Trip</th>
                                <th>Total Expenses ({baseCurrency})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map(data => (
                                <tr key={data.tripName}>
                                    <td>{data.tripName}</td>
                                    <td>{data.totalExpenses.toFixed(2)} {baseCurrency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default TripComparison;
