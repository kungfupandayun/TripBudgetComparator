import React, { useState, useEffect } from 'react';
import './App.css';

function CurrencyConvertor() {
    const [currencies, setCurrencies] = useState([]);
    const [rates, setRates] = useState({});
    const [baseCurrency, setBaseCurrency] = useState('SGD');
    const [budget, setBudget] = useState(1000);
    const [targetCurrency, setTargetCurrency] = useState('MYR');
    const [comparison, setComparison] = useState(null);

    useEffect(() => {
        // Fetch currencies
        fetch('http://localhost:8081/api/currencies')
            .then(response => response.json())
            .then(data => {
                setCurrencies(data);
            })
            .catch(error => console.error('Error fetching currencies:', error));

        // Fetch rates
        fetch('http://localhost:8081/api/rates')
            .then(response => response.json())
            .then(data => setRates(data))
            .catch(error => console.error('Error fetching rates:', error));
    }, []);

    const handleBudgetChange = (event) => {
        setBudget(event.target.value);
    };

    const handleBaseCurrencyChange = (event) => {
        setBaseCurrency(event.target.value);
    };

    const handleTargetCurrencyChange = (event) => {
        setTargetCurrency(event.target.value);
    };

    const calculateComparison = () => {
        if (budget > 0 && rates[baseCurrency] && rates[targetCurrency]) {
            const baseRate = rates[baseCurrency];
            const targetRate = rates[targetCurrency];
            const convertedValue = (budget / baseRate) * targetRate;
            
            setComparison({
                base: baseCurrency,
                budget: budget,
                target: targetCurrency,
                amount: convertedValue.toFixed(2)
            });
        }
    };

    return (
        <div>
            <header className="App-header">
                <h1>Currency Convertor</h1>
            </header>
            <main>
                <div className="settings">
                    <div className="input-group">
                        <label htmlFor="budget">My Budget:</label>
                        <input id="budget" type="number" value={budget} onChange={handleBudgetChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="base-currency">From:</label>
                        <select id="base-currency" value={baseCurrency} onChange={handleBaseCurrencyChange}>
                            {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="target-currency">To:</label>
                        <select id="target-currency" value={targetCurrency} onChange={handleTargetCurrencyChange}>
                            {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button onClick={calculateComparison} className="compare-btn">Compare</button>

                {comparison && (
                    <div className="results">
                        <h2>Comparison Results</h2>
                        <p>{comparison.budget} {comparison.base} is equivalent to:</p>
                        <p>
                            <strong>{comparison.amount}</strong> {comparison.target}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default CurrencyConvertor;
