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
          className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="sr-only">Info</span>
          <div>
            <ul>
              {Object.entries(props.alerts).map(([key, value]) => {
                return <li key={key}>{value?.message?.toString()}</li>
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
