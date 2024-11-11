import { useEffect } from 'react'
import { toast as showToast } from 'react-hot-toast'
import { type Toast } from '#app/utils/toast.server.ts'

export function useToast(toast?: Toast | null) {
	useEffect(() => {
		if (toast) {
			setTimeout(() => {
				if (toast.type === 'message') {
					showToast(toast.message, {
						id: toast.id,
					})
				} else {
					showToast[toast.type](toast.message, {
						id: toast.id,
					})
				}
			}, 0)
		}
	}, [toast])
}
