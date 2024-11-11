import { getInputProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useLoaderData } from '@remix-run/react'
import { AgGridReact } from 'ag-grid-react'
import { useQueryState } from 'nuqs'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import BootstrapForm from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { $path } from 'remix-routes'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'

import { NewUserSchema } from '#app/schemas/fakerapi.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { type loader } from './_index.tsx'

export function UsersTable() {
	const { users } = useLoaderData<typeof loader>()
	const [, setAction] = useQueryState('action')

	return (
		<div>
			<Stack
				direction="horizontal"
				gap={3}
				className="justify-content-end mb-3"
			>
				<ResetData />

				<Button
					className="px-3"
					size="sm"
					onClick={() => setAction('users:create')}
				>
					Add user
				</Button>
			</Stack>

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

			<AddUserModal />
		</div>
	)
}

export function ResetData() {
	const formAction = $path('/', {
		index: '',
		_action: 'resetData',
	})
	const isPending = useIsPending({
		formAction,
	})

	return (
		<Form action={formAction} method="post">
			<Button
				variant="outline-danger"
				className="px-3"
				size="sm"
				type="submit"
				disabled={isPending}
			>
				{isPending ? 'Resetting...' : 'Reset data'}
			</Button>
		</Form>
	)
}

export function AddUserModal() {
	const [action, setAction] = useQueryState('action')
	const [form, fields] = useForm({
		defaultValue: {
			company: 'Lebsack Inc',
			country: 'Chad',
			state: 'Iowa',
			city: 'Naderview',
			zipcode: '66189',
			employees: 1,
			revenue: 62933,
			website: 'https://google.com',
			sales_rep: 'Allison',
			last_contacted: '1991-05-31',
			purchased: true,
			notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: NewUserSchema })
		},
		shouldValidate: 'onSubmit',
		shouldRevalidate: 'onInput',
	})
	const formAction = $path('/', {
		index: '',
		_action: 'addNewUser',
	})
	const isPending = useIsPending({
		formAction,
	})

	async function handleClose() {
		await setAction(null)
	}

	return (
		<Modal size="lg" show={action === 'users:create'} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create new user</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<BootstrapForm
					as={Form}
					action={formAction}
					method="post"
					id={form.id}
					onSubmit={form.onSubmit}
					noValidate
				>
					<Row className="g-3">
						{/* Company Information */}
						<Col xs={12}>
							<h6 className="text-muted fw-normal mb-2">Company information</h6>
							<Row className="g-3">
								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										Company
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.company, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.company.errors?.length}
									/>
									{fields.company.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.company.errorId}
											type="invalid"
										>
											{fields.company.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={3}>
									<BootstrapForm.Label className="small fw-semibold">
										Employees
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.employees, { type: 'number' })}
										size="sm"
										isInvalid={!!fields.employees.errors?.length}
									/>
									{fields.employees.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.employees.errorId}
											type="invalid"
										>
											{fields.employees.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={3}>
									<BootstrapForm.Label className="small fw-semibold">
										Revenue
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.revenue, { type: 'number' })}
										size="sm"
										isInvalid={!!fields.revenue.errors?.length}
									/>
									{fields.revenue.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.revenue.errorId}
											type="invalid"
										>
											{fields.revenue.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={12}>
									<BootstrapForm.Label className="small fw-semibold">
										Website
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.website, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.website.errors?.length}
									/>
									{fields.website.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.website.errorId}
											type="invalid"
										>
											{fields.website.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>
							</Row>
						</Col>

						<Col xs={12}>
							<hr />
						</Col>

						{/* Location Information */}
						<Col xs={12}>
							<h6 className="text-muted mb-1">Location</h6>
							<Row className="g-3">
								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										Country
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.country, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.country.errors?.length}
									/>
									{fields.country.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.country.errorId}
											type="invalid"
										>
											{fields.country.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										State
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.state, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.state.errors?.length}
									/>
									{fields.state.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.state.errorId}
											type="invalid"
										>
											{fields.state.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										City
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.city, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.city.errors?.length}
									/>
									{fields.city.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.city.errorId}
											type="invalid"
										>
											{fields.city.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										Zipcode
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.zipcode, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.zipcode.errors?.length}
									/>
									{fields.zipcode.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.zipcode.errorId}
											type="invalid"
										>
											{fields.zipcode.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>
							</Row>
						</Col>

						<Col xs={12}>
							<hr />
						</Col>

						{/* Sales Information */}
						<Col xs={12}>
							<h6 className="text-muted mb-1">Sales information</h6>
							<Row className="g-3">
								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										Sales representative
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.sales_rep, { type: 'text' })}
										size="sm"
										isInvalid={!!fields.sales_rep.errors?.length}
									/>
									{fields.sales_rep.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.sales_rep.errorId}
											type="invalid"
										>
											{fields.sales_rep.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={6}>
									<BootstrapForm.Label className="small fw-semibold">
										Last contacted
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getInputProps(fields.last_contacted, { type: 'date' })}
										size="sm"
										isInvalid={!!fields.last_contacted.errors?.length}
									/>
									{fields.last_contacted.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.last_contacted.errorId}
											type="invalid"
										>
											{fields.last_contacted.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={12}>
									<BootstrapForm.Check
										{...getInputProps(fields.purchased, { type: 'checkbox' })}
										label="Has purchased"
										className="small fw-semibold"
										isInvalid={!!fields.purchased.errors?.length}
									/>
									{fields.purchased.errors?.length ? (
										<BootstrapForm.Control.Feedback
											id={fields.purchased.errorId}
											type="invalid"
										>
											{fields.purchased.errors?.join(', ')}
										</BootstrapForm.Control.Feedback>
									) : null}
								</BootstrapForm.Group>

								<BootstrapForm.Group as={Col} md={12}>
									<BootstrapForm.Label className="small fw-semibold">
										Notes
									</BootstrapForm.Label>
									<BootstrapForm.Control
										{...getTextareaProps(fields.notes)}
										as="textarea"
										size="sm"
										rows={3}
									/>
								</BootstrapForm.Group>
							</Row>
						</Col>
					</Row>
				</BootstrapForm>
			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="outline-secondary"
					className="px-3"
					onClick={handleClose}
					disabled={isPending}
				>
					Cancel
				</Button>
				<Button
					variant="primary"
					className="px-3"
					form={form.id}
					type="submit"
					disabled={isPending}
				>
					{isPending ? 'Saving...' : 'Save changes'}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
