import React, { useState, useEffect } from 'react';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('SGD');
    const [category, setCategory] = useState('Food');
    const [currencies, setCurrencies] = useState([]);
    const [rates, setRates] = useState({});
    const [convertToCurrency, setConvertToCurrency] = useState('SGD');

    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState('');
    const [newTripName, setNewTripName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch currencies
        fetch('http://localhost:8081/api/currencies')
            .then(response => response.json())
            .then(data => {
                setCurrencies(data);
            })
            .catch(error => {
                console.error('Error fetching currencies:', error);
                setError('Failed to load currencies.');
            });
        
        // Fetch rates
        fetch('http://localhost:8081/api/rates')
            .then(response => response.json())
            .then(data => setRates(data))
            .catch(error => {
                console.error('Error fetching rates:', error);
                setError('Failed to load exchange rates.');
            });

        // Fetch trips
        fetch('http://localhost:8081/api/trips')
            .then(response => response.json())
            .then(data => {
                setTrips(data);
                if (data.length > 0) {
                    setSelectedTripId(data[0].id); // Select the first trip by default
                }
            })
            .catch(error => {
                console.error('Error fetching trips:', error);
                setError('Failed to load trips.');
            });

    }, []);

    useEffect(() => {
        // Fetch expenses for selected trip
        if (selectedTripId) {
            fetch(`http://localhost:8081/api/expenses?tripId=${selectedTripId}`)
                .then(response => response.json())
                .then(data => {
                    setExpenses(data);
                })
                .catch(error => {
                    console.error('Error fetching expenses:', error);
                    setError('Failed to load expenses.');
                });
        } else {
            setExpenses([]); // Clear expenses if no trip is selected
        }
    }, [selectedTripId]); // Refetch when selectedTripId changes

    const handleAddExpense = (e) => {
        e.preventDefault();
        setError('');
        
        const amountNum = parseFloat(amount);
        
        if (!description || !amount || !selectedTripId) {
            setError('Please fill in description, amount, and select a trip.');
            return;
        }
        
        if (amountNum <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }
        
        const newExpense = {
            description,
            amount: amountNum,
            currency,
            category,
            tripId: parseInt(selectedTripId),
        };

        fetch('http://localhost:8081/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExpense),
        })
            .then(response => response.json())
            .then(data => {
                setExpenses([...expenses, data]);
                // Reset form
                setDescription('');
                setAmount('');
            })
            .catch(error => {
                console.error('Error adding expense:', error);
                setError('Failed to add expense. Please try again.');
            });
    };

    const handleDeleteExpense = (id) => {
        fetch(`http://localhost:8081/api/expenses/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setExpenses(expenses.filter(expense => expense.id !== id));
                } else {
                    setError('Failed to delete expense.');
                }
            })
            .catch(error => {
                console.error('Error deleting expense:', error);
                setError('Failed to delete expense. Please try again.');
            });
    };

    const handleCreateTrip = (e) => {
        e.preventDefault();
        setError('');
        
        if (!newTripName) {
            setError('Please enter a trip name.');
            return;
        }

        fetch('http://localhost:8081/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newTripName }),
        })
            .then(response => response.json())
            .then(data => {
                setTrips([...trips, data]);
                setSelectedTripId(data.id); // Select the newly created trip
                setNewTripName('');
            })
            .catch(error => {
                console.error('Error creating trip:', error);
                setError('Failed to create trip. Please try again.');
            });
    };

    const getConvertedAmount = (expense) => {
        if (Object.keys(rates).length === 0) {
            return '...'; // Rates not loaded yet
        }
        const baseRate = rates[expense.currency];
        const targetRate = rates[convertToCurrency];
        if (baseRate && targetRate) {
            return ((expense.amount / baseRate) * targetRate).toFixed(2);
        }
        return 'N/A';
    };

    return (
        <div>
            <header className="App-header">
                <h1>Manage Your Trips & Expenses</h1>
            </header>
            <main>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                
                <div className="trip-management-section">
                    <div className="input-group">
                        <label htmlFor="new-trip-name">New Trip Name:</label>
                        <input
                            id="new-trip-name"
                            type="text"
                            value={newTripName}
                            onChange={(e) => setNewTripName(e.target.value)}
                        />
                        <button onClick={handleCreateTrip} className="compare-btn">Create Trip</button>
                    </div>

                    <div className="input-group">
                        <label htmlFor="select-trip">Select Trip:</label>
                        <select id="select-trip" value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
                            <option value="">-- Select a Trip --</option>
                            {trips.map(trip => (
                                <option key={trip.id} value={trip.id}>{trip.id}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <form onSubmit={handleAddExpense} className="expense-form">
                    <div className="input-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="amount">Amount:</label>
                        <input
                            id="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="currency">Currency:</label>
                        <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="category">Category:</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Tickets">Tickets</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="compare-btn">Add Expense</button>
                </form>

                <div className="results">
                    <h2>Expenses for {trips.find(t => t.id === parseInt(selectedTripId))?.name || 'Selected Trip'}:</h2>
                    <div className="input-group">
                        <label htmlFor="convert-to">Convert to:</label>
                        <select id="convert-to" value={convertToCurrency} onChange={(e) => setConvertToCurrency(e.target.value)}>
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Converted Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.id}>
                                    <td>{expense.description}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.amount.toFixed(2)} {expense.currency}</td>
                                    <td>{getConvertedAmount(expense)} {convertToCurrency}</td>
                                    <td><button onClick={() => handleDeleteExpense(expense.id)} className="delete-btn">Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Expenses;
