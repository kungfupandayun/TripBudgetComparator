import React, { useState, useEffect } from 'react';

function TripComparison() {
    const [trips, setTrips] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);

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
    }, []);

    useEffect(() => {
        // Process data when trips and expenses are loaded
        if (trips.length > 0 && expenses.length > 0) {
            const data = trips.map(trip => {
                const tripExpenses = expenses.filter(expense => expense.tripId === trip.id);
                const total = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0); // Note: This doesn't account for different currencies yet
                
                const byCategory = tripExpenses.reduce((acc, expense) => {
                    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
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
    }, [trips, expenses]);

    return (
        <div>
            <header className="App-header">
                <h1>Trip Expense Comparison</h1>
            </header>
            <main>
                <div className="results">
                    <h2>Comparison by Trip</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Trip</th>
                                <th>Total Expenses (in original currency)</th>
                                {/* Add more columns for categories if needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map(data => (
                                <tr key={data.tripName}>
                                    <td>{data.tripName}</td>
                                    <td>{data.totalExpenses.toFixed(2)}</td>
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
