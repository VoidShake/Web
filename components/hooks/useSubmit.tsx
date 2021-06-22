import { Dispatch, FormEventHandler, useCallback, useState } from 'react'

type Method = 'POST' | 'PUT' | 'GET' | 'DELETE' | 'HEAD'
export default function useSubmit<T>(endpoint: string, data: Record<string, unknown> = {}, method: Method = 'POST', onSuccess?: Dispatch<T>) {
   const [error, setError] = useState<Error>()
   const [loading, setLoading] = useState(false)

   const onSubmit = useCallback<FormEventHandler>(
      async e => {
         e.preventDefault()
         setLoading(true)
         setError(undefined)

         try {
            const response = await fetch(`/api/${endpoint}`, {
               method,
               body: JSON.stringify(data),
               headers: {
                  'Content-Type': 'application/json',
               },
            })
            onSuccess?.(await response.json())
         } catch (e) {
            setError(e)
         } finally {
            setLoading(false)
         }
      },
      [endpoint, method, data, setLoading, setError, onSuccess]
   )

   return [onSubmit, error, loading] as [typeof onSubmit, typeof error, boolean]
}
