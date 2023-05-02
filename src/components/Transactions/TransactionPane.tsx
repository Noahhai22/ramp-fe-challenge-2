import { useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approvedState, setApprovedState] = useState(transaction.approved)

  const handleApprovalChange = async (newValue: boolean) => {
    await consumerSetTransactionApproval({
      transactionId: transaction.id,
      newValue,
    })
  
    setApprovedState(newValue)
  }
  

  const isApproved = transaction.approved || approvedState

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={isApproved}
        disabled={loading}
        onChange={handleApprovalChange}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
