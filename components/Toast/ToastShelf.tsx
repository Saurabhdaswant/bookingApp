import { useContext } from "react"
import Toast from "./Toast"
import { ToastContext } from "./ToastProvider"

export default function ToastShelf() {
  const { toasts} = useContext(ToastContext)

  return (
    <ol className="fixed left-0 bottom-0 flex flex-col p-4 list-none gap-4 z-[200]">
      {toasts.length > 0 && toasts.map((toast) => (
        <li key={toast.id} >
          <Toast
            id={toast.id}
            variant={toast.variant}
          >
            {toast.message}
          </Toast>
        </li>
      ))}
    </ol>
  )
}
