import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  keypadInfo: { itemId: number; name: string; value: number; discount: boolean }
  handleCancel: () => void
  handleSubmit: (value: number, type: 'PERCENTAGE' | 'AMOUNT') => void
}

export default function KeyPad({ keypadInfo, handleCancel, handleSubmit }: Props): JSX.Element {
  const { t } = useTranslation()
  const [input, setInput] = useState(keypadInfo.value.toString())
  const [type, setType] = useState<'PERCENTAGE' | 'AMOUNT'>('AMOUNT')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (keypadInfo && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }
  }, [keypadInfo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/

    if (e.target.value === '' || re.test(e.target.value)) {
      setInput(e.target.value)
    }
  }

  const handleKeypadInput = (key: string): void => {
    let newValue
    if (keypadInfo) {
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
    <div className="absolute bg-gray-700/75 w-screen h-screen z-50 top-0 left-0">
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="relative p-4 text-center bg-white rounded-2xl shadow">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 text-gray-600">
              {keypadInfo.discount
                ? t('Please enter x Discount', { name: keypadInfo.name })
                : t('Please enter x Quantity', { name: keypadInfo.name })}
            </div>
            <input
              onChange={handleInputChange}
              value={input}
              ref={inputRef}
              className="col-span-3 bg-gray-50 border border-gray-200 text-gray-900 text-2xl rounded-lg block p-2.5 h-24"
            ></input>
            {keypadInfo.discount && (
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <div className="">
                  <input
                    id="bordered-radio-1"
                    type="radio"
                    value="AMOUNT"
                    name="bordered-radio"
                    className="hidden peer"
                    checked={type === 'AMOUNT'}
                    onChange={(e) => setType(e.target.value as 'PERCENTAGE' | 'AMOUNT')}
                  />
                  <label
                    htmlFor="bordered-radio-1"
                    className="py-5 inline-flex w-full h-full border border-gray-200 rounded-xl justify-center items-center cursor-pointer peer-checked:bg-gray-200 peer-checked:text-gray-900"
                  >
                    $
                  </label>
                </div>
                <div className="">
                  <input
                    id="bordered-radio-2"
                    type="radio"
                    value="PERCENTAGE"
                    name="bordered-radio"
                    className="hidden peer"
                    checked={type === 'PERCENTAGE'}
                    onChange={(e) => setType(e.target.value as 'PERCENTAGE' | 'AMOUNT')}
                  />
                  <label
                    htmlFor="bordered-radio-2"
                    className="py-5 inline-flex w-full h-full border border-gray-200 rounded-xl justify-center items-center cursor-pointer peer-checked:bg-gray-200 peer-checked:text-gray-900"
                  >
                    %
                  </label>
                </div>
              </div>
            )}

            <div
              onClick={() => handleKeypadInput('7')}
              className="py-5 rounded-lg border border-gray-200"
            >
              7
            </div>
            <div
              onClick={() => handleKeypadInput('8')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              8
            </div>
            <div
              onClick={() => handleKeypadInput('9')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              9
            </div>
            <div
              onClick={() => handleKeypadInput('4')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              4
            </div>
            <div
              onClick={() => handleKeypadInput('5')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              5
            </div>
            <div
              onClick={() => handleKeypadInput('6')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              6
            </div>
            <div
              onClick={() => handleKeypadInput('1')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              1
            </div>
            <div
              onClick={() => handleKeypadInput('2')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              2
            </div>
            <div
              onClick={() => handleKeypadInput('3')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              3
            </div>
            <div
              onClick={() => handleKeypadInput('C')}
              className="py-5 rounded-lg border border-gray-200"
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
              onClick={() => handleKeypadInput('0')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              0
            </div>
            <div
              onClick={() => handleKeypadInput('.')}
              className="py-5 rounded-lg border border-gray-200 "
            >
              .
            </div>
            <div
              onClick={handleCancel}
              className="py-5 rounded-lg border border-gray-200 bg-red-600 text-white"
            >
              {t('Cancel')}
            </div>
            <div
              onClick={() => handleSubmit(Number(input), type)}
              className="col-span-2 py-5 rounded-lg border border-gray-200"
            >
              {t('Enter')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
