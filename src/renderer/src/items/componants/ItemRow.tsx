import { confirmAlert } from 'react-confirm-alert'
import { useNavigate } from 'react-router-dom'

type Props = {
  item: Item
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function ItemRow(props: Props): JSX.Element {
  const submit = (): void => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            aria-hidden="true"
            className="bg-gray-700/75 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-screen h-screen"
          >
            <div className="flex justify-center items-center h-screen w-screen">
              <div className="relative p-4 text-center bg-white rounded-2xl shadow">
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
    navigate('/items/edit/' + props.item.id, { replace: true })
  }
  return (
    <tr className="bg-white border-b border-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
        {props.item.id}
      </th>
      <td className="p-2">{props.item.name}</td>
      <td className="p-2">{props.item.description}</td>
      <td className="p-2">{props.item.barcode}</td>
      <td className="p-2">{props.item.unit}</td>
      <td className="p-2">{props.item.cost}</td>
      <td className="p-2">{props.item.price}</td>
      <td className="p-2">{props.item.tax}</td>
      <td className="p-2">{props.item.categoryId}</td>
      <td className="p-2">{props.item.supplierId}</td>
      <td className="p-2">
        <button className="cursor-pointer" onClick={handleEdit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 mx-1 text-blue-600 hover:text-blue-800"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
        <button className="cursor-pointer" onClick={submit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 mx-1 text-red-600 hover:text-red-800"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </td>
    </tr>
  )
}
