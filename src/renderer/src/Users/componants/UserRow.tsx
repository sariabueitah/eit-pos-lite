import { confirmAlert } from 'react-confirm-alert'
import { useNavigate } from 'react-router-dom'

type Props = {
  user: User
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function UserRow(props: Props): JSX.Element {
  const submit = (): void => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            aria-hidden="true"
            className="bg-gray-700/75 flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
          >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
                <button
                  onClick={onClose}
                  type="button"
                  className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="deleteModal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <svg
                  className="text-gray-400 w-11 h-11 mb-3.5 mx-auto"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="mb-4 text-gray-500">Are you sure you want to delete this item?</p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={onClose}
                    data-modal-toggle="deleteModal"
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                  >
                    No, cancel
                  </button>
                  <button
                    onClick={(e) => {
                      props.onDelete(e)
                      onClose()
                    }}
                    type="submit"
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                  >
                    Yes, I&apos;m sure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    })
  }
  const navigate = useNavigate()
  const handleEdit = (): void => {
    navigate('/users/edit/' + props.user.id, { replace: true })
  }

  return (
    <tr className="bg-white border-b border-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
        {props.user.id}
      </th>
      <td className="px-6 py-4">{props.user.name}</td>
      <td className="px-6 py-4">{props.user.user_name}</td>
      <td className="px-6 py-4">{props.user.phone_number}</td>
      <td className="px-6 py-4">{props.user.role}</td>
      <td className="px-6 py-4">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={submit}>Delete</button>
      </td>
    </tr>
  )
}
