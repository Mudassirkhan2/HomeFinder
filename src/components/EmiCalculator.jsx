import { useState, useMemo } from 'react'
import { FaCalculator, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const fmt = (n) =>
  Math.round(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

const EmiCalculator = ({ defaultAmount }) => {
  const [open, setOpen] = useState(false)
  const [principal, setPrincipal] = useState(defaultAmount || 0)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const r = rate / 12 / 100
    const n = tenure * 12
    if (!principal || !r || !n) return { emi: 0, totalInterest: 0, totalPayment: 0 }
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - principal
    return { emi, totalInterest, totalPayment }
  }, [principal, rate, tenure])

  return (
    <div className="mt-4 bg-surface dark:bg-dark-surface rounded-2xl shadow-lg border border-surface-border dark:border-dark-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-secondary dark:hover:bg-dark-bg transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-content-primary dark:text-white">
          <FaCalculator className="text-primary" /> EMI Calculator
        </span>
        {open ? <FaChevronUp className="text-content-muted" /> : <FaChevronDown className="text-content-muted" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-surface-border dark:border-dark-border">
          <div className="pt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-content-muted uppercase">Loan Amount (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(+e.target.value)}
                className="mt-1 w-full border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-content-muted uppercase">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="30"
                  value={rate}
                  onChange={(e) => setRate(+e.target.value)}
                  className="mt-1 w-full border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-content-muted uppercase">Tenure (years)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tenure}
                  onChange={(e) => setTenure(+e.target.value)}
                  className="mt-1 w-full border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 text-content-primary dark:text-white bg-surface dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
          </div>

          {emi > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-primary-light dark:bg-dark-bg rounded-xl p-3 text-center">
                <p className="text-xs text-content-muted mb-1">Monthly EMI</p>
                <p className="font-bold text-primary text-sm">{fmt(emi)}</p>
              </div>
              <div className="bg-surface-secondary dark:bg-dark-bg rounded-xl p-3 text-center border border-surface-border dark:border-dark-border">
                <p className="text-xs text-content-muted mb-1">Total Interest</p>
                <p className="font-bold text-content-primary dark:text-white text-sm">{fmt(totalInterest)}</p>
              </div>
              <div className="bg-surface-secondary dark:bg-dark-bg rounded-xl p-3 text-center border border-surface-border dark:border-dark-border">
                <p className="text-xs text-content-muted mb-1">Total Payment</p>
                <p className="font-bold text-content-primary dark:text-white text-sm">{fmt(totalPayment)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EmiCalculator
