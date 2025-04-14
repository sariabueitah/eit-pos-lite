import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPage, showAlert } from '../state/slices/PageSlice'
import CategoryRow from './componants/CategoryRow'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Categories(): JSX.Element {
  const { t } = useTranslation()
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [deleted, setDeleted] = useState('ALL')
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(t('Categories')))
  }, [dispatch, t])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllCategories')
      .then((result) => {
        setCategoryData(result)
      })
      .catch((error) => {
        dispatch(showAlert(error.message))
      })
  }, [dispatch])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.electron.ipcRenderer
        .invoke('searchCategories', search.trim(), deleted)
        .then((result) => {
          setCategoryData(result)
        })
        .catch((e) => {
          dispatch(showAlert(e.message))
        })
    }, 500)
    return (): void => clearTimeout(timeoutId)
  }, [search, deleted, dispatch])

  const handleDelete = (id: number): void => {
    window.electron.ipcRenderer
      .invoke('deleteCategory', id)
      .then(() => {
        setCategoryData((l) => (l ? l.filter((item) => item.id !== id) : []))
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Error deleting Record')}: ` + e.message))
      })
  }

  return (
    <div className="">
      <NavLink
        className="absolute bottom-4 right-4 border border-gray-300 hover:bg-gray-300 rounded-2xl"
        to="/categories/new"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-16"
        >
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </NavLink>
      <div className="w-full grid grid-cols-4 gap-2 relative">
        <div className="col-span-4 flex items-center gap-2 justify-baseline">
          <input
            className="peer/all hidden"
            type="radio"
            id="radio1"
            name="radios"
            value="ALL"
            checked={deleted === 'ALL'}
            onChange={() => setDeleted('ALL')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/all:bg-gray-300 peer-checked/all:hover:bg-gray-400 rounded-xl"
            htmlFor="radio1"
          >
            {t('All')}
          </label>
          <input
            className="peer/active hidden"
            type="radio"
            id="radio2"
            name="radios"
            value="ACTIVE"
            checked={deleted === 'ACTIVE'}
            onChange={() => setDeleted('ACTIVE')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/active:bg-gray-300 peer-checked/active:hover:bg-gray-400 rounded-xl"
            htmlFor="radio2"
          >
            {t('Active')}
          </label>
          <input
            className="peer/deleted hidden"
            type="radio"
            id="radio3"
            name="radios"
            value="INACTIVE"
            checked={deleted === 'INACTIVE'}
            onChange={() => setDeleted('INACTIVE')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/deleted:bg-gray-300 peer-checked/deleted:hover:bg-gray-400 rounded-xl"
            htmlFor="radio3"
          >
            {t('Deleted')}
          </label>
        </div>
        <div className="col-span-4 relative my-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            id="search"
            placeholder={t('Search By ID or Name')}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 border"
          />
          <button
            type="submit"
            className="absolute z-10 top-0 end-0 p-2.5 text-sm font-medium h-full text-gray-900 bg-gray-100 rounded-e-lg border border-gray-300 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 overflow-x-scroll">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-2">
              {t('ID')}
            </th>
            <th scope="col" className="p-2">
              {t('Name')}
            </th>
            <th scope="col" className="p-2">
              {t('Actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryData &&
            categoryData.map((object) => (
              <CategoryRow
                onDelete={() => handleDelete(object.id)}
                category={object}
                key={object.id}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}
