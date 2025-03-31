import { useState } from 'react'

type Props = {
  title: string
  handleCancel: () => void
  handleSubmit: (value: number) => void
}

export default function KeyPad({ title, handleCancel, handleSubmit }: Props): JSX.Element {
  const [input, setInput] = useState('')
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/

    if (e.target.value === '' || re.test(e.target.value)) {
      setInput(e.target.value)
    }
  }
  return (
    <div className="absolute bg-gray-700/75 w-screen h-screen z-50 top-0 left-0">
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="relative p-4 text-center bg-white rounded-2xl shadow">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 text-gray-600">
              Please enter <span className="text-black font-bold text-xl">{title}</span> quantity
            </div>
            <input
              onChange={handleInputChange}
              value={input}
              className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 h-24"
            ></input>
            <div
              onClick={() => setInput((prev) => prev + 7)}
              className="py-5 rounded-lg border border-gray-200"
            >
              7
            </div>
            <div
              onClick={() => setInput((prev) => prev + 8)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              8
            </div>
            <div
              onClick={() => setInput((prev) => prev + 9)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              9
            </div>
            <div
              onClick={() => setInput((prev) => prev + 6)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              6
            </div>
            <div
              onClick={() => setInput((prev) => prev + 5)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              5
            </div>
            <div
              onClick={() => setInput((prev) => prev + 4)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              4
            </div>
            <div
              onClick={() => setInput((prev) => prev + 3)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              3
            </div>
            <div
              onClick={() => setInput((prev) => prev + 2)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              2
            </div>
            <div
              onClick={() => setInput((prev) => prev + 1)}
              className="py-5 rounded-lg border border-gray-200 "
            >
              1
            </div>
            <div
              onClick={() => setInput((prev) => prev.slice(0, -1))}
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
              onClick={() => setInput((prev) => prev + 0)}
              className="py-5 rounded-lg border border-gray-200 "
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
              className="py-5 rounded-lg border border-gray-200 "
            >
              .
            </div>
            <div
              onClick={handleCancel}
              className="py-5 rounded-lg border border-gray-200 bg-red-600 text-white"
            >
              Cancel
            </div>
            <div
              onClick={() => handleSubmit(Number(input))}
              className="col-span-2 py-5 rounded-lg border border-gray-200"
            >
              Enter
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
