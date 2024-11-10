import { useLoaderData } from '@remix-run/react'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'

import { type loader } from './_index.tsx'

export function UsersTable() {
	const { users: initialUsers } = useLoaderData<typeof loader>()
	const [users, setUsers] = useState(() => initialUsers)

	return (
		<div className="ag-theme-material-dark ag-theme-material-custom">
			<AgGridReact
				domLayout="autoHeight"
				rowData={users}
				columnDefs={[
					{
						field: 'company',
					},
					{
						field: 'country',
					},
					{
						field: 'state',
					},
					{
						field: 'city',
					},
					{
						field: 'zipcode',
					},
					{
						field: 'employees',
					},
					{
						field: 'revenue',
						valueFormatter: (p) => '$' + p.value.toLocaleString(),
					},
					{
						field: 'website',
					},
					{
						field: 'sales_rep',
						headerName: 'Sales Rep',
					},
					{
						field: 'last_contacted',
						headerName: 'Last Contacted',
					},
					{
						field: 'purchased',
					},
					{
						field: 'notes',
					},
				]}
			/>
		</div>
	)
}
