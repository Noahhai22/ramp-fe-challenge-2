import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)

  const transactions = useMemo(
    () => {
      if (transactionsByEmployee) {
        return transactionsByEmployee;
      } else {
        return paginatedTransactions?.data ?? null;
      }
    },
    [paginatedTransactions?.data, transactionsByEmployee]
  );
  

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    paginatedTransactionsUtils.invalidateData()
    transactionsByEmployeeUtils.invalidateData() // Invalidate transactionsByEmployee as well
    
    await employeeUtils.fetchAll()
    await paginatedTransactionsUtils.fetchAll()
  
    setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])
  
  

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      if (employeeId === EMPTY_EMPLOYEE.id) {
        // Reset transactionsByEmployee state to null and load all transactions
        transactionsByEmployeeUtils.setData(null)
        await paginatedTransactionsUtils.fetchAll()
      } else {
        // Load transactions for the selected employee
        await transactionsByEmployeeUtils.fetchById(employeeId)
      }
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )
  
  
  

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }

            await loadTransactionsByEmployee(newValue.id)
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
  <Transactions transactions={transactions} />

  {transactionsByEmployee === null && paginatedTransactions?.data !== null && paginatedTransactions?.nextPage && (
  <button
    className="RampButton"
    disabled={paginatedTransactionsUtils.loading}
    onClick={async () => {
      await loadAllTransactions()
    }}
  >
    View More
  </button>
)}

</div>

      </main>
    </Fragment>
  )
}
