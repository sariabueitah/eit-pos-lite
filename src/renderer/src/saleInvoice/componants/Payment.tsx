import { useState } from 'react'
import { roundNum } from '../../components/Math'

type Props = {
  payment: { paymentMethod: 'CASH' | 'CREDIT'; total: number }
  paymentComplete: (invoiceType: string) => void
  handleCancel: () => void
}

export default function Payment(props: Props): JSX.Element {
  const [input, setInput] = useState('0')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/

    if (e.target.value === '' || re.test(e.target.value)) {
      setInput(e.target.value)
    }
  }

  return (
    <div className="absolute bg-gray-700/75 w-screen h-screen z-50 top-0 left-0">
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="flex p-4 text-center bg-white rounded-2xl shadow">
          <div className="grid grid-cols-2 auto-rows-min m-2 min-w-30">
            <div className="text-left">Total:</div>
            <div className="text-right">{props.payment.total}</div>
            {props.payment.paymentMethod == 'CASH' && (
              <>
                <div className="text-left">Recieved:</div>
                <div className="text-right">{input}</div>
                <div className="text-left">Remainder:</div>
                <div className="text-right">{roundNum(Number(input) - props.payment.total)}</div>
              </>
            )}
            <hr className="my-5 h-0.25 border-t-0 bg-gray-200 col-span-2" />
            <div
              onClick={() => props.paymentComplete('Normal Invoice')}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              Invoice
            </div>
            <div
              onClick={() => props.paymentComplete('A4 Invoice')}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              Invoice A4
            </div>
            <div
              onClick={() => props.paymentComplete('No Invoice')}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              No Invoice
            </div>
            <div
              onClick={props.handleCancel}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              Cancel
            </div>
          </div>
          {props.payment.paymentMethod == 'CASH' && (
            <div className="grid grid-cols-3 gap-2 m-2 border-l border-gray-300 pl-4">
              <input
                onChange={handleInputChange}
                value={input}
                className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 h-24"
              ></input>
              <div
                onClick={() => setInput((prev) => prev + 7)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                7
              </div>
              <div
                onClick={() => setInput((prev) => prev + 8)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                8
              </div>
              <div
                onClick={() => setInput((prev) => prev + 9)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                9
              </div>
              <div
                onClick={() => setInput((prev) => prev + 6)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                6
              </div>
              <div
                onClick={() => setInput((prev) => prev + 5)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                5
              </div>
              <div
                onClick={() => setInput((prev) => prev + 4)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                4
              </div>
              <div
                onClick={() => setInput((prev) => prev + 3)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                3
              </div>
              <div
                onClick={() => setInput((prev) => prev + 2)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                2
              </div>
              <div
                onClick={() => setInput((prev) => prev + 1)}
                className="py-5 border rounded-lg border-gray-200 "
              >
                1
              </div>
              <div
                onClick={() => setInput((prev) => prev.slice(0, -1))}
                className="py-5 border rounded-lg border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                  />
                </svg>
              </div>
              <div
                onClick={() => setInput((prev) => prev + 0)}
                className="py-5 border rounded-lg border-gray-200"
              >
                0
              </div>
              <div
                onClick={() =>
                  setInput((prev) => {
                    if (prev.indexOf('.') == -1) {
                      return prev + '.'
                    } else {
                      return prev
                    }
                  })
                }
                className="py-5 border rounded-lg border-gray-200"
              >
                .
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
