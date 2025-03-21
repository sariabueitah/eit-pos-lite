import { useEffect, useState } from 'react'
import ItemRow from './componants/ItemRow'

export default function Items(): JSX.Element {
  const [itemData, seItemData] = useState<Item[]>([])
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllItems')
      .then((result) => {
        seItemData(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleDelete = (id: number): void => {
    window.electron.ipcRenderer
      .invoke('deleteItem', id)
      .then(() => {
        seItemData((l) => (l ? l.filter((item) => item.id !== id) : []))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <h1>Items Page</h1>

      <div className="">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                barcode
              </th>
              <th scope="col" className="px-6 py-3">
                unit
              </th>
              <th scope="col" className="px-6 py-3">
                cost
              </th>
              <th scope="col" className="px-6 py-3">
                price
              </th>
              <th scope="col" className="px-6 py-3">
                tax
              </th>
              <th scope="col" className="px-6 py-3">
                category
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {itemData &&
              itemData.map((object) => (
                <ItemRow onDelete={() => handleDelete(object.id)} item={object} key={object.id} />
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
