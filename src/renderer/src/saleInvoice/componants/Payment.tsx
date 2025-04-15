import { useEffect, useRef, useState } from 'react'
import { roundNum } from '../../components/Math'
import { useTranslation } from 'react-i18next'

type Props = {
  payment: { paymentMethod: 'CASH' | 'CREDIT'; total: number }
  paymentComplete: (invoiceType: string) => void
  handleCancel: () => void
}

export default function Payment(props: Props): JSX.Element {
  const { t } = useTranslation()
  const [input, setInput] = useState('0')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.payment && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }
  }, [props.payment])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/

    if (e.target.value === '' || re.test(e.target.value)) {
      setInput(e.target.value)
    }
  }
  const handleKeypadInput = (key: string): void => {
    let newValue
    if (props.payment) {
      if (inputRef.current) {
        const selectedStart = inputRef.current.selectionStart
        const selectedEnd = inputRef.current.selectionEnd
        let cursor = inputRef.current.selectionStart || inputRef.current.value.length
        if (selectedStart !== null && selectedEnd !== null) {
          const value = inputRef.current.value
          switch (key) {
            case 'C':
              if (selectedStart === selectedEnd) {
                newValue = value.slice(0, selectedStart - 1) + value.slice(selectedEnd)
              } else {
                newValue = value.slice(0, selectedStart) + value.slice(selectedEnd)
              }
              cursor--
              break
            case '.':
              if (value.indexOf('.') == -1) {
                newValue = value.substring(0, selectedStart) + '.' + value.substring(selectedEnd)
                cursor++
              }
              break
            default:
              newValue = value.substring(0, selectedStart) + key + value.substring(selectedEnd)
              cursor++
              break
          }

          const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/

          if (newValue === '' || re.test(newValue)) {
            setInput(newValue)
          }
          inputRef.current.focus()
          setTimeout(() => {
            inputRef?.current?.setSelectionRange(cursor, cursor)
          }, 10)
        }
      }
    }
  }

  return (
    <div className="absolute bg-gray-700/75 w-screen h-screen z-20 top-0 left-0">
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="flex p-4 text-center bg-white rounded-2xl shadow">
          <div className="grid grid-cols-2 auto-rows-min m-2 min-w-30 rtl:border-l border-gray-300 rtl:pl-4">
            <div className="text-left rtl:text-right">{t('total')}:</div>
            <div className="text-right rtl:text-left">{props.payment.total}</div>
            {props.payment.paymentMethod == 'CASH' && (
              <>
                <div className="text-left rtl:text-right">{t('Recieved')}:</div>
                <div className="text-right rtl:text-left">{input}</div>
                <div className="text-left rtl:text-right">{t('Remainder')}:</div>
                <div className="text-right rtl:text-left">
                  {roundNum(Number(input) - props.payment.total)}
                </div>
              </>
            )}
            <hr className="my-5 h-0.25 border-t-0 bg-gray-200 col-span-2" />
            <div
              onClick={() => props.paymentComplete('Normal Invoice')}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              {t('Print Invoice')}
            </div>
            <div
              onClick={() => props.paymentComplete('A4 Invoice')}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              {t('Print Invoice(A4)')}
            </div>
            <div
              onClick={() => props.paymentComplete('No Invoice')}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              {t('No Invoice')}
            </div>
            <div
              onClick={props.handleCancel}
              className="mt-2 col-span-2 py-5 border rounded-lg border-gray-200"
            >
              {t('Cancel')}
            </div>
          </div>
          {props.payment.paymentMethod == 'CASH' && (
            <div className="grid grid-cols-3 gap-2 m-2 border-l rtl:border-none border-gray-300 pl-4 rtl:pl-0">
              <input
                ref={inputRef}
                onChange={handleInputChange}
                value={input}
                className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 h-24"
              ></input>
              <div
                onClick={() => handleKeypadInput('7')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                7
              </div>
              <div
                onClick={() => handleKeypadInput('8')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                8
              </div>
              <div
                onClick={() => handleKeypadInput('9')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                9
              </div>
              <div
                onClick={() => handleKeypadInput('6')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                6
              </div>
              <div
                onClick={() => handleKeypadInput('5')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                5
              </div>
              <div
                onClick={() => handleKeypadInput('4')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                4
              </div>
              <div
                onClick={() => handleKeypadInput('3')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                3
              </div>
              <div
                onClick={() => handleKeypadInput('2')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                2
              </div>
              <div
                onClick={() => handleKeypadInput('1')}
                className="py-5 border rounded-lg border-gray-200 "
              >
                1
              </div>
              <div
                onClick={() => handleKeypadInput('C')}
                className="py-5 border rounded-lg border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 m-auto rtl:rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                  />
                </svg>
              </div>
              <div
                onClick={() => handleKeypadInput('0')}
                className="py-5 border rounded-lg border-gray-200"
              >
                0
              </div>
              <div
                onClick={() => handleKeypadInput('.')}
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
