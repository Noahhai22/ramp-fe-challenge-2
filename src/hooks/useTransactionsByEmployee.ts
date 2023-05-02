import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const setData = useCallback((data: Transaction[] | null) => {
    setTransactionsByEmployee(data)
  }, [])

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )

      setData(data)
    },
    [fetchWithCache, setData]
  )

  const invalidateData = useCallback(() => {
    setData(null)
  }, [setData])

  return { data: transactionsByEmployee, setData, loading, fetchById, invalidateData }
}
