import { FieldErrors } from 'react-hook-form/dist/types/errors'

type Props = {
  alerts: FieldErrors
}

const isEmptyObject = (obj: object): boolean => Object.keys(obj).length === 0

export default function FormAlerts(props: Props): JSX.Element {
  const show = !isEmptyObject(props.alerts)

  return (
    <>
      {show && (
        <div
          className="flex my-3 items-center mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="sr-only">Info</span>
          <div>
            <ul className="px-8 py-4">
              {Object.entries(props.alerts).map(([key, value]) => {
                return (
                  <li className="my-1 list-disc" key={key}>
                    {value?.message?.toString()}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
