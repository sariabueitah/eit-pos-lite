export default function UserRow({ obj }: { obj: User }): JSX.Element {
  return (
    <tr className="bg-white border-b border-gray-200">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900">
        {obj.id}
      </th>
      <td className="px-6 py-4">{obj.name}</td>
      <td className="px-6 py-4">{obj.user_name}</td>
      <td className="px-6 py-4">{obj.phone_number}</td>
      <td className="px-6 py-4">{obj.role}</td>
    </tr>
  )
}
