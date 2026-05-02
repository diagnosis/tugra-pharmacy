// src/lib/currency/CurrencyContext.tsx
import {createContext, useContext, useState, useEffect, type ReactNode} from 'react'
import { useLang } from '@/lib/i18n/LangContext'

export type Currency = 'TRY' | 'USD' | 'EUR'

interface Rates {
    USD: number
    EUR: number
}

interface CurrencyContextType {
    currency: Currency
    setCurrency: (c: Currency) => void
    rates: Rates | null
    convert: (tryPrice: number) => number
    format: (tryPrice: number) => string
    symbol: string
    loading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

const DEFAULT_BY_LANG: Record<string, Currency> = {
    tr: 'TRY',
    en: 'EUR',
    ru: 'EUR',
    de: 'EUR',
}

const SYMBOLS: Record<Currency, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const { lang } = useLang()

    const [currency, setCurrencyState] = useState<Currency>(() => {
        const stored = localStorage.getItem('tugra-currency')
        return (stored as Currency) ?? DEFAULT_BY_LANG[lang] ?? 'TRY'
    })

    const [rates, setRates] = useState<Rates | null>(null)
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        localStorage.removeItem('tugra-currency-manual')

        const newCurrency = DEFAULT_BY_LANG[lang] ?? 'TRY'
        setCurrencyState(newCurrency)
        localStorage.setItem('tugra-currency', newCurrency)
    }, [lang])

    // fetch rates once on mount
    useEffect(() => {
        fetch('https://api.frankfurter.app/latest?from=TRY&to=USD,EUR')
            .then(r => r.json())
            .then(data => {
                setRates({
                    USD: data.rates.USD,
                    EUR: data.rates.EUR,
                })
            })
            .catch(() => {
                setRates({ USD: 0.028, EUR: 0.026 })
            })
            .finally(() => setLoading(false))
    }, [])

    const setCurrency = (c: Currency) => {
        localStorage.setItem('tugra-currency-manual', '1')
        setCurrencyState(c)
        localStorage.setItem('tugra-currency', c)
    }

    const convert = (tryPrice: number): number => {
        if (currency === 'TRY' || !rates) return tryPrice
        if (currency === 'USD') return Math.round(tryPrice * rates.USD * 100) / 100
        if (currency === 'EUR') return Math.round(tryPrice * rates.EUR * 100) / 100
        return tryPrice
    }

    const format = (tryPrice: number): string => {
        const converted = convert(tryPrice)
        const symbol = SYMBOLS[currency]
        if (currency === 'TRY') return `${symbol}${converted}`
        return `${symbol}${converted.toFixed(2)}`
    }

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency,
            rates,
            convert,
            format,
            symbol: SYMBOLS[currency],
            loading,
        }}>
            {children}
        </CurrencyContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrency() {
    const ctx = useContext(CurrencyContext)
    if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
    return ctx
}